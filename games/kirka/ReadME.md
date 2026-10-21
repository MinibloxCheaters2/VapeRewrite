# Vape Rewrite for Kirka.io

I'm trying to add support for this game.
Let's note some limitations:

## Almost nothing is implemented

TL;DR: basically nothing is implemented,
support is effectively "we're working on it and will add an Aimbot SoON"

We get a vite store and some variable names, that's effectively it.
Now, why? Because,
this game remaps almost every field name (INCLUDING THREE.JS FIELDS!)...
Which is, as one may know, VERY annoying.
It means I have to guess based on the field values
Now, the way the game remaps the field names is by doing
`string.replaceAll(oldName, newName)`, so variable names can also be found via that.
I've made a WASM module for getting all de-duplicated raw strings from the program,
so I'll probably do some more stuff.
Eventually we'll get an Aimbot, but I'm lazy,
so its most likely that it'll take a while.
