var util = require('util');
var recast = require("recast");
var fs = require('fs');
var process = require('process');
var b = recast.types.builders;
 
// Let's turn this function declaration into a variable declaration. 
var code = fs.readFileSync(process.argv[2]);

// Parse the code using an interface similar to require("esprima").parse. 
var ast = recast.parse(code);

var operatorCount = 1;

recast.types.visit(ast, {
    visitBinaryExpression: function(path) {
        var node = path.value;

        var operators = {
            '<': 'LT',
            '<=': 'LTE',
            '>': 'GT',
            '>=': 'GTE'
        };

        if (node.operator in operators) {
            var functionName = operators[node.operator];

            var replacement = b.callExpression(b.identifier(functionName), [
              b.literal(operatorCount++),
              node.left,
              node.right
            ]);
            path.replace(replacement)
        }

        this.traverse(path);
    }
})

console.log(recast.print(ast).code);