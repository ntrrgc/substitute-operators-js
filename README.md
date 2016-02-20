substitute-operators
====================

This is a pair of JavaScript scripts to find the comparison operators `<`, `>`, `<=`, `>=` all over a JavaScript project, substitute them with instrumented function calls and remove them later when they are not needed anymore.

This was written as a refactor aid for adding support for custom comparison operators in [crossfilter.js](https://github.com/square/crossfilter/). For a bit more of context: native array comparison in JavaScript, even though counterintuitive (`[10, 1] < [2, 1] == true`), is enough to create a partial order, and therefore enough to create indexes in crossfilter. This is even a pattern in [dc.js](https://dc-js.github.io/dc.js/) where 2D array indices are used to power scatter plots.

But those comparisons were dramatically slow: not only they required converting each number to a string (which is a relatively slow process that generates tons of garbage), but also made the JIT optimizer bail out from the hottest functions in the application. Thanks to this scripts I could modify crossfilter dimension code to accept custom operators for 2D arrays that are faster and more intuitive, achieving a noticeable ~16x speedup in the sorting functions and making my data-intensive application responsive again.
