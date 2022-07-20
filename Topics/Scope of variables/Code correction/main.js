myVar = "global";

function myFunc() {
    myVar = "new global";
    console.log(myVar);
}

myFunc();