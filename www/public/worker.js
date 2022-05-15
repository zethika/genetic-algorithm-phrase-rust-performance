import init from './pkg/genetic_algorithm_phrase_rust.js'
import {calculate_generations,greet,initThreadPool} from './pkg/genetic_algorithm_phrase_rust.js'

self.addEventListener("message", ({ data }) => {
    self.postMessage('received: '+data);
    if(data === 'init'){
        init()
            .then(() => {
                initThreadPool(navigator.hardwareConcurrency).then(() => {
                    self.postMessage('init_done');
                })
        })
    }
    else if(data === 'calculate')
    {
        self.postMessage('starting');
        const start = new Date().getTime();
        const generations = calculate_generations('To be',200, 1)
        const diff = new Date().getTime()-start;
        self.postMessage('Rust took '+(diff)+ ' at '+(generations/(diff/1000))+' generations pr. second')
        self.postMessage(generations);
    }
    self.postMessage('finished');
});
/*
async function initHandler() {
    console.log('yo')
/!*    await init();*!/
/!*    await initThreadPool(navigator.hardwareConcurrency);*!/
}

Comlink.expose({
    init: initHandler,
});*/
