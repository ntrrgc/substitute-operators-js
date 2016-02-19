/**
 * Created by ntrrgc on 17/01/16.
 */

var operatorsCalledWithArrays = {};
function printOperatorsCalledWithArrays() {
  var operatorIds = [];
  for (var key in operatorsCalledWithArrays) {
    operatorIds.push(parseInt(key));
  }
  console.log(operatorIds.sort(function (a, b) {
    return a - b;
  }).join(' '));
}

function _lt(a,b) {return a < b}
function _lte(a,b) {return a <= b}
function _gt(a,b) {return a > b}
function _gte(a,b) {return a >= b}


function operatorBase(op) {
  return function (opId, a, b) {
    var jsResult = op(a,b)
    var altResult;

    var is2dArray = (Array.isArray(a) && a.length == 2);
    if (!is2dArray) {
       altResult = op(a, b);
    } else {
      // 2d compare
      operatorsCalledWithArrays[opId] = true;
      if (a[0] !== b[0]) {
        altResult = op(a[0], b[0]);
      } else {
        altResult = op(a[1], b[1]);
      }
    }

    if (jsResult !== altResult) {
      //console.log('%d caused different behavior (%s, %s)', opId, jsResult, altResult);
    }
    return altResult;
  }
}

var LT = operatorBase(_lt)
var GT = operatorBase(_gt)
var GTE = operatorBase(_gte)
var LTE = operatorBase(_lte)