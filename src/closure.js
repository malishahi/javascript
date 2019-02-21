
function main() {
    let c = 5;
    function outer() {
        let b = 10;
        console.log('c:', c, 'b:', b);

        function inner() {
            let a = 20;
            console.log('c:', c, 'a:', a, 'b:', b);
            b++;
            a++;
            c++;

            return [a, b, c];
        }

        return inner;
    }

    return outer;
}

module.exports.mainClosure = main;