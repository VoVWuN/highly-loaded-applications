let map = new Map();

map.set('a', 1);

// console.log(map.get('a'));

let john = { name: 'John' };
let visitsCountMap = new Map();

visitsCountMap.set(john, 'hello');

// console.log(visitsCountMap);

let recipeMap = new Map([
  ['огурец', 500],
  ['помидор', 350],
  ['лук', 50],
]);

// for (let vagetable of recipeMap.values()) {
//   console.log(vagetable);
// }
// for (let vagetable of recipeMap.keys()) {
//   console.log(vagetable);
// }
//
// for (let vagetable of recipeMap) {
//   console.log(vagetable);
// }

recipeMap.forEach((value, key, map) => {
  // console.log(`${key}: ${value}`);
});

let obj = {
  name: 'John',
  age: 30,
};

let mapObj = new Map(Object.entries(obj));

// console.log(mapObj.get('name'));

console.log(Object.fromEntries(recipeMap));