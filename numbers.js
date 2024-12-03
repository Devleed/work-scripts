const BigNumber = require('bignumber.js');

const MULTIPLIER_1 = new BigNumber(1537624394567);
const DIVIDER_1 = new BigNumber(6234);

const MULTIPLIER_2 = new BigNumber(98887431493);
const DIVIDER_2 = new BigNumber(14.6789);

const x1 = new BigNumber(3475288993398);
const x2 = new BigNumber(8683499535113);

let y1 = x1.times(MULTIPLIER_1).dividedBy(DIVIDER_1);
let y2 = x2.dividedBy(DIVIDER_2).times(MULTIPLIER_2);

let c = y2.times(x1).minus(y1.times(x2)).dividedBy(x1.minus(x2));
let m = y1.minus(c).dividedBy(x1);

let y1_formula = m.times(x1).plus(c);

console.log('c = ', c);
console.log('m = ', m);
console.log('y1 = ', y1.toFixed(), y1_formula.toFixed());
console.log('y2 = ', y2);

console.log('y1 === mx1+c', y1.isEqualTo(y1_formula));
