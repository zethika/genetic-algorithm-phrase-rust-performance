import DNA from "@/classes/DNA";
import mapValueToRange from "@/helpers/mapValueToRange";
import getRandomInteger from "@/helpers/getRandomInteger";

export default class{
    private readonly populationSize: number;
    private readonly mutationRate: number;
    private readonly target: string;
    private _highestFitness: { number: number, dna: DNA|null };
    private _population: DNA[];
    private _generation: number;

    private pool: Array<number>

    private _hasTarget: boolean;
    private _averageFitness: number;

    constructor(populationSize: number, mutationRate: number, target: string) {
        this.populationSize = populationSize;
        this.mutationRate = mutationRate;
        this.target = target;
        this._highestFitness = {number: 0, dna: null};
        this.pool = []
        this._hasTarget = false;
        this._averageFitness = 0;
        this._generation = 0;

        const dnaSize = target.length;
        this._population = []
        for(let i = 0; i < populationSize; i++){
            this._population.push(new DNA(dnaSize))
        }
    }

    get generation(): number {
        return this._generation;
    }

    get averageFitness(): number {
        return this._averageFitness;
    }

    get population(): DNA[] {
        return this._population;
    }

    get highestFitness(): { number: number; dna: DNA | null } {
        return this._highestFitness;
    }

    get hasTarget(): boolean {
        return this._hasTarget;
    }

    /**
     * Calculates the fitness for each element of the population and determines the highest fitness in the population
     */
    calculatePopulationFitness(){
        this._highestFitness = {number: 0, dna: null};
        this._population.forEach(dna => {
            dna.determineFitness(this.target)
            if(dna.fitness > this._highestFitness.number)
                this._highestFitness = {number: dna.fitness, dna: dna}
        })
    }

    /**
     * Generates the mating pool by looping over each DNA element and filling an array with an index reference to the DNA element.
     * The number of times the dna's index is generated is the same as its fitness.
     * The fitness is mapped between 0 and 100 to limit the array size.
     */
    generateMatingPool(){
        this.pool = [];
        this._population.forEach((dna, index) => {
            const percentage = Math.floor(mapValueToRange(dna.fitness,0,this.highestFitness.number,0,100))
            this.pool = this.pool.concat(new Array(percentage).fill(index))
        })
    }

    /**
     *
     */
    generateNextGeneration(){
        const matingPoolSize = this.pool.length-1
        let newPopulation = [];
        for(let i = 0; i < this._population.length; i++){
            const partnerA = this._population[this.pool[getRandomInteger(0,matingPoolSize)]];
            const partnerB = this._population[this.pool[getRandomInteger(0,matingPoolSize)]];
            let child = partnerA.crossOver(partnerB);
            child.mutate(this.mutationRate);
            newPopulation[i] = child;
        }
        this._population = newPopulation;
        this._generation++;
    }

    calculateAverage(){
        let total = 0;
        this._population.forEach(dna => {
            total += dna.fitness
        })
        this._averageFitness = mapValueToRange(total,0,this.target.length*this.populationSize, 0,100*this.populationSize)/this.populationSize;
    }

    /**
     * Evaluates the current generation of the population
     */
    evaluate(){
        this._hasTarget = this._highestFitness.dna?.phrase() === this.target
    }
}