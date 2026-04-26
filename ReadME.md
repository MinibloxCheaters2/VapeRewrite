# VapeRewrite

A new UserScript for Vape! This time, I'm not slacking.
I hope that, **until I finish this**, I will not be maintaining Vape OR Impact **anymore** (other than **VERY MINOR** changes)


## Roadmap for VapeRewrite

- [x] ClickGUI (yes, this is really important, because it's one of the main reasons I want to use Impact over vape)
- [x] Basic modules (i.e. Velocity, KillAura, KeepSprint, Sprint, etc.)
- [x] Desync implementation (for fly)
- [ ] whatever else is on the issue list thing

## Why a new base?

Simply put:
- Vape code is cluttered.
  All inside one .js file,
  and 90% of the code you're editing is inside a string which has no syntax highlighting,
  and not even basic syntax error checking.
- I want this to be good enough, that there's no reason to maintain Impact.
  - Impact ONLY UPDATED after I fixed Vape myself
    (to make a Criticals bypass for Sigma Rebase in KitPvP, *which I never did*)
    and then he557 made a USELESS fork of Vape that removed a few features and never added any new features.
    - ProgMEM-CC couldn't even finish the desync exploit implementation I 99.9% completed for him.
- [Spherical](https://codeberg.org/Miniblox/Spherical) is supposed to be the new base for Vape
  whenever it finishes (never), but motivation makes it hard to overcome really big road blockers:
  - I also got sidetracked(ish) with trying to make Spherical in Kotlin/JS.
  - While the RegExp based replacing in Vape is horrible and annoying for both users (no "paste code into developer console to inject"), and even developers
    (if kept to the bare minimum), it is effectively a necessary evil:
    - How are you going to do packet modifications if you only have access to the builtin globals?
    - *many* classes, methods, variables, etc. are not exposed from the one game object that we have access to. This means you would have to find viable replacements

## A note on developer console injection

Once I get to a point where I am ready to experiment with new code,
I will most likely try to use wang's hooking method to make a new "hooking backend" that will partially support developer console injection.

## Development using Bun

``` shell
# Compile and watch (executes)
$ bun run dev

# Build the script (also minifies the code)
$ bun run build

# Lint (checks for errors)
$ bun run lint
```
