import { defineStore } from 'pinia'

export const useControlsStore = defineStore('controls', {
    state: () => {
        return {
            running: false,
            phrase: 'To be or not to be.',
            population: 200,
            mutationRate: 1
        }
    },
})