use wasm_bindgen::prelude::*;
use crate::population::Population;

mod dna;
mod population;
mod random;

#[wasm_bindgen]
pub fn calculate_generations(target_string: String, population_size: u16, mutation_rate: u8) -> u32 {
    let charset = random::generate_char_vec();
    let target: Vec<char> = target_string.chars().collect();
    let target_len = target.len();
    let mut population = Population::build_new(population_size, mutation_rate, target,&charset);

    loop
    {
        population.evaluate_generation();
        if population.highest_fitness as usize == target_len {
            break;
        }

        population.move_to_next_generation(&charset);
    }
    return population.generation;
}