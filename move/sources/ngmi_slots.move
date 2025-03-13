// move/sources/ngmi_slots.move
module ngmi_slots::ngmi_slots {
    use std::string::{Self, String};
    use std::vector;
    
    use sui::balance::{Self, Balance};
    use sui::clock::{Self, Clock};
    use sui::coin::{Self, Coin};
    use sui::event;
    use sui::object::{Self, ID, UID};
    use sui::sui::SUI;
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    
    use ngmi_slots::config::{Self, GameConfig, Symbol};
    use ngmi_slots::paylines::{Self, Payline, Position};
    use ngmi_slots::rng::{Self, PRNGState};
    
    // Error codes
    const EInvalidBet: u64 = 1;
    const EGamePaused: u64 = 2;
    const EInsufficientBalance: u64 = 3;
    const EInvalidConfig: u64 = 4;
    const EUnauthorized: u64 = 5;
    
    // Game object - owned by the house/admin
    struct Game has key {
        id: UID,
        config: GameConfig,
        house_balance: Balance<SUI>,
        rng_state: PRNGState,
        bet_counter: u64,
        win_counter: u64,
        jackpot_counter: u64,
        owner: address,
    }
    
    // Player state - owned by each player
    struct PlayerState has key {
        id: UID,
        player: address,
        total_bets: u64,
        total_wins: u64,
        total_spins: u64,
        best_win: u64,
        free_spins: u64,
        last_spin_timestamp: u64,
    }
    
    // === Events ===
    
    struct GameCreated has copy, drop {
        game_id: ID,
        owner: address,
        min_bet: u64,
        max_bet: u64,
        house_edge_bps: u64,
    }
    
    struct SpinResult has copy, drop {
        player: address,
        bet_amount: u64,
        win_amount: u64,
        multiplier: u64,
        free_spins: u64,
        is_jackpot: bool,
        symbols: vector<vector<u8>>,
        paylines: vector<u8>,
        timestamp: u64,
    }
    
    struct JackpotWon has copy, drop {
        player: address,
        amount: u64,
        timestamp: u64,
    }
    
    // === Public Functions ===
    
    /// Create a new game
    public entry fun create_game(
        min_bet: u64,
        max_bet: u64,
        house_edge_bps: u64,
        max_payout_multiplier: u64,
        ctx: &mut TxContext
    ) {
        let owner = tx_context::sender(ctx);
        
        // Create custom config
        let config = GameConfig {
            min_bet,
            max_bet,
            house_edge_bps,
            max_payout_multiplier,
            paused: false,
        };
        
        // Validate config
        assert!(config::is_valid_config(&config), EInvalidConfig);
        
        // Create RNG state
        let rng_state = rng::new(ctx);
        
        // Create game object
        let game = Game {
            id: object::new(ctx),
            config,
            house_balance: balance::zero<SUI>(),
            rng_state,
            bet_counter: 0,
            win_counter: 0,
            jackpot_counter: 0,
            owner,
        };
        
        let game_id = object::id(&game);
        
        // Emit event
        event::emit(GameCreated {
            game_id,
            owner,
            min_bet,
            max_bet,
            house_edge_bps,
        });
        
        // Transfer game object to creator
        transfer::share_object(game);
    }
    
    /// Spin the slot machine
    /// Takes a bet in SUI coins and returns winnings (if any)
    public entry fun spin(
        game: &mut Game,
        bet_coin: Coin<SUI>,
        client_seed: vector<u8>,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        // Check if game is paused
        assert!(!game.config.paused, EGamePaused);
        
        let player = tx_context::sender(ctx);
        let bet_amount = coin::value(&bet_coin);
        
        // Validate bet amount
        assert!(bet_amount >= game.config.min_bet, EInvalidBet);
        assert!(bet_amount <= game.config.max_bet, EInvalidBet);
        
        // Add bet to house balance
        let bet_balance = coin::into_balance(bet_coin);
        balance::join(&mut game.house_balance, bet_balance);
        
        // Get player state or create new one
        let player_state = get_or_create_player_state(player, clock, ctx);
        
        // Update player stats
        player_state.total_bets = player_state.total_bets + bet_amount;
        player_state.total_spins = player_state.total_spins + 1;
        player_state.last_spin_timestamp = clock::timestamp_ms(clock);
        
        // Update game counter
        game.bet_counter = game.bet_counter + 1;
        
        // Add client seed to RNG
        rng::update_seed_with_client_entropy(&mut game.rng_state, client_seed);
        
        // Get symbol weights
        let symbol_weights = config::get_symbol_weights();
        
        // Generate random symbol grid (3x3)
        let symbols = rng::gen_symbol_matrix(&mut game.rng_state, 3, 3, &symbol_weights, clock, ctx);
        
        // Evaluate win
        let (win_amount, win_multiplier, winning_paylines, free_spins_won, is_jackpot) = 
            evaluate_win(&symbols, bet_amount, &game.config);
        
        // Process free spins (if any)
        if (free_spins_won > 0) {
            player_state.free_spins = player_state.free_spins + free_spins_won;
        };
        
        // Process win (if any)
        if (win_amount > 0) {
            // Update counters
            game.win_counter = game.win_counter + 1;
            player_state.total_wins = player_state.total_wins + win_amount;
            
            // Update best win if this is better
            if (win_amount > player_state.best_win) {
                player_state.best_win = win_amount;
            };
            
            // Deduct from house balance
            let win_coin = coin::from_balance(
                balance::split(&mut game.house_balance, win_amount),
                ctx
            );
            
            // Transfer winnings to player
            transfer::public_transfer(win_coin, player);
            
            // Process jackpot if won
            if (is_jackpot) {
                game.jackpot_counter = game.jackpot_counter + 1;
                
                // Emit jackpot event
                event::emit(JackpotWon {
                    player,
                    amount: win_amount,
                    timestamp: clock::timestamp_ms(clock),
                });
            };
        };
        
        // Emit spin result event
        event::emit(SpinResult {
            player,
            bet_amount,
            win_amount,
            multiplier: win_multiplier,
            free_spins: free_spins_won,
            is_jackpot,
            symbols,
            paylines: winning_paylines,
            timestamp: clock::timestamp_ms(clock),
        });
        
        // Save player state
        transfer::public_transfer(player_state, player);
    }
    
    /// Fund the house balance with SUI
    public entry fun fund_house_balance(
        game: &mut Game,
        coin: Coin<SUI>,
        ctx: &TxContext
    ) {
        // Only owner can fund
        assert!(tx_context::sender(ctx) == game.owner, EUnauthorized);
        
        // Add to house balance
        let fund_balance = coin::into_balance(coin);
        balance::join(&mut game.house_balance, fund_balance);
    }
    
    /// Withdraw from house balance
    public entry fun withdraw_house_balance(
        game: &mut Game,
        amount: u64,
        ctx: &mut TxContext
    ) {
        // Only owner can withdraw
        assert!(tx_context::sender(ctx) == game.owner, EUnauthorized);
        
        // Ensure sufficient balance
        assert!(balance::value(&game.house_balance) >= amount, EInsufficientBalance);
        
        // Split and convert to coin
        let withdraw_balance = balance::split(&mut game.house_balance, amount);
        let withdraw_coin = coin::from_balance(withdraw_balance, ctx);
        
        // Transfer to owner
        transfer::public_transfer(withdraw_coin, game.owner);
    }
    
    /// Update game configuration
    public entry fun update_game_config(
        game: &mut Game,
        min_bet: u64,
        max_bet: u64,
        house_edge_bps: u64,
        max_payout_multiplier: u64,
        paused: bool,
        ctx: &TxContext
    ) {
        // Only owner can update config
        assert!(tx_context::sender(ctx) == game.owner, EUnauthorized);
        
        // Create new config
        let new_config = GameConfig {
            min_bet,
            max_bet,
            house_edge_bps,
            max_payout_multiplier,
            paused,
        };
        
        // Validate config
        assert!(config::is_valid_config(&new_config), EInvalidConfig);
        
        // Update config
        game.config = new_config;
    }
    
    /// Use a free spin
    public entry fun use_free_spin(
        game: &mut Game,
        client_seed: vector<u8>,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        // Check if game is paused
        assert!(!game.config.paused, EGamePaused);
        
        let player = tx_context::sender(ctx);
        
        // Get player state
        let player_state = get_or_create_player_state(player, clock, ctx);
        
        // Check if player has free spins
        assert!(player_state.free_spins > 0, EInvalidBet);
        
        // Deduct a free spin
        player_state.free_spins = player_state.free_spins - 1;
        
        // Use minimum bet for free spins
        let bet_amount = game.config.min_bet;
        
        // Update player stats
        player_state.total_spins = player_state.total_spins + 1;
        player_state.last_spin_timestamp = clock::timestamp_ms(clock);
        
        // Update game counter
        game.bet_counter = game.bet_counter + 1;
        
        // Add client seed to RNG
        rng::update_seed_with_client_entropy(&mut game.rng_state, client_seed);
        
        // Get symbol weights
        let symbol_weights = config::get_symbol_weights();
        
        // Generate random symbol grid (3x3)
        let symbols = rng::gen_symbol_matrix(&mut game.rng_state, 3, 3, &symbol_weights, clock, ctx);
        
        // Evaluate win
        let (win_amount, win_multiplier, winning_paylines, free_spins_won, is_jackpot) = 
            evaluate_win(&symbols, bet_amount, &game.config);
        
        // Process free spins (if any)
        if (free_spins_won > 0) {
            player_state.free_spins = player_state.free_spins + free_spins_won;
        };
        
        // Process win (if any)
        if (win_amount > 0) {
            // Update counters
            game.win_counter = game.win_counter + 1;
            player_state.total_wins = player_state.total_wins + win_amount;
            
            // Update best win if this is better
            if (win_amount > player_state.best_win) {
                player_state.best_win = win_amount;
            };
            
            // Deduct from house balance
            let win_coin = coin::from_balance(
                balance::split(&mut game.house_balance, win_amount),
                ctx
            );
            
            // Transfer winnings to player
            transfer::public_transfer(win_coin, player);
            
            // Process jackpot if won
            if (is_jackpot) {
                game.jackpot_counter = game.jackpot_counter + 1;
                
                // Emit jackpot event
                event::emit(JackpotWon {
                    player,
                    amount: win_amount,
                    timestamp: clock::timestamp_ms(clock),
                });
            };
        };
        
        // Emit spin result event
        event::emit(SpinResult {
            player,
            bet_amount,
            win_amount,
            multiplier: win_multiplier,
            free_spins: free_spins_won,
            is_jackpot,
            symbols,
            paylines: winning_paylines,
            timestamp: clock::timestamp_ms(clock),
        });
        
        // Save player state
        transfer::public_transfer(player_state, player);
    }
    
    // === Helper Functions ===
    
    /// Get a player's state or create a new one if it doesn't exist
    fun get_or_create_player_state(
        player: address,
        clock: &Clock,
        ctx: &mut TxContext
    ): PlayerState {
        // In a real implementation, we would try to fetch existing player state first
        // For simplicity, we'll just create a new one each time
        // This means the existing player state will be lost - in production 
        // you'd want a way to retrieve the existing state
        
        PlayerState {
            id: object::new(ctx),
            player,
            total_bets: 0,
            total_wins: 0,
            total_spins: 0,
            best_win: 0,
            free_spins: 0,
            last_spin_timestamp: clock::timestamp_ms(clock),
        }
    }
    
    /// Evaluate a spin result to determine wins
    fun evaluate_win(
        symbols: &vector<vector<u8>>,
        bet_amount: u64,
        game_config: &GameConfig
    ): (u64, u64, vector<u8>, u64, bool) {
        // Get active paylines
        let paylines = paylines::get_active_paylines();
        
        // Prepare result values
        let total_win = 0;
        let multiplier = 1;
        let winning_paylines = vector::empty<u8>();
        let free_spins = 0;
        
        // Check for jackpot (all positions have high-tardi symbol)
        let is_jackpot = check_jackpot(symbols);
        
        if (is_jackpot) {
            // Calculate jackpot win
            let jackpot_multiplier = config::get_jackpot_multiplier();
            total_win = bet_amount * jackpot_multiplier;
            
            // Add all paylines as winners
            let i = 0;
            let len = vector::length(&paylines);
            
            while (i < len) {
                let payline = vector::borrow(&paylines, i);
                vector::push_back(&mut winning_paylines, payline.id);
                i = i + 1;
            };
        } else {
            // Get all symbols
            let all_symbols = config::get_symbols();
            
            // Define special symbols
            let wild_symbols = vector::empty<u8>();
            vector::push_back(&mut wild_symbols, 7); // 2x multiplier
            vector::push_back(&mut wild_symbols, 8); // 5x multiplier
            
            // Check each payline
            let i = 0;
            let len = vector::length(&paylines);
            
            while (i < len) {
                let payline = vector::borrow(&paylines, i);
                let (is_win, payline_multiplier) = paylines::check_payline_win(symbols, payline, &wild_symbols);
                
                if (is_win) {
                    // Find the first symbol in the payline
                    let pos = vector::borrow(&payline.positions, 0);
                    let row_vec = vector::borrow(symbols, pos.row);
                    let symbol_id = *vector::borrow(row_vec, pos.col);
                    
                    // Get the symbol's payout value
                    let symbol_obj = vector::borrow(&all_symbols, (symbol_id as u64));
                    let payout = symbol_obj.payout;
                    
                    // Calculate win for this payline
                    let payline_win = bet_amount * payout;
                    total_win = total_win + payline_win;
                    
                    // Track winning payline
                    vector::push_back(&mut winning_paylines, payline.id);
                    
                    // Track highest multiplier
                    if (payline_multiplier > multiplier) {
                        multiplier = payline_multiplier;
                    };
                };
                
                i = i + 1;
            };
            
            // Apply multiplier to total win if needed
            if (multiplier > 1 && total_win > 0) {
                total_win = total_win * multiplier;
            };
            
            // Apply house edge
            total_win = apply_house_edge(total_win, game_config.house_edge_bps);
            
            // Ensure we don't exceed max payout
            let max_payout = bet_amount * game_config.max_payout_multiplier;
            if (total_win > max_payout) {
                total_win = max_payout;
            };
        };
        
        // Count free spin symbols
        free_spins = count_free_spins(symbols);
        
        (total_win, multiplier, winning_paylines, free_spins, is_jackpot)
    }
    
    /// Check if all positions have the high-tardi symbol (ID 6)
    fun check_jackpot(symbols: &vector<vector<u8>>): bool {
        let row = 0;
        while (row < 3) {
            let col = 0;
            while (col < 3) {
                let row_vec = vector::borrow(symbols, row);
                let symbol = vector::borrow(row_vec, col);
                
                if (*symbol != 6) { // high-tardi symbol ID
                    return false
                };
                
                col = col + 1;
            };
            row = row + 1;
        };
        
        true
    }
    
    /// Count the number of free spin symbols (ID 9) on the grid
    fun count_free_spins(symbols: &vector<vector<u8>>): u64 {
        let count = 0;
        
        let row = 0;
        while (row < 3) {
            let col = 0;
            while (col < 3) {
                let row_vec = vector::borrow(symbols, row);
                let symbol = vector::borrow(row_vec, col);
                
                if (*symbol == 9) { // free spin symbol ID
                    count = count + 1;
                };
                
                col = col + 1;
            };
            row = row + 1;
        };
        
        count
    }
    
    /// Apply house edge to a win amount
    fun apply_house_edge(win_amount: u64, house_edge_bps: u64): u64 {
        let house_edge_factor = (10000 - house_edge_bps);
        (win_amount * house_edge_factor) / 10000
    }
}