var util = require('util');
var recast = require("recast");
var fs = require('fs');
var process = require('process');
var argparse = require('argparse')
var glob = require('glob')
var b = recast.types.builders;

var parser = new argparse.ArgumentParser({
  version: '1.0',
  addHelp: true,
  description: 'Instruments a code replacing all comparison operators with function calls.'
});

parser.addArgument(['glob'], {
  help: 'A glob matching the files that will be instrumented. You better have a backup of them since they will be' +
  ' edited in place.'
});

var args = parser.parseArgs()

var files = glob(args.glob, {
  sync: true,
  sorted: true,
  nodir: true,
});

var operatorCount = 1;

files.forEach(function (file) {
  console.log('Processing %s', file);
  var code = fs.readFileSync(file);

  // Parse the code using an interface similar to require("esprima").parse.
  var ast = recast.parse(code);

  recast.types.visit(ast, {
    visitBinaryExpression: function (path) {
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
  });

  var newCode = recast.print(ast).code;

  // Replace file in-place
  fs.writeFileSync(file, newCode);
});

console.log('Done');
