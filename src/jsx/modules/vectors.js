'use strict';

const Vectors = [
    { x: -1, y: 0 }, // left
    { x: 0, y: -1 }, // up
    { x: 1, y: 0 },  // right
    { x: 0, y: 1 }   // down
];

Vectors.getVector = function(n) {
    // returns vector given tile value
    let i = n % 4;
    i = i < 0 ? (i + 4) : i;
    return this[i];
};

export default Vectors;
