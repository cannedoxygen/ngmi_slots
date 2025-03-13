// move/sources/config.move
module ngmi_slots::config {
    use std::string::{Self, String};
    
    /// Game configuration constants
    struct GameConfig has copy, drop, store {
        /// Minimum bet amount in MIST (1 SUI = 10^9 MIST)
        min_bet: u64,
        
        /// Maximum bet amount in MIST
        max_bet: u64,
        
        /// House edge in basis points (e.g., 500 = 5.00%)
        house_edge_bps: u64,
        
        /// Maximum payout multiplier
        max_payout_multiplier: u64,
        
        /// Whether the game is paused
        paused: bool,
    }
    
    /// Symbol configuration
    struct Symbol has copy, drop, store {
        /// Symbol identifier
        id: u8,
        
        /// Symbol name
        name: String,
        
        /// Payout multiplier
        payout: u64,
        
        /// Whether this is a special symbol
        is_special: bool,
        
        /// Special symbol type (0 = regular, 1 = multiplier, 2 = free spin)
        special_type: u8,
        
        /// Special value (for multipliers or free spins)
        special_value: u64,
    }
    
    /// Default game configuration
    public fun default_game_config(): GameConfig {
        GameConfig {
            min_bet: 5_000_000, // 0.005 SUI
            max_bet: 100_000_000, // 0.1 SUI
            house_edge_bps: 500, // 5.00%
            max_payout_multiplier: 100, // 100x
            paused: false,
        }
    }
    
    /// Get all symbols for the game
    public fun get_symbols(): vector<Symbol> {
        let symbols = vector::empty<Symbol>();
        
        // Low tier symbols
        vector::push_back(&mut symbols, Symbol {
            id: 0,
            name: string::utf8(b"Gear"),
            payout: 5,
            is_special: false,
            special_type: 0,
            special_value: 0,
        });
        
        vector::push_back(&mut symbols, Symbol {
            id: 1,
            name: string::utf8(b"Token"),
            payout: 8,
            is_special: false,
            special_type: 0,
            special_value: 0,
        });
        
        vector::push_back(&mut symbols, Symbol {
            id: 2,
            name: string::utf8(b"Badge"),
            payout: 10,
            is_special: false,
            special_type: 0,
            special_value: 0,
        });
        
        // Mid tier symbols
        vector::push_back(&mut symbols, Symbol {
            id: 3,
            name: string::utf8(b"Robot"),
            payout: 15,
            is_special: false,
            special_type: 0,
            special_value: 0,
        });
        
        vector::push_back(&mut symbols, Symbol {
            id: 4,
            name: string::utf8(b"Helmet"),
            payout: 20,
            is_special: false,
            special_type: 0,
            special_value: 0,
        });
        
        vector::push_back(&mut symbols, Symbol {
            id: 5,
            name: string::utf8(b"Future"),
            payout: 25,
            is_special: false,
            special_type: 0,
            special_value: 0,
        });
        
        // High tier symbol
        vector::push_back(&mut symbols, Symbol {
            id: 6,
            name: string::utf8(b"TARDI"),
            payout: 50,
            is_special: false,
            special_type: 0,
            special_value: 0,
        });
        
        // Special symbols
        vector::push_back(&mut symbols, Symbol {
            id: 7,
            name: string::utf8(b"2x Multiplier"),
            payout: 0,
            is_special: true,
            special_type: 1, // Multiplier
            special_value: 2, // 2x
        });
        
        vector::push_back(&mut symbols, Symbol {
            id: 8,
            name: string::utf8(b"5x Multiplier"),
            payout: 0,
            is_special: true,
            special_type: 1, // Multiplier
            special_value: 5, // 5x
        });
        
        vector::push_back(&mut symbols, Symbol {
            id: 9,
            name: string::utf8(b"Free Spin"),
            payout: 0,
            is_special: true,
            special_type: 2, // Free Spin
            special_value: 1, // 1 free spin
        });
        
        symbols
    }
    
    /// Get symbol weights for RNG
    /// These determine the probability of each symbol appearing
    public fun get_symbol_weights(): vector<u64> {
        let weights = vector::empty<u64>();
        
        // Low tier symbols (higher weights = more common)
        vector::push_back(&mut weights, 20); // Gear
        vector::push_back(&mut weights, 20); // Token
        vector::push_back(&mut weights, 20); // Badge
        
        // Mid tier symbols
        vector::push_back(&mut weights, 15); // Robot
        vector::push_back(&mut weights, 10); // Helmet
        vector::push_back(&mut weights, 10); // Future
        
        // High tier symbol
        vector::push_back(&mut weights, 5);  // TARDI
        
        // Special symbols
        vector::push_back(&mut weights, 5);  // 2x Multiplier
        vector::push_back(&mut weights, 3);  // 5x Multiplier
        vector::push_back(&mut weights, 10); // Free Spin
        
        weights
    }
    
    /// Get the jackpot multiplier
    public fun get_jackpot_multiplier(): u64 {
        50 // 50x bet amount
    }
    
    /// Check if the game is configured correctly
    public fun is_valid_config(config: &GameConfig): bool {
        config.min_bet > 0 &&
        config.max_bet >= config.min_bet &&
        config.house_edge_bps <= 10000 // Max 100%
    }
}