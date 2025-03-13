// move/sources/paylines.move
module ngmi_slots::paylines {
    use std::vector;
    
    /// A position on the 3x3 grid, represented as [row, column]
    /// where both row and column are 0-indexed (0-2)
    struct Position has copy, drop, store {
        row: u8,
        col: u8,
    }
    
    /// A payline is a sequence of positions on the grid
    /// For a standard 3x3 grid, each payline has 3 positions
    struct Payline has copy, drop, store {
        /// Unique identifier for the payline
        id: u8,
        
        /// The sequence of positions that form this payline
        positions: vector<Position>,
        
        /// Whether this payline is active in the current game configuration
        active: bool,
    }
    
    /// Create a new position
    public fun new_position(row: u8, col: u8): Position {
        assert!(row < 3, 0); // Must be within 3x3 grid
        assert!(col < 3, 0); // Must be within 3x3 grid
        
        Position { row, col }
    }
    
    /// Get all paylines for the game
    /// Returns a vector of all defined paylines
    public fun get_paylines(): vector<Payline> {
        let paylines = vector::empty<Payline>();
        
        // Payline 1: Top row
        let positions1 = vector::empty<Position>();
        vector::push_back(&mut positions1, new_position(0, 0));
        vector::push_back(&mut positions1, new_position(0, 1));
        vector::push_back(&mut positions1, new_position(0, 2));
        vector::push_back(&mut paylines, Payline {
            id: 1,
            positions: positions1,
            active: true,
        });
        
        // Payline 2: Middle row
        let positions2 = vector::empty<Position>();
        vector::push_back(&mut positions2, new_position(1, 0));
        vector::push_back(&mut positions2, new_position(1, 1));
        vector::push_back(&mut positions2, new_position(1, 2));
        vector::push_back(&mut paylines, Payline {
            id: 2,
            positions: positions2,
            active: true,
        });
        
        // Payline 3: Bottom row
        let positions3 = vector::empty<Position>();
        vector::push_back(&mut positions3, new_position(2, 0));
        vector::push_back(&mut positions3, new_position(2, 1));
        vector::push_back(&mut positions3, new_position(2, 2));
        vector::push_back(&mut paylines, Payline {
            id: 3,
            positions: positions3,
            active: true,
        });
        
        // Payline 4: Diagonal from top-left to bottom-right
        let positions4 = vector::empty<Position>();
        vector::push_back(&mut positions4, new_position(0, 0));
        vector::push_back(&mut positions4, new_position(1, 1));
        vector::push_back(&mut positions4, new_position(2, 2));
        vector::push_back(&mut paylines, Payline {
            id: 4,
            positions: positions4,
            active: true,
        });
        
        // Payline 5: Diagonal from bottom-left to top-right
        let positions5 = vector::empty<Position>();
        vector::push_back(&mut positions5, new_position(2, 0));
        vector::push_back(&mut positions5, new_position(1, 1));
        vector::push_back(&mut positions5, new_position(0, 2));
        vector::push_back(&mut paylines, Payline {
            id: 5,
            positions: positions5,
            active: true,
        });
        
        // Additional paylines that are not active by default
        
        // Payline 6: First column
        let positions6 = vector::empty<Position>();
        vector::push_back(&mut positions6, new_position(0, 0));
        vector::push_back(&mut positions6, new_position(1, 0));
        vector::push_back(&mut positions6, new_position(2, 0));
        vector::push_back(&mut paylines, Payline {
            id: 6,
            positions: positions6,
            active: false,
        });
        
        // Payline 7: Second column
        let positions7 = vector::empty<Position>();
        vector::push_back(&mut positions7, new_position(0, 1));
        vector::push_back(&mut positions7, new_position(1, 1));
        vector::push_back(&mut positions7, new_position(2, 1));
        vector::push_back(&mut paylines, Payline {
            id: 7,
            positions: positions7,
            active: false,
        });
        
        // Payline 8: Third column
        let positions8 = vector::empty<Position>();
        vector::push_back(&mut positions8, new_position(0, 2));
        vector::push_back(&mut positions8, new_position(1, 2));
        vector::push_back(&mut positions8, new_position(2, 2));
        vector::push_back(&mut paylines, Payline {
            id: 8,
            positions: positions8,
            active: false,
        });
        
        paylines
    }
    
    /// Get only the active paylines
    public fun get_active_paylines(): vector<Payline> {
        let all_paylines = get_paylines();
        let active_paylines = vector::empty<Payline>();
        
        let i = 0;
        let len = vector::length(&all_paylines);
        
        while (i < len) {
            let payline = vector::borrow(&all_paylines, i);
            if (payline.active) {
                vector::push_back(&mut active_paylines, *payline);
            };
            i = i + 1;
        };
        
        active_paylines
    }
    
    /// Get a payline by ID
    public fun get_payline_by_id(id: u8): Payline {
        let all_paylines = get_paylines();
        let i = 0;
        let len = vector::length(&all_paylines);
        
        while (i < len) {
            let payline = vector::borrow(&all_paylines, i);
            if (payline.id == id) {
                return *payline
            };
            i = i + 1;
        };
        
        abort 0 // Payline not found
    }
    
    /// Get the positions for a specific symbol on the grid
    public fun get_symbol_positions(grid: &vector<vector<u8>>, symbol_id: u8): vector<Position> {
        let positions = vector::empty<Position>();
        
        let row = 0;
        while (row < 3) {
            let col = 0;
            while (col < 3) {
                let row_vec = vector::borrow(grid, row);
                let symbol = vector::borrow(row_vec, col);
                
                if (*symbol == symbol_id) {
                    vector::push_back(&mut positions, new_position(row, col));
                };
                
                col = col + 1;
            };
            row = row + 1;
        };
        
        positions
    }
    
    /// Check if a payline has a winning combination
    public fun check_payline_win(grid: &vector<vector<u8>>, payline: &Payline, wild_symbols: &vector<u8>): (bool, u8) {
        let positions = &payline.positions;
        
        // Need at least 3 positions for a payline
        if (vector::length(positions) < 3) {
            return (false, 0)
        };
        
        // Get the first symbol
        let pos = vector::borrow(positions, 0);
        let row_vec = vector::borrow(grid, pos.row);
        let first_symbol = *vector::borrow(row_vec, pos.col);
        
        // Special symbols can't form winning lines by themselves
        let is_multiplier = false;
        let multiplier_value = 1;
        
        // Check if all symbols in the payline match
        let i = 1;
        let len = vector::length(positions);
        
        while (i < len) {
            let pos = vector::borrow(positions, i);
            let row_vec = vector::borrow(grid, pos.row);
            let symbol = *vector::borrow(row_vec, pos.col);
            
            // Check for wild/special symbols
            let is_wild = false;
            let j = 0;
            let wild_len = vector::length(wild_symbols);
            
            while (j < wild_len) {
                if (*vector::borrow(wild_symbols, j) == symbol) {
                    is_wild = true;
                    
                    // Check if this is a multiplier
                    if (symbol == 7) { // 2x multiplier
                        is_multiplier = true;
                        multiplier_value = 2;
                    } else if (symbol == 8) { // 5x multiplier
                        is_multiplier = true;
                        if (multiplier_value < 5) {
                            multiplier_value = 5;
                        };
                    };
                    
                    break
                };
                j = j + 1;
            };
            
            // If this symbol doesn't match and isn't a wild
            if (symbol != first_symbol && !is_wild) {
                return (false, 0)
            };
            
            i = i + 1;
        };
        
        // Special case: if the first symbol itself is a wild/special
        let j = 0;
        let wild_len = vector::length(wild_symbols);
        
        while (j < wild_len) {
            if (*vector::borrow(wild_symbols, j) == first_symbol) {
                return (false, 0) // Wild/special symbols can't form winning lines by themselves
            };
            j = j + 1;
        };
        
        (true, multiplier_value)
    }
}