/**
 * Created by ntrrgc on 17/01/16.
 */

var needsReplacement = [18, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 32, 33, 34, 35, 37, 38, 39, 41, 44, 45, 46, 47, 49, 50, 51, 52, 53, 54, 56, 93, 96]

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
  visitCallExpression: function (path) {
    var node = path.value;

    var operators = {
      'LT': '<',
      'GT': '>',
      'LTE': '<=',
      'GTE': '>='
    };

    if (node.callee.type == 'Identifier' && node.callee.name in operators) {
      var opId = node.arguments[0].value;

      if (needsReplacement.indexOf(opId) != -1) {
        node.callee.name = node.callee.name.toLowerCase()
        node.arguments.shift();
      } else {
        // Convert in plain operator again;
        path.replace(b.binaryExpression(
          operators[node.callee.name],
          node.arguments[1],
          node.arguments[2]
        ));
      }
    }

    this.traverse(path);
  }
})

console.log(recast.print(ast).code);