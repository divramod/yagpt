require('shelljs/global');

exports.printMsg = function() {
  console.log("This is a message from the demo package");
}

let test = pwd().toString()
console.log(test);

console.log("hello world");
