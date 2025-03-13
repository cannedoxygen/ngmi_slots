// move/tests/rng_tests.move
#[test_only]
module ngmi_slots::rng_tests {
    use std::debug;
    use std::vector;
    
    use sui::clock::{Self, Clock};
    use sui::test_scenario::{Self as ts, Scenario};
    use sui::test_utils;
    
    use ngmi_slots::rng::{Self, PRNGState};
    
    const ADMIN: address = @0xACE;
    
    #[test]
    fun test_rng_gen_range() {
        let scenario = ts::begin(ADMIN);
        
        // Set up
        let clock = clock::create_for_testing(&mut ts::ctx(&mut scenario));
        
        // Test multiple random number generations
        test_gen_range(&mut scenario, &clock);
        
        // Clean up
        clock::destroy_for_testing(clock);
        ts::end(scenario);
    }
    
    #[test]
    fun test_rng_gen_weighted() {
        let scenario = ts::begin(ADMIN);
        
        // Set up
        let clock = clock::create_for_testing(&mut ts::ctx(&mut scenario));
        
        // Test weighted random generation
        test_gen_weighted(&mut scenario, &clock);
        
        // Clean up
        clock::destroy_for_testing(clock);
        ts::end(scenario);
    }
    
    #[test]
    fun test_rng_gen_symbol_matrix() {
        let scenario = ts::begin(ADMIN);
        
        // Set up
        let clock = clock::create_for_testing(&mut ts::ctx(&mut scenario));
        
        // Test symbol matrix generation
        test_gen_matrix(&mut scenario, &clock);
        
        // Clean up
        clock::destroy_for_testing(clock);
        ts::end(scenario);
    }
    
    #[test]
    fun test_rng_client_entropy() {
        let scenario = ts::begin(ADMIN);
        
        // Set up
        let clock = clock::create_for_testing(&mut ts::ctx(&mut scenario));
        
        // Test client entropy integration
        test_client_entropy(&mut scenario, &clock);
        
        // Clean up
        clock::destroy_for_testing(clock);
        ts::end(scenario);
    }
    
    // Helper function to test random number generation
    fun test_gen_range(scenario: &mut Scenario, clock: &Clock) {
        ts::next_tx(scenario, ADMIN);
        
        // Create new PRNG state
        let rng_state = rng::new(&mut ts::ctx(scenario));
        
        // Generate random numbers and ensure they're within range
        let range = 100;
        let count = 10;
        let i = 0;
        
        debug::print(&string::utf8(b"Testing random number generation"));
        
        while (i < count) {
            let random_num = rng::gen_range(&mut rng_state, range, clock, &ts::ctx(scenario));
            
            // Ensure number is within range
            assert!(random_num < range, 1);
            
            debug::print(&random_num);
            i = i + 1;
        };
        
        // Generate a vector of random numbers
        let random_vec = rng::gen_range_vec(&mut rng_state, range, count, clock, &ts::ctx(scenario));
        
        // Check vector length
        assert!(vector::length(&random_vec) == count, 2);
        
        // Check each number is within range
        i = 0;
        while (i < count) {
            let num = *vector::borrow(&random_vec, i);
            assert!(num < range, 3);
            i = i + 1;
        };
        
        // Clean up
        test_utils::destroy(rng_state);
    }
    
    // Helper function to test weighted random generation
    fun test_gen_weighted(scenario: &mut Scenario, clock: &Clock) {
        ts::next_tx(scenario, ADMIN);
        
        // Create new PRNG state
        let rng_state = rng::new(&mut ts::ctx(scenario));
        
        // Create weight vector
        let weights = vector::empty<u64>();
        vector::push_back(&mut weights, 10); // 10% chance for index 0
        vector::push_back(&mut weights, 20); // 20% chance for index 1
        vector::push_back(&mut weights, 30); // 30% chance for index 2
        vector::push_back(&mut weights, 40); // 40% chance for index 3
        
        debug::print(&string::utf8(b"Testing weighted random generation"));
        
        // Track occurrences for rough distribution check
        let counts = vector::empty<u64>();
        vector::push_back(&mut counts, 0);
        vector::push_back(&mut counts, 0);
        vector::push_back(&mut counts, 0);
        vector::push_back(&mut counts, 0);
        
        // Generate a bunch of weighted random numbers
        let iterations = 100;
        let i = 0;
        
        while (i < iterations) {
            let idx = rng::gen_weighted(&mut rng_state, &weights, clock, &ts::ctx(scenario));
            
            // Ensure index is valid
            assert!(idx < 4, 4);
            
            // Increment count for this index
            let current = *vector::borrow(&counts, idx);
            *vector::borrow_mut(&mut counts, idx) = current + 1;
            
            i = i + 1;
        };
        
        // Print distribution (we don't assert exact values since it's random)
        debug::print(&string::utf8(b"Weighted distribution:"));
        debug::print(&counts);
        
        // Clean up
        test_utils::destroy(rng_state);
    }
    
    // Helper function to test symbol matrix generation
    fun test_gen_matrix(scenario: &mut Scenario, clock: &Clock) {
        ts::next_tx(scenario, ADMIN);
        
        // Create new PRNG state
        let rng_state = rng::new(&mut ts::ctx(scenario));
        
        // Create symbol weights
        let weights = vector::empty<u64>();
        vector::push_back(&mut weights, 20); // Symbol 0
        vector::push_back(&mut weights, 20); // Symbol 1
        vector::push_back(&mut weights, 20); // Symbol 2
        vector::push_back(&mut weights, 15); // Symbol 3
        vector::push_back(&mut weights, 10); // Symbol 4
        vector::push_back(&mut weights, 10); // Symbol 5
        vector::push_back(&mut weights, 5);  // Symbol 6
        
        debug::print(&string::utf8(b"Testing symbol matrix generation"));
        
        // Generate a 3x3 symbol matrix
        let matrix = rng::gen_symbol_matrix(&mut rng_state, 3, 3, &weights, clock, &ts::ctx(scenario));
        
        // Check matrix dimensions
        assert!(vector::length(&matrix) == 3, 5); // 3 rows
        
        let row = 0;
        while (row < 3) {
            let row_vec = vector::borrow(&matrix, row);
            assert!(vector::length(row_vec) == 3, 6); // 3 columns
            
            // Check each symbol is valid
            let col = 0;
            while (col < 3) {
                let symbol = *vector::borrow(row_vec, col);
                
                // Should be a valid symbol ID (less than weights.length)
                assert!((symbol as u64) < vector::length(&weights), 7);
                
                col = col + 1;
            };
            
            row = row + 1;
        };
        
        // Print the matrix
        debug::print(&string::utf8(b"Generated symbol matrix:"));
        debug::print(&matrix);
        
        // Clean up
        test_utils::destroy(rng_state);
    }
    
    // Helper function to test client entropy integration
    fun test_client_entropy(scenario: &mut Scenario, clock: &Clock) {
        ts::next_tx(scenario, ADMIN);
        
        // Create new PRNG state
        let rng_state = rng::new(&mut ts::ctx(scenario));
        
        debug::print(&string::utf8(b"Testing client entropy integration"));
        
        // Generate a sequence without client entropy
        let nums_before = vector::empty<u64>();
        let i = 0;
        while (i < 5) {
            let num = rng::gen_range(&mut rng_state, 100, clock, &ts::ctx(scenario));
            vector::push_back(&mut nums_before, num);
            i = i + 1;
        };
        
        // Add client entropy
        let client_seed = b"client_provided_entropy_test";
        rng::update_seed_with_client_entropy(&mut rng_state, client_seed);
        
        // Generate a sequence after adding entropy
        let nums_after = vector::empty<u64>();
        i = 0;
        while (i < 5) {
            let num = rng::gen_range(&mut rng_state, 100, clock, &ts::ctx(scenario));
            vector::push_back(&mut nums_after, num);
            i = i + 1;
        };
        
        debug::print(&string::utf8(b"Numbers before client entropy:"));
        debug::print(&nums_before);
        
        debug::print(&string::utf8(b"Numbers after client entropy:"));
        debug::print(&nums_after);
        
        // We don't assert equality/inequality because both are random
        // but this helps manually verify the entropy is being used
        
        // Clean up
        test_utils::destroy(rng_state);
    }
}