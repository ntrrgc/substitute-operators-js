/**
 * Created by ntrrgc on 17/01/16.
 */

var operatorsCalledWithArrays = [];

function LT(opId, a, b) {
  if (!Array.isArray(a)) {
    return a < b;
  } else {
    // 2d compare
    operatorsCalledWithArrays.push(opId);
    if (a[0] !== b[0]) {
      return a[0] < b[0];
    } else {
      return a[1] < b[1];
    }
  }
}

function GT(opId, a, b) {
  if (!Array.isArray(a)) {
    return a < b;
  } else {
    // 2d compare
    operatorsCalledWithArrays.push(opId);
    if (a[0] !== b[0]) {
      return a[0] > b[0];
    } else {
      return a[1] > b[1];
    }
  }
}

function LTE(opId, a, b) {
  if (!Array.isArray(a)) {
    return a <= b;
  } else {
    // 2d compare
    operatorsCalledWithArrays.push(opId);
    if (a[0] !== b[0]) {
      return a[0] <= b[0];
    } else {
      return a[1] <= b[1];
    }
  }
}

function GTE(opId, a, b) {
  if (!Array.isArray(a)) {
    return a >= b;
  } else {
    // 2d compare
    operatorsCalledWithArrays.push(opId);
    if (a[0] !== b[0]) {
      return a[0] >= b[0];
    } else {
      return a[1] >= b[1];
    }
  }
}


