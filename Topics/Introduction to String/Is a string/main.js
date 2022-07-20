function isString(data) {
    if (typeof data === 'string') {
        return true;
    } else {
        return false;
    }
}
console.log(isString('this is a string'));
console.log(isString('test code'));