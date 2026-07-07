# VapeRewrite

A new Userscript for Vape! This time, I'm not slacking.
While this is in progress, Vape and Impact will receive no updates beyond critical fixes.
We're mostly around the same feature set as Vape, but with more features.

## So, why does VapeRewrite need a new base?

Simply put:
- Vape code is very cluttered.
  All inside one .js file (5000+ lines),
  and 90% of the code you're editing is inside a string which has no syntax highlighting,
  and not even basic syntax error checking.
- I want this to be good enough, that there would be no reason to maintain Impact.
  - Impact was ONLY UPDATED after I fixed Vape myself
    (to make a Crits bypass for Sigma Rebase in KitPvP, *which I never did*)
    and then he557 made a USELESS fork that removed a few features. But never added new features to Vape.
    - ProgMEM-CC couldn't even finish the desync exploit implementation I 99.99% completed for him.
- [Spherical](https://codeberg.org/Miniblox/Spherical) is supposed to be the new base for Vape
  whenever it finishes (never), but motivation makes it hard to overcome really big road blockers:
  - I also got sidetracked(ish) with trying to make Spherical in Kotlin/JS.

## A note on developer console injection

This will be supported soon, as code replacement-based injection doesn't work anymore unless you switch to extensions and replace the bundle response.

## Development (using [Bun](https://bun.sh))

``` shell
# Compile and watch (executes)
$ bun run dev

# To build script and minify the code
$ bun run build

# Linting to check for any errors
$ bun run lint
```
