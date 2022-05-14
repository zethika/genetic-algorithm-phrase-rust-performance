use rand::Rng;
use random_number::random;

#[derive(Default)]
pub struct Dna {
    genes: Vec<char>,
    pub fitness: u8
}

impl Dna {
    pub fn to_string(&self) -> String {
        self.genes.iter().collect()
    }
    pub fn build_new(genes: Vec<char>) -> Dna{
        Dna {
            fitness: 0,
            genes
        }
    }
    pub fn calculate_fitness(&mut self, target: &Vec<char>) {
        for (i, char) in target.iter().enumerate() {
            if &self.genes[i] == char {
                self.fitness += 1;
            }
        }
    }
    pub fn mutate(&mut self,rate: u8, charset: &Vec<char>) {
        let mut genes: Vec<char> = vec![];
        for char in self.genes.iter() {
            let random = rand::thread_rng().gen_range(0..100);
            if random < rate {
                genes.push(charset[random!(..=(charset.len() - 1) as u8) as usize].to_owned());
            }
            else {
                genes.push(char.to_owned())
            }
        }
        self.genes = genes;
    }
}


pub fn reproduce(parent1: &Dna, parent2: &Dna) -> Dna{
    let midpoint = rand::thread_rng().gen_range(1..(parent1.genes.len()-1));
    let mut genes: Vec<char> = vec![];
    genes.append(&mut parent1.genes[0..midpoint].to_vec());
    genes.append(&mut parent2.genes[midpoint..parent2.genes.len()].to_vec());
    Dna {
        genes,
        fitness: 0
    }
}