# Vape Rewrite

A new UserScript for Vape! This time, I'm not slacking (neither am i :D).
I hope that, **until I finish this**, I will not be maintaining Vape OR Impact **anymore** (other than VERY MINOR changes).

## Roadmap

- [ ] ClickGUI (yes, this is really important, because it's one of the main reasons I want to use Impact over vape)
- [ ] Basic modules (i.e. Velocity, KillAura, KeepSprint, Sprint, etc.)

## Why a new base?

Simply put:

- Vape code is cluttered.
  All in one file,
  and 90% of the code you're editing is inside a string which has no syntax highlighting,
  and not even basic syntax error checking.
- I want this to be good enough, that there's no reason to maintain Impact.
  - Impact ONLY UPDATED after I fixed Vape myself
    (to make a Criticals bypass for Sigma Rebase in KitPvP, *which I never did*)
    and then he557 made a USELESS fork of Vape that removed a few features and never added new features.
  - Impact is effectively held up with hopes and dreams, powered by ChatGPT / Copilot code.
    - TheM1ddleM1n and ProgMEM-CC couldn't even finish the desync exploit implementation I 99% completed for them
      ON THEIR OWN, and ProgMEM-CC later complained about TheM1ddleM1n waiting
- [Spherical](https://codeberg.org/Miniblox/Spherical) is supposed to be the new base for Vape
  whenever it finishes (never), but motivation makes it hard to overcome really big road blockers:
  - I also got sidetracked(ish) with trying to make Spherical in Kotlin/JS.
  - While the RegExp based replacing in Vape is horrible and annoying for both users (no "paste code into developer console to inject"), and even developers
    (if kept to the bare minimum), it is effectively a necessary evil:
    - How are you going to do packet modifications if you only have access to the builtin globals?
    - *many* classes, methods, variables, etc. are not exposed from the one game object that we have access to.
      This means you would have to find viable replacements

## A note on developer console injection

Once I get to a point where I am ready to experiment with new things,
I will most likely try to use wang's hooking method to make a new "hooking backend" that partially supports developer console injection.
Another one, we might not even need to replace our hooking method for supporting developer console injection, we could:

- Remove the entirety of the page and replace it with an iframe to Miniblox, which then we change up the scripts. (likely buggy, will 99%. likely work)

And more, if I think.

## Development

``` shell
# Compile and watch
$ npm run dev

# Build script
$ npm run build

# Lint
$ npm run lint
```
