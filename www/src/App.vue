<script setup lang="ts">
import Controls from "@/components/Controls.vue";
import {useControlsStore} from "@/store/controls";
import {onMounted, reactive, watch} from "vue";
import Population from "@/classes/Population";
import * as Comlink from 'comlink';
const store = useControlsStore();
const allowedSpeed = 1000/30;
let population = new Population(
    store.population,
    store.mutationRate,
    store.phrase
);
import init from 'genetic-algorithm-phrase-rust'
import {calculate_generations,initThreadPool} from 'genetic-algorithm-phrase-rust'

onMounted(async () => {
/*
    console.log(self.crossOriginIsolated)
    await init();
    await initThreadPool(navigator.hardwareConcurrency);

    const counter = await calculate_generations('To be or not to be.',200, 1);
*/

    /*const worker = new Worker("worker.js", { type: "module" });
    worker.addEventListener("message", ({ data }) => {
        console.log(data)
    });
    worker.postMessage('yoa');*/
    const worker = new Worker("worker.js", { type: "module" });
    worker.addEventListener("message", ({ data }) => {
        if(data === 'init_done')
        {
            console.log('ready')
            worker.postMessage('calculate');
        }
        else
        {
            console.log(data)
        }
    });

    worker.postMessage('init');


   /* await obj.init()
    console.log('hey')
    console.log(obj.calculate_generations())
    const start = new Date().getTime();
    const counter = await obj.calculate_generations('To be or not to be.',200, 1);
    const diff = new Date().getTime()-start;
    console.log('Rust took '+(diff)+ ' at '+(counter/(diff/1000))+' generations pr. second')
    state.startTime = new Date().getTime();
    runIteration();*/
})

const state = reactive({
    bestPhrase: '',
    phrases: [] as Array<string>,
    generations: 0,
    averageFitness: 0,
    bestFitness: 0,
    totalTime: 0,
    startTime: 0,
})

function runIteration(){
    const iterationStart = new Date().getTime();

    population.calculatePopulationFitness()
    population.generateMatingPool()
    population.calculateAverage();
    population.generateNextGeneration()

    population.evaluate();

    if(population.hasTarget)
    {
        store.running = false;
        const diff = new Date().getTime()-state.startTime;
        console.log('JS took '+(diff)+ ' at '+(state.generations/(diff/1000))+' generations pr. second')
    }

    state.averageFitness = population.averageFitness;
    state.phrases = population.population.map(dna => dna.phrase());
    state.bestPhrase = population.highestFitness.dna === null ? '' : population.highestFitness.dna?.phrase()
    state.bestFitness = population.highestFitness.number
    state.generations = population.generation;
    const diff = new Date().getTime() - iterationStart
    state.totalTime += diff;
    if(store.running)
    {
         runIteration()
    }
}

watch(() => store.running, () => {
    if(store.running)
        runIteration()
})

watch([() => store.population, () => store.phrase, () => store.mutationRate], () => {
    reset();
})

function reset(){
    store.running = false;
    state.bestPhrase = ''
    state.phrases = [] as Array<string>
    state.generations = 0
    state.averageFitness = 0
    state.bestFitness = 0

    population = new Population(
        store.population,
        store.mutationRate,
        store.phrase
    );
}

</script>

<template>
    <div class="flex w-screen h-screen">
        <div class="flex-grow p-4">
            <h1 class="text-2xl mb-4">Population</h1>
            <p class="text-xl whitespace-nowrap">Best fit: {{state.bestPhrase}}</p>
            <p>Generation: {{state.generations}}</p>
            <p>Average fitness: {{state.averageFitness.toFixed(2)}}%</p>
            <p>Best fitness: {{state.bestFitness}}</p>
            <p>Generations pr. second: {{state.generations / (state.totalTime/1000)}}</p>
            <p class="mt-4">Phrases:</p>
            <p v-for="phrase in state.phrases.slice(0,50)" class="whitespace-nowrap">{{phrase}}</p>
        </div>
        <div class="p-4 bg-blue-500 text-white">
            <Controls />
        </div>
    </div>
</template>