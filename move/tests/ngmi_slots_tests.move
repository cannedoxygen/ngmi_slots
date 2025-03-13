// move/tests/ngmi_slots_tests.move
#[test_only]
module ngmi_slots::ngmi_slots_tests {
    use std::debug;
    use std::vector;
    
    use sui::coin::{Self, Coin};
    use sui::sui::SUI;
    use sui::clock::{Self, Clock};
    use sui::test_scenario::{Self as ts, Scenario};
    
    use ngmi_slots::ngmi_slots::{Self, Game, PlayerState};
    
    // Test addresses
    const ADMIN: address = @0xACE;
    const PLAYER1: address = @0xCAFE;
    const PLAYER2: address = @0xBABE;
    
    // Game config for testing
    const MIN_BET: u64 = 5_000_000; // 0.005 SUI
    const MAX_BET: u64 = 100_000_000; // 0.1 SUI
    const HOUSE_EDGE_BPS: u64 = 500; // 5.00%
    const MAX_PAYOUT_MULTIPLIER: u64 = 100; // 100x
    
    #[test]
    fun test_create_game() {
        let scenario = ts::begin(ADMIN);
        
        // Create the game
        create_test_game(&mut scenario);
        
        // Verify game was created
        ts::next_tx(&mut scenario, ADMIN);
        {
            assert!(ts::has_shared<Game>(), 1);
        };
        
        ts::end(scenario);
    }
    
    #[test]
    fun test_fund_and_withdraw() {
        let scenario = ts::begin(ADMIN);
        
        // Create the game
        create_test_game(&mut scenario);
        
        // Fund the house balance
        ts::next_tx(&mut scenario, ADMIN);
        {
            let game = ts::take_shared<Game>(&scenario);
            let coin = coin::mint_for_testing<SUI>(500_000_000, ts::ctx(&mut scenario)); // 0.5 SUI
            
            ngmi_slots::fund_house_balance(&mut game, coin, ts::ctx(&mut scenario));
            
            ts::return_shared(game);
        };
        
        // Withdraw from house balance
        ts::next_tx(&mut scenario, ADMIN);
        {
            let game = ts::take_shared<Game>(&scenario);
            
            ngmi_slots::withdraw_house_balance(&mut game, 200_000_000, ts::ctx(&mut scenario)); // 0.2 SUI
            
            ts::return_shared(game);
        };
        
        // Check admin received the withdrawn amount
        ts::next_tx(&mut scenario, ADMIN);
        {
            let coin = ts::take_from_address<Coin<SUI>>(&scenario, ADMIN);
            assert!(coin::value(&coin) == 200_000_000, 2);
            ts::return_to_address(ADMIN, coin);
        };
        
        ts::end(scenario);
    }
    
    #[test]
    fun test_update_config() {
        let scenario = ts::begin(ADMIN);
        
        // Create the game
        create_test_game(&mut scenario);
        
        // Update game config
        ts::next_tx(&mut scenario, ADMIN);
        {
            let game = ts::take_shared<Game>(&scenario);
            
            ngmi_slots::update_game_config(
                &mut game,
                10_000_000, // new min bet
                200_000_000, // new max bet
                400, // new house edge (4.00%)
                50, // new max payout multiplier
                false, // not paused
                ts::ctx(&mut scenario)
            );
            
            ts::return_shared(game);
        };
        
        ts::end(scenario);
    }
    
    #[test]
    fun test_basic_spin() {
        let scenario = ts::begin(ADMIN);
        
        // Create the game and fund it
        create_test_game(&mut scenario);
        fund_game(&mut scenario, 1_000_000_000); // 1 SUI
        
        // Setup player with coins
        ts::next_tx(&mut scenario, PLAYER1);
        {
            let coin = coin::mint_for_testing<SUI>(500_000_000, ts::ctx(&mut scenario)); // 0.5 SUI
            ts::transfer_to_address(PLAYER1, coin);
        };
        
        // Perform a spin
        test_player_spin(&mut scenario, PLAYER1, 10_000_000); // 0.01 SUI bet
        
        ts::end(scenario);
    }
    
    #[test]
    fun test_multiple_spins() {
        let scenario = ts::begin(ADMIN);
        
        // Create the game and fund it
        create_test_game(&mut scenario);
        fund_game(&mut scenario, 2_000_000_000); // 2 SUI
        
        // Setup players with coins
        ts::next_tx(&mut scenario, PLAYER1);
        {
            let coin = coin::mint_for_testing<SUI>(1_000_000_000, ts::ctx(&mut scenario)); // 1 SUI
            ts::transfer_to_address(PLAYER1, coin);
        };
        
        ts::next_tx(&mut scenario, PLAYER2);
        {
            let coin = coin::mint_for_testing<SUI>(1_000_000_000, ts::ctx(&mut scenario)); // 1 SUI
            ts::transfer_to_address(PLAYER2, coin);
        };
        
        // Perform multiple spins
        test_player_spin(&mut scenario, PLAYER1, 20_000_000); // 0.02 SUI bet
        test_player_spin(&mut scenario, PLAYER2, 30_000_000); // 0.03 SUI bet
        test_player_spin(&mut scenario, PLAYER1, 40_000_000); // 0.04 SUI bet
        test_player_spin(&mut scenario, PLAYER2, 50_000_000); // 0.05 SUI bet
        
        ts::end(scenario);
    }
    
    #[test]
    #[expected_failure(abort_code = ngmi_slots::ngmi_slots::EInvalidBet)]
    fun test_invalid_bet_too_small() {
        let scenario = ts::begin(ADMIN);
        
        // Create the game and fund it
        create_test_game(&mut scenario);
        fund_game(&mut scenario, 1_000_000_000); // 1 SUI
        
        // Setup player with coins
        ts::next_tx(&mut scenario, PLAYER1);
        {
            let coin = coin::mint_for_testing<SUI>(500_000_000, ts::ctx(&mut scenario)); // 0.5 SUI
            ts::transfer_to_address(PLAYER1, coin);
        };
        
        // Attempt a spin with bet amount below minimum
        test_player_spin(&mut scenario, PLAYER1, 1_000_000); // 0.001 SUI bet (too small)
        
        ts::end(scenario);
    }
    
    #[test]
    #[expected_failure(abort_code = ngmi_slots::ngmi_slots::EInvalidBet)]
    fun test_invalid_bet_too_large() {
        let scenario = ts::begin(ADMIN);
        
        // Create the game and fund it
        create_test_game(&mut scenario);
        fund_game(&mut scenario, 1_000_000_000); // 1 SUI
        
        // Setup player with coins
        ts::next_tx(&mut scenario, PLAYER1);
        {
            let coin = coin::mint_for_testing<SUI>(500_000_000, ts::ctx(&mut scenario)); // 0.5 SUI
            ts::transfer_to_address(PLAYER1, coin);
        };
        
        // Attempt a spin with bet amount above maximum
        test_player_spin(&mut scenario, PLAYER1, 200_000_000); // 0.2 SUI bet (too large)
        
        ts::end(scenario);
    }
    
    // Helper function to create a test game
    fun create_test_game(scenario: &mut Scenario) {
        ts::next_tx(scenario, ADMIN);
        {
            ngmi_slots::create_game(
                MIN_BET,
                MAX_BET,
                HOUSE_EDGE_BPS,
                MAX_PAYOUT_MULTIPLIER,
                ts::ctx(scenario)
            );
        };
    }
    
    // Helper function to fund the game's house balance
    fun fund_game(scenario: &mut Scenario, amount: u64) {
        ts::next_tx(scenario, ADMIN);
        {
            let game = ts::take_shared<Game>(scenario);
            let coin = coin::mint_for_testing<SUI>(amount, ts::ctx(scenario));
            
            ngmi_slots::fund_house_balance(&mut game, coin, ts::ctx(scenario));
            
            ts::return_shared(game);
        };
    }
    
    // Helper function to perform a player spin
    fun test_player_spin(scenario: &mut Scenario, player: address, bet_amount: u64) {
        ts::next_tx(scenario, player);
        
        // Create clock for testing
        let clock = clock::create_for_testing(ts::ctx(scenario));
        
        {
            let game = ts::take_shared<Game>(scenario);
            
            // Take a coin from player
            let coin = ts::take_from_address<Coin<SUI>>(scenario, player);
            
            // Split the bet amount
            let bet_coin = coin::split(&mut coin, bet_amount, ts::ctx(scenario));
            
            // Create a client seed
            let client_seed = b"test_client_seed";
            
            debug::print(&string::utf8(b"Player performing spin"));
            debug::print(&player);
            debug::print(&bet_amount);
            
            // Perform the spin
            ngmi_slots::spin(
                &mut game,
                bet_coin,
                client_seed,
                &clock,
                ts::ctx(scenario)
            );
            
            // Return remaining coins to player
            ts::return_to_address(player, coin);
            
            // Return game object
            ts::return_shared(game);
        };
        
        // Destroy clock
        clock::destroy_for_testing(clock);
        
        // Check if player received any player state object
        ts::next_tx(scenario, player);
        {
            if (ts::has_most_recent_for_address<PlayerState>(player)) {
                let player_state = ts::take_from_address<PlayerState>(scenario, player);
                
                debug::print(&string::utf8(b"Player state after spin:"));
                debug::print(&player_state);
                
                ts::return_to_address(player, player_state);
            } else {
                debug::print(&string::utf8(b"No player state found"));
            };
        };
    }
}