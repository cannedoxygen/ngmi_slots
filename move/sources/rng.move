// move/sources/rng.move
module ngmi_slots::rng {
    use std::hash;
    use std::vector;
    use sui::object::{Self, UID};
    use sui::tx_context::{Self, TxContext};
    use sui::clock::{Self, Clock};
    
    /// PRNG state for the slot machine
    /// This implements a provably fair RNG system
    struct PRNGState has key, store {
        id: UID,
        /// Current seed used for randomness
        seed: vector<u8>,
        /// Counter incremented for each request to avoid repetition
        counter: u64,
    }
    
    /// Create a new PRNG state
    public fun new(ctx: &mut TxContext): PRNGState {
        let seed = seed_from_tx_context(ctx);
        
        PRNGState {
            id: object::new(ctx),
            seed,
            counter: 0,
        }
    }
    
    /// Generate a random number between 0 and range - 1 (inclusive)
    /// Updates the PRNG state in the process
    public fun gen_range(state: &mut PRNGState, range: u64, clock: &Clock, ctx: &TxContext): u64 {
        let random_bytes = gen_random_bytes(state, 8, clock, ctx);
        let random_u64 = bytes_to_u64(&random_bytes);
        random_u64 % range
    }
    
    /// Generate multiple random numbers, each between 0 and range - 1 (inclusive)
    public fun gen_range_vec(
        state: &mut PRNGState, 
        range: u64, 
        count: u64, 
        clock: &Clock, 
        ctx: &TxContext
    ): vector<u64> {
        let result = vector::empty<u64>();
        let i = 0;
        
        while (i < count) {
            let random_num = gen_range(state, range, clock, ctx);
            vector::push_back(&mut result, random_num);
            i = i + 1;
        };
        
        result
    }
    
    /// Generate a weighted random number
    /// Weights should sum to range, and this returns index < weights.length
    public fun gen_weighted(
        state: &mut PRNGState, 
        weights: &vector<u64>, 
        clock: &Clock, 
        ctx: &TxContext
    ): u64 {
        let total_weight = 0;
        let i = 0;
        let len = vector::length(weights);
        
        // Calculate total weight
        while (i < len) {
            total_weight = total_weight + *vector::borrow(weights, i);
            i = i + 1;
        };
        
        // Generate random value within total weight
        let random_value = gen_range(state, total_weight, clock, ctx);
        
        // Find the bucket this falls into
        let cumulative_weight = 0;
        i = 0;
        
        while (i < len) {
            cumulative_weight = cumulative_weight + *vector::borrow(weights, i);
            if (random_value < cumulative_weight) {
                return i
            };
            i = i + 1;
        };
        
        // Should never reach here, but return last index as fallback
        len - 1
    }
    
    /// Generate random symbols for the slot machine
    /// Uses weighted randomness based on the provided weights
    public fun gen_symbol_matrix(
        state: &mut PRNGState,
        rows: u64,
        cols: u64,
        symbol_weights: &vector<u64>,
        clock: &Clock,
        ctx: &TxContext
    ): vector<vector<u8>> {
        let matrix = vector::empty<vector<u8>>();
        let i = 0;
        
        while (i < rows) {
            let row_vec = vector::empty<u8>();
            let j = 0;
            
            while (j < cols) {
                // Generate weighted random symbol
                let symbol_idx = gen_weighted(state, symbol_weights, clock, ctx);
                
                // Convert to u8 and add to row
                vector::push_back(&mut row_vec, (symbol_idx as u8));
                j = j + 1;
            };
            
            vector::push_back(&mut matrix, row_vec);
            i = i + 1;
        };
        
        matrix
    }
    
    /// Generate a vector of random bytes
    fun gen_random_bytes(
        state: &mut PRNGState, 
        num_bytes: u64, 
        clock: &Clock, 
        ctx: &TxContext
    ): vector<u8> {
        // Update the state for this request
        update_state(state, clock, ctx);
        
        // Hash the current state to get random bytes
        let bytes = hash::sha3_256(state.seed);
        
        // Truncate if needed
        if (vector::length(&bytes) > num_bytes) {
            let result = vector::empty<u8>();
            let i = 0;
            
            while (i < num_bytes) {
                vector::push_back(&mut result, *vector::borrow(&bytes, i));
                i = i + 1;
            };
            
            return result
        };
        
        bytes
    }
    
    /// Update the PRNG state with new entropy
    fun update_state(state: &mut PRNGState, clock: &Clock, ctx: &TxContext) {
        // Increment counter
        state.counter = state.counter + 1;
        
        // Get current timestamp
        let timestamp = clock::timestamp_ms(clock);
        
        // Get entropy from transaction context
        let sender_bytes = tx_context::sender(ctx);
        let tx_hash = tx_context::digest(ctx);
        
        // Combine all entropy sources
        let entropy = vector::empty<u8>();
        vector::append(&mut entropy, state.seed);
        vector::append(&mut entropy, bcs::to_bytes(&state.counter));
        vector::append(&mut entropy, bcs::to_bytes(&timestamp));
        vector::append(&mut entropy, sender_bytes);
        vector::append(&mut entropy, tx_hash);
        
        // Update seed with the hash of combined entropy
        state.seed = hash::sha3_256(entropy);
    }
    
    /// Create a seed from transaction context
    fun seed_from_tx_context(ctx: &TxContext): vector<u8> {
        let sender = tx_context::sender(ctx);
        let tx_hash = tx_context::digest(ctx);
        
        let seed = vector::empty<u8>();
        vector::append(&mut seed, sender);
        vector::append(&mut seed, tx_hash);
        
        hash::sha3_256(seed)
    }
    
    /// Convert bytes to u64
    fun bytes_to_u64(bytes: &vector<u8>): u64 {
        let result: u64 = 0;
        let i = 0;
        let len = vector::length(bytes);
        let max_bytes = if (len > 8) { 8 } else { len };
        
        while (i < max_bytes) {
            let byte = *vector::borrow(bytes, i);
            result = result | ((byte as u64) << ((i * 8) as u8));
            i = i + 1;
        };
        
        result
    }
    
    /// Update the seed directly with client-provided entropy
    /// Used for provably fair gaming - client provides a seed
    public fun update_seed_with_client_entropy(state: &mut PRNGState, client_entropy: vector<u8>) {
        let combined = vector::empty<u8>();
        vector::append(&mut combined, state.seed);
        vector::append(&mut combined, client_entropy);
        state.seed = hash::sha3_256(combined);
    }
}