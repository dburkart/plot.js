# plot.js

plot.js is a small language for plotting and displaying math-type stuff in node.js

## Example Usage

Plotting is easy! Just do:

``` js
var Plot = require("plot.js");

var p = new Plot();
var graph = p.render(input);
```

Where `input` is a set of mathematical statements in the plot.js language. For instance, to plot a quadratic function, `input` can be:

```
f(x) = x ^ 2
plot_x(f, -5, 5)
```

Full documentation for the graphing language has not been finished yet, however that document has begun to take shape here: [Plot-language](https://github.com/dburkart/plot.js/wiki/Plot-language)

For a fuller example which you can play around with, check out [graph-it](https://github.com/dburkart/graph-it).
