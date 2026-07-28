# VapeRewrite

Currently the only UserScript cheeto for Miniblox that is being updated frequently.
(ballcrack is really outdated and has little to no features compared to this)

## So, why does VapeRewrite need a new base?

Simply put:
Vape code is very cluttered, it's all inside one .js file (1000+ lines),
 and 90% of the code you're editing is inside a string which has no syntax highlighting,
 and not even basic syntax error checking.
And now, the last 2 problems are gone by removing code replacement-based injection!

## A note on developer console injection

This will be supported soon,
as we have swapped out code replacement-based injection for our own hooking method, and it now runs way after the page loads.

## Development (using [Bun](https://bun.sh))

``` shell
# Compile and watch (executes)
$ bun run dev

# To build script and minify the code
$ bun run build

# Linting to check for any errors
$ bun run lint
```
