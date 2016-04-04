function sumOfMultiplicationOfArrays(a,b){
  return a.reduce(function(sum, current, index){
    return sum + current * b[index];
  }, 0);
}
function sumOfArray(a){
  return a.reduce(function(sum, current) {
    return sum + current;
  }, 0);
}
function getMessage(a,b){
  switch (typeof a){
    case 'boolean':
      if (a){
        return 'Я попал в ' + b;
      } else {
        return 'Я никуда не попал';
      }
    case 'number':
      return 'Я прыгнул на ' + (a * 100) + ' сантиметров';
    case 'object':
      if (typeof b === 'object'){
        return 'Я прошёл ' + sumOfMultiplicationOfArrays(a,b) + ' метров';
      } else {
        return 'Я прошёл ' + sumOfArray(a) + ' шагов';
      }
  }
}