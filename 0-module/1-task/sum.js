function sum(a, b) {
  if (isNumeric(a) && isNumeric(b)) {
    return a + b;
  }
  throw new TypeError();
}

function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

module.exports = sum;
