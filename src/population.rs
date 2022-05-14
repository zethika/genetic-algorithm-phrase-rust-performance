use rand::Rng;
use crate::dna::{Dna, reproduce};
use crate::random;

pub struct Population {
    population_size: u16,
    mutation_rate: u8,
    target: Vec<char>,
    pub highest_fitness: u8,
    pub highest_fitness_string: String,
    pub population: Vec<Dna>,
    pub generation: u32,
    pub total_fitness: u32,
    pool: Vec<u16>,
}

impl Population {
    pub fn build_new(population_size: u16, mutation_rate: u8, target: Vec<char>, charset: &Vec<char>) -> Population {
        let initial_population = (0..population_size).map(|_x|Dna::build_new(random::generate_random_string(target.len() as u32,&charset))).collect();
        Population {
            population_size,
            mutation_rate,
            target,
            highest_fitness: 0,
            highest_fitness_string: "".to_string(),
            population: initial_population,
            generation: 0,
            total_fitness: 0,
            pool: vec![]
        }
    }

    pub fn evaluate_generation(&mut self) {
        self.total_fitness = 0;
        self.highest_fitness = 0;
        self.highest_fitness_string = "".to_string();
        for dna in &mut self.population {
            dna.calculate_fitness(&self.target);
            self.total_fitness += dna.fitness as u32;

            if dna.fitness > self.highest_fitness {
                self.highest_fitness = dna.fitness;
                self.highest_fitness_string = dna.to_string();
            }
        }

        let mut pool = vec![];
        for (i,dna) in self.population.iter().enumerate() {
            if dna.fitness != 0 {
                let mut vec: Vec<u16> = vec![i as u16; map_value_to_range(dna.fitness as i32, 0, self.highest_fitness as i32, 0, 100) as usize];
                pool.append(&mut vec)
            }
        }
        self.pool = pool;
    }

    pub fn move_to_next_generation(&mut self, charset: &Vec<char>) {
        let mut new_population: Vec<Dna> = vec![];
        for _i in 0..self.population_size {
            let random1 = rand::thread_rng().gen_range(0..self.pool.len());
            let random2 = rand::thread_rng().gen_range(0..self.pool.len());
            let mut child = reproduce(&self.population[self.pool[random1] as usize],&self.population[self.pool[random2] as usize]);
            child.mutate(self.mutation_rate,charset);
            new_population.push(child)
        }
        self.population = new_population;
        self.generation += 1;
    }
}

fn map_value_to_range(value: i32, x1: i32, y1: i32, x2: i32, y2: i32) -> i32 {
    return (value - x1) * (y2 - x2) / (y1 - x1) + x2;
}


