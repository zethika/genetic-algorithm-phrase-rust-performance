# RUST Webassembly speed comparison
Attempt to work a bit with Rust, while comparing its' execution speed to that of regular JS.

Implemented the genetic algorithm from https://github.com/zethika/genetic-algorithm-phrase in rust, to compare the number of generations calculated pr. second.

Sadly, the Rust implementation maxed out at around 640 generations calculated pr. second, while my plain JS could handle around 1400.
Since I am not particularly familiar with Rust, I can't at the moment judge whether this is an issue with the implementation - Though I would assume that it is.
The alternative is that it's a limitation from WebAssembly, but I doubt that.

Maybe if I tried implementing multi-threading, it could speed it up.  
Though, is that possible in WebAssembly in the first place?  
Or, alternatively, it is simply a matter of how I handle the memory / referencing logic in Rust, which I am not familiar with.  
