# RUST Webassembly speed comparison
Attempt to work a bit with Rust, while comparing its' execution speed to that of regular JS.

Implemented the genetic algorithm from https://github.com/zethika/genetic-algorithm-phrase in rust, to compare the number of generations calculated pr. second.

***
### No optimizations

Sadly, the Rust implementation maxed out at around 640 generations calculated pr. second, while my plain JS could handle around 1400.
Since I am not particularly familiar with Rust, I can't at the moment judge whether this is an issue with the implementation - Though I would assume that it is.
The alternative is that it's a limitation from WebAssembly, but I doubt that.

Maybe if I tried implementing multi-threading, it could speed it up.  
Though, is that possible in WebAssembly in the first place?  
Or, alternatively, it is simply a matter of how I handle the memory / referencing logic in Rust, which I am not familiar with.  

***
### First round
Removed unused dependencies and set these values in cargo.toml.
```
[profile.release]
opt-level = 3
lto = true

[package.metadata.wasm-pack.profile.release]
wasm-opt = ["-O4", "--enable-mutable-globals"]
```
This alone seems to have sped it up dramatically, so it now hovers around 1500 generations pr. second. meaning it is now slightly faster than my plain JS solution.  
Time to look for more optimizations, I also havn't checked if multithreading is a thing in WebAssembly, or if I can figure out how to use it.

***
### Second round
Made use of the Uniform structure to pre-generate the ranges we pick random numbers from, increasing performance some.  
Also identified one of the heaviest single lines in the system; `let random = range.sample(&mut rng.to_owned());` which generates the random number that decides whether a single character should be mutated in DNA.  
Makes sense, since it will be called `population_size * gene_length` times pr. generation.  
Have yet to find either a working alternative, or a more performant solution to it.

Can now generate around 1750 generations pr. second.

***
### Third round
Attempted to implement multithreading via [rayon](https://crates.io/crates/rayon) on the rust side, and web workers on the frontend.  
Sadly, it seems this is either not implemented correctly (probably by me) on the web side via the [wasm-bindgen-rayon](https://github.com/GoogleChromeLabs/wasm-bindgen-rayon) module, since there is a massive performance drop.  
Alternatively, the problem comes from the overhead involved when the different web workers communicate with each other (which is how rayon implements multithreading in the browser).  
I'm guessing, since in absolute numbers the "jobs" I've sent to the individual workers (calculating next child from 2 parents) are small, the overhead involved makes it not worth it.

With this setup, we can only calculate 0.8-1.2 generations pr. second, so effectively useless. 
Whereas the rust script itself can handle 6-7k generations pr.second.  
Either I'm missing something with how to use the multithreading in the browser (-entirely- possible), or the task is simply too small to make it worth it.
