import { defineStore } from 'pinia'

export const useControlsStore = defineStore('controls', {
    state: () => {
        return {
            running: true,
            phrase: 'To be or not to be.',
            population: 200,
            mutationRate: 1
        }
    },
})