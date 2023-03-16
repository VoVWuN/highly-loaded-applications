function createString(num) {
    let string = '';
    while (string.length < num) string += Math.random().toString(36).substring(2);
    return string.substring(0, num);
  }
  
  const testArray = [];
  let tStart = '';
  let tFinish = '';
  
  function fillArray(i) {
    while (testArray.length < i) testArray.push(createString(3));
  }
  
  fillArray(1000000);
  
  const testSet = new Set(testArray);
  
  // добавление элемента ==============================================
  console.log('// добавление элемента');
  tStart = performance.now();
  testArray.push('hello');
  tFinish = performance.now();
  console.log(`Добавление в массив занимает ${tFinish - tStart} миллисекунд.`);
  
  tStart = performance.now();
  testSet.add('hello');
  tFinish = performance.now();
  console.log(`Добавление в сет занимает ${tFinish - tStart} миллисекунд.`);
  
  // поиск элемента ==============================================
  console.log('// поиск элемента');
  tStart = performance.now();
  testArray.indexOf('hello');
  tFinish = performance.now();
  console.log(`поиск по массиву занимает ${tFinish - tStart} миллисекунд.`);
  
  tStart = performance.now();
  testSet.has('hello');
  tFinish = performance.now();
  console.log(`поиск по сету занимает ${tFinish - tStart} миллисекунд.`);
  
  // удаление элемента ==============================================
  console.log('// Удаление элемента');
  tStart = performance.now();
  const deletedIndex = testArray.indexOf('hello');
  testArray.splice(deletedIndex, 1);
  // testArray.filter(el => el !== 'hello');
  tFinish = performance.now();
  console.log(`удаление в массиве занимает ${tFinish - tStart} миллисекунд.`);
  
  tStart = performance.now();
  testSet.delete('hello');
  tFinish = performance.now();
  console.log(`удаление в сете занимает ${tFinish - tStart} миллисекунд.`);