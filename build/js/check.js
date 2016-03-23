function sumOfMultiplicationOfArrays(a,b){
  var sum = 0;
  for (var i=a.length;i--;){
    sum += a[i] * b[i];
  }
  return sum;
}
function sumOfArray(a){
  var sum = 0;
  for (var i=a.length;i--;){
    sum += a[i];
  }
  return sum;
}
function getMessage(a,b){
  switch (typeof(a)){
    case 'boolean':
      if (a){
        return 'Я попал в ' + b;
      } else {
        return 'Я никуда не попал';
      }
    case 'number':
      return 'Я прыгнул на ' + (a * 100) + ' сантиметров';
    case 'object':
      if (typeof(b) == 'object'){
        return 'Я прошёл ' + sumOfMultiplicationOfArrays(a,b) + ' метров';
      } else {
        return 'Я прошёл ' + sumOfArray(a) + ' шагов';
      }
  }
}