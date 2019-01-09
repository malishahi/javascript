

function addAllValues() {
    return this.values.reduce((sum, item) => { return sum + item;});
}

function addAllValuesAndArg(arg) {
    return arg + this.values.reduce((sum, item) => { return sum + item;});
}

module.exports.addAllValues = addAllValues;
module.exports.addAllValuesAndArg = addAllValuesAndArg;