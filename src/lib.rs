mod utils;

use wasm_bindgen::prelude::*;
use crate::population::Population;

mod dna;
mod population;
mod random;


// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[wasm_bindgen]
pub fn calculate_generations() -> Population {
    let charset = random::generate_char_vec();
    let target: Vec<char> = TARGET.chars().collect();
    let target_len = target.len();
    let mut population = Population::build_new(POPULATION_SIZE, MUTATION_RATE, target,&charset);

    loop
    {
        population.evaluate_generation();
        if population.highest_fitness as usize == target_len {
            break;
        }

        population.move_to_next_generation(&charset);
    }
    return population;
}


