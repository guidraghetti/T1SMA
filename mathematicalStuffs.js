
//Funções matemáticas para cálculos futuros;

function range(a, b, rnd) {
  return (b - a) * rnd + a;
}

function round(number, places = 4) {
  return +parseFloat(number).toFixed(places);
}

function probability(value, total) {
  const division = value / total;
  const toPercent = division * 100;
  const precision = toPercent >= 10 ? 4 : 3;

  return round(toPercent).toPrecision(precision).concat("%");
}
module.exports = { range, round, probability };
