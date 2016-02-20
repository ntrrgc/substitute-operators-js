/**
 * Created by ntrrgc on 17/01/16.
 */

var util = require('util');
var recast = require("recast");
var fs = require('fs');
var process = require('process');
var argparse = require('argparse');
var glob = require('glob');
var _ = require('lodash');
var b = recast.types.builders;

var parser = new argparse.ArgumentParser({
  version: '1.0',
  addHelp: true,
  description: 'Deinstruments a code replacing comparison functions with operators except for those whose id is' +
  ' passed as an element of the parameter list. Those just get the id removed but stay as function calls.'
});

parser.addArgument(['glob'], {
  help: 'A glob matching the files that will be instrumented. You better have a backup of them since they will be' +
  ' edited in place.'
});

parser.addArgument(['operatorIds'], {
  nargs: '+',
  metavar: 'operator-id',
  help: 'The operator identifiers of the comparison functions that should be kept, one argument each.'
});

var args = parser.parseArgs();

args.operatorIds = _.map(args.operatorIds, function (id) {
  var ret = parseInt(id);
  if (isNaN(ret)) {
    console.error("The operator id '%s' is not a number.", id);
    process.exit(1);
  }
  return ret;
});

var files = glob(args.glob, {
  sync: true,
  sorted: true,
  nodir: true,
});

files.forEach(function (file) {
  console.log('Processing %s', file);
  var code = fs.readFileSync(file);

  // Parse the code using an interface similar to require("esprima").parse.
  var ast = recast.parse(code);

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

        if (args.operatorIds.indexOf(opId) != -1) {
          // Rename the function call to lowercase
          node.callee.name = node.callee.name.toLowerCase();
          // Remove the first argument
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

  fs.writeFileSync(file, recast.print(ast).code);
});
