'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  movementsDates: [
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T21:31:17.178Z',
    '2021-11-18T21:31:17.178Z',
    '2021-12-18T21:31:17.178Z',
    '2021-12-08T21:31:17.178Z',
    '2022-01-18T21:31:17.178Z',
    '2023-10-10T21:31:17.178Z',
    '2023-10-16T12:31:17.178Z',
  ],
  pin: 1111,
  currency: 'EUR',
  locale: 'pt-PT',
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T21:31:17.178Z',
    '2021-11-18T21:31:17.178Z',
    '2021-12-18T21:31:17.178Z',
    '2021-12-08T21:31:17.178Z',
    '2022-01-18T21:31:17.178Z',
    '2022-04-18T21:31:17.178Z',
    '2023-11-18T21:31:17.178Z',
  ],
  pin: 2222,
  currency: 'USD',
  locale: 'en-US',
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T21:31:17.178Z',
    '2021-11-18T21:31:17.178Z',
    '2021-12-18T21:31:17.178Z',
    '2021-12-08T21:31:17.178Z',
    '2022-01-18T21:31:17.178Z',
    '2022-04-18T21:31:17.178Z',
    '2023-11-18T21:31:17.178Z',
  ],
  pin: 3333,
  currency: 'UZS',
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T21:31:17.178Z',
    '2021-11-18T21:31:17.178Z',
    '2021-12-18T21:31:17.178Z',
    '2021-12-08T21:31:17.178Z',
    '2022-01-18T21:31:17.178Z',
    '2022-04-18T21:31:17.178Z',
    '2023-11-18T21:31:17.178Z',
  ],
  pin: 4444,
  currency: 'KZT',
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const formatMovementDate = (date, locale) => {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

  const daysPassed = calcDaysPassed(new Date(), date);

  if (daysPassed == 0) return 'Today';
  if (daysPassed == 1) return 'Yesterday';
  if (daysPassed <= 7) return `${daysPassed} days ago`;
  else {
    // const day = `${date.getDate()}`.padStart(2, 0);
    // const month = `${date.getMonth()}`.padStart(2, 0);
    // const year = date.getFullYear();
    // return `${day}/${month}/${year}`;
    return new Intl.DateTimeFormat(locale).format(date);
  }
};

const formatCur = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};

const displayMovements = function (acc) {
  containerMovements.innerHTML = '';

  // const movs = sort ? acc.movements.slice((a, b) => a - b) : acc.movements;

  acc.movements.forEach(function (move, i) {
    const type = move > 0 ? 'deposit' : 'withdrawal';

    const date = new Date(acc.movementsDates[i]);
    const displayDate = formatMovementDate(date, acc.locale);

    const formattedMov = formatCur(move, acc.locale, acc.currency);

    const html = `
    <div class="movements__row">
          <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
    <div class="movements__date">${displayDate}</div>

          <div class="movements__value">${formattedMov}</div>
        </div>`;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = formatCur(incomes, acc.locale, acc.currency);

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = formatCur(out, acc.locale, acc.currency);

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * 1.2) / 100)
    .filter((int, i, arr) => {
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = formatCur(interest, acc.locale, acc.currency);
};

// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// const euroToUsd = 1.1;

// const movementsUSD = movements.map(mov => mov * euroToUsd);
// console.log(movementsUSD);

/////////////////////////////////////////////////

//coding challenge-1
// const dogsJulia = [3, 5, 2, 12, 7];
// const dogJulia = dogsJulia.slice(1, -2);
// console.log(dogJulia);
// const dogsKate = [4, 1, 15, 8, 3];
// const checkFun = function (arr) {
//   let item = 1;
//   for (const value of arr) {
//     console.log(
//       value >= 3
//         ? `Dog number ${item} is adult and he is ${value} years old`
//         : `Dog number ${item} is still a puppy`
//     );

//     item++;
//   }
// };
// checkFun(dogJulia);
// checkFun(dogsKaate);

// const calcAverageHumanAge = arr => {
//   const ans = arr.reduce((acc, item) => acc + item, 0);
//   return ans / arr.length;
// };
// console.log(calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]));

const calcPrintBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);

  labelBalance.textContent = formatCur(acc.balance, acc.locale, acc.currency);
};

const updateUI = function (acc) {
  //Display movements
  displayMovements(acc);

  //display balance
  calcPrintBalance(acc);
  //display summary

  calcDisplaySummary(acc);
};

const startLogOutTimer = function () {
  //Set time to 5 minutes
  let time = 10;

  const tick = () => {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(Math.trunc(time % 60)).padStart(2, 0);

    // In each call, print the remaining time to UI
    labelTimer.textContent = `${min}:${sec}`;
    // Decrease 1 second
    time--;

    //When 0 seconds, stop timer and log out user
    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = `Login to get started`;
      containerApp.style.opacity = 0;
    }
  };

  //call the timer every second
  const timer = setInterval(tick, 1000);
};

//implementing login bankist

accounts.forEach(acc => {
  acc.username = acc.owner
    .toLowerCase()
    .split(' ')
    .map(item => item[0])
    .join('');
});
// console.log(account4.username);

let currentAccount;
btnLogin.addEventListener('click', function (e) {
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    //clear input
    inputLoginPin.value = '';
    inputLoginUsername.value = '';
    inputLoginPin.blur();

    startLogOutTimer();
    //Display UI and message
    updateUI(currentAccount);

    labelWelcome.textContent = `Welcome, ${currentAccount.owner}`;
    containerApp.style.opacity = 100;

    //Experimenting API

    const now = new Date();
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      weekday: 'long',
    };

    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(now);
  }
});

//transfer

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    //doing the transfer
    receiverAcc.movements.push(amount);
    currentAccount.movements.push(-amount);

    currentAccount.movementsDates.push(new Date());
    receiverAcc.movementsDates.push(new Date());
    //Display UI and message
    updateUI(currentAccount);
  }
  console.log('Transferred');
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Math.floor(inputLoanAmount.value);
  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    // add the movement
    currentAccount.movements.push(amount);
    currentAccount.movementsDates.push(new Date().toISOString);
    updateUI(currentAccount);
  }
  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    accounts.splice(index, 1);
    containerApp.style.opacity = 0;
    inputClosePin.value = inputCloseUsername.value = '';
  }
});

// const anyDeposits = movements.some(mov => mov < 0);
// console.log(anyDeposits);

// console.log(account4.movements.every(mov => mov > 0));

//conversion

// console.log(Number('23'));
// console.log(+'23');

// //parsing
// console.log(Number.parseInt('30px999'));
// console.log(Number.parseFloat('2.5rem'));

// //checking if value is number
// console.log(Number.isFinite(20));
// console.log(Number.isFinite('20'));
// console.log(Number.isFinite(+'20x'));
// console.log(Number.isFinite(23 / 0));

// console.log(Number.isInteger(4.6));

// //date
// const future = new Date(2037, 10, 20, 22, 2, 31);
// console.log(future.getFullYear());
// console.log(future.getMonth());
// console.log(future.getDate());
// console.log(future.getDay());
// console.log(future.getHours());
// console.log(future.getMinutes());
// console.log(future.getSeconds());
// console.log(future.toISOString());

// const z = Array.from({ length: 7 }, (_, i) => i + 1);
// console.log(z);

// const future = new Date(2030, 10, 19, 15, 23);
// console.log(+future);

// const calcDaysPassed = (date1, date2) =>
//   Math.abs(date2 - date1) / (1000 * 60 * 60 * 24);

// const days1 = calcDaysPassed(new Date(2037, 3, 14), new Date(2037, 3, 4));
// console.log(days1);

const num = 388887978.23;

const options = {
  style: 'currency',
  unit: 'celsius',
  currency: 'EUR',
};
console.log('US:', new Intl.NumberFormat('en-US', options).format(num));
console.log('Germany:', new Intl.NumberFormat('de-DE', options).format(num));
console.log('Syria:', new Intl.NumberFormat('ar-SY', options).format(num));
console.log(
  navigator.language,
  new Intl.NumberFormat(navigator.language, options).format(num)
);
