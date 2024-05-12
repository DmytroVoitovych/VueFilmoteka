const _ = require('lodash');

const intersectionBy = _.intersectionBy; // метод що повертає масив данних

const products = [
  { id: 1, name: 'Apple', category: 'Fruit' },
  { id: 2, name: 'Banana', category: 'Fruit' },
  { id: 3, name: 'Milk', category: 'Dairy' },
  { id: 4, name: 'Pork', category: 'Meat' },
];

const products2 = [
  { id: 1, name: 'Apple', category: 'Fruit' },
  { id: 2, name: 'Banana', category: 'Fruit' },
  { id: 3, name: 'Milk', category: 'Dairy' },
  { id: 4, name: 'Pork', category: 'Meat' },
  { id: 5, name: 'Lego', category: 'Toy' },
];

const shoppingCart = ['Apple', 'Orange', 'Banana', 'Yogurt'];
const shoppingCartForInstans = ['Apple', 'Orange', 'Banana', 'Yogurt', 'Milk'];
const shoppingCartWithOneGood = ['Banana'];

// приклад з "лодаш" документації

//1.пошук однакових значень в двух массивах данних

console.log('1', intersectionBy(shoppingCart, shoppingCartForInstans)); //1

//2.пошук заданих значень в массивах данних які збігаються

console.log(
  '2',
  intersectionBy(shoppingCart, shoppingCartForInstans, shoppingCartWithOneGood)
); //2

// 3. пошук пересікання по масиву об'єктів з іншим масивом об'єктів продуктів

console.log('3', intersectionBy(products, products2, 'name'));

// 3. пошук пересікання по масиву об'єктів з масива продуктів

console.log(
  '4',
  intersectionBy(
    products,
    products2,
    shoppingCart.map(name => ({ name })),
    'name'
  )
);
