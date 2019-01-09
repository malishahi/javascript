const readline = require('readline');
const binarySearch = require('./src/binarySearch.js');

let inputArray = [];

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.setPrompt('Enter a number: ');

rl.on('SIGINT', () => {
    rl.question('Are you sure you want to exit? ', (answer) => {
        if (answer.match(/^y(es)?$/i)) rl.pause();
    });
});

rl.on('line', (input) => {
    if (input) {
        console.log(`Input number: ${input}`);
        inputArray.push(input);
    } else {
        console.log(`No input provided, now we ask for an element to look for in the array: ${input}`);
        search();
    }
});

function search() {
    rl.question('Enter a number to look for its index in the array, or press enter to continue with array formation?\n', (answer) => {
        if (answer) {
            console.log(`x is: ${answer}`);
            //call binary search, and provide result
            let index = binarySearch(inputArray, parseFloat(answer.trim()));
            if(index >= 0)
                console.log(`${answer} is found at : ${index}`);
            else
                console.log(`${answer} is not found in this array, but appropriate insertion point is at: ${index}`);

            console.log(`Calling again search`);
            search();
        } else
            userInteraction();
    });
}

//again ask question if the user wants to create a new array, or would like to search in this array
function userInteraction() {
    rl.question('Do you want to adding numbers to this array(Y), or would like to create a new array(N)?\n', (answer) => {
        if (answer === 'y' || answer === 'Y') {
            console.log('Continue to add more numbers to this array.');
        } else {
            console.log('Creating a new array.');
            inputArray.length = 0;
        }
        rl.prompt();
    });
}

userInteraction();
//const binary