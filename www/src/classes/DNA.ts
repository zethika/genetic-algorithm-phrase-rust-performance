import getRandomCharacter from "@/helpers/getRandomCharacter";
import getRandomInteger from "@/helpers/getRandomInteger";
import getRandomNumber from "@/helpers/getRandomNumber";

export default class DNA{
    private _genes: Array<string>;
    private _fitness: number;
    constructor(size: number) {
        this._genes = [];
        this._fitness = 0;
        for(let i = 0; i < size; i++){
            this._genes.push(getRandomCharacter())
        }
    }

    get genes(): Array<string> {
        return this._genes;
    }

    set genes(value: Array<string>) {
        this._genes = value;
    }

    get fitness(): number {
        return this._fitness;
    }

    /**
     * Returns the genes as a single string
     */
    phrase(){
        return this.genes.join('');
    }

    /**
     * Determines how many characters match between the DNA genes and a match
     * @param match
     */
    determineFitness(match: string){
        let fit = 0;
        this._genes.forEach((gene, index) => {
            if(match[index] === gene)
                fit++;
        })
        this._fitness = fit;
    }

    /**
     * Creates a child this and another DNA instance's genes.
     * @param partner
     */
    crossOver(partner: DNA){
        let child = new DNA(this._genes.length);
        const midpoint = getRandomInteger(0,this._genes.length);
        for(let i = 0; i < this._genes.length; i++){
            if(i > midpoint){
                child.genes[i] = this.genes[i]
            }else{
                child.genes[i] = partner.genes[i]
            }
        }
        return child;
    }

    /**
     * Randomly mutates every gene in the DNA, according to a given mutation rate
     * @param mutationRate
     */
    mutate(mutationRate: number){
        for(let i = 0; i < this._genes.length; i++){
            if(getRandomNumber(0,100) < mutationRate)
                this._genes[i] = getRandomCharacter()
        }
    }
}