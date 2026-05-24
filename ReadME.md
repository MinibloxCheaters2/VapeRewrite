# VapeRewrite

A new Userscript for Vape! This time, I'm not slacking.
While this is in progress, Vape and Impact will receive no updates beyond critical fixes.

## Roadmap

- [x] ClickGUI (yes, this is really important, because it's one of the main reasons I want to use Impact over Vape)
- [x] Basic modules such as (Velocity, KillAura, KeepSprint, Sprint, etc.)
- [x] Desync implementation
- [ ] Remaining issues

## So why does VapeRewrite need a new base?

Simply put:
- Vape code is very cluttered.
  All inside one .js file (5000+ lines),
  and 90% of the code you're editing is inside a string which has no syntax highlighting,
  and not even basic syntax error checking.
- I want this to be good enough, that there would be no reason to maintain Impact.
  - Impact was ONLY UPDATED after I fixed Vape myself
    (to make a Crits bypass for Sigma Rebase in KitPvP, *which I never did*)
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

## Development Requires [Bun](https://bun.sh).

``` shell
# Compile and watch (executes)
$ bun run dev

# To build script and minify the code
$ bun run build

# Linting to check for any errors
$ bun run lint
```
