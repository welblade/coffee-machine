const input = require('sync-input');

class CoffeeIngredients {
    #list = new Map();
    constructor(water, milk, coffeeBeans) {
        this.#list =new Map([
            ['water', { quantity: water, unity: 'ml' }],
            ['milk', { quantity: milk, unity: 'ml' }],
            ['coffee beans', { quantity: coffeeBeans, unity: 'grams' }],
        ]);
    }

    forEach(callback) {
        this.#list.forEach(callback);
    }

    get(key) {
        return this.#list.get(key);
    };
}

class CoffeeRecipe {
    constructor(water, milk, coffeeBeans, price) {
        this.ingredients = new CoffeeIngredients(water, milk, coffeeBeans);
        this.price = price;
    }
}

class CoffeeMachine {
    constructor() {
        this.money = 550;
        this.disposableCups = 9;
        this.ingredients = new CoffeeIngredients(400, 540, 120);
    }

    supplyIngredient(ingredient, amount) {
        this.ingredients.get(ingredient).quantity += amount;
    }

    supplyCups(amount) {
        this.disposableCups += amount;
    }

    buy(recipe) {
        this.checkSupply(recipe);
        this.ingredients.forEach((value, key) => {
            this.ingredients.get(key).quantity -= recipe.ingredients.get(key).quantity;
        });
        this.money += recipe.price;
        this.disposableCups--;
    }

    checkSupply(recipe) {
        this.ingredients.forEach((value, key) => {
            if (this.ingredients.get(key).quantity < recipe.ingredients.get(key).quantity) {
                throw new Error(`Sorry, not enough ${key}!`);
            }
        });
        if (this.disposableCups < 1) {
            throw new Error(`Sorry, not enough disposable cups!`);
        }
    }

    flushMoney() {
        let money = this.money;
        this.money = 0;
        return money;
    }
}

const coffeeMachineController = {
    machine: {},
    recipes: [],
    addRecipe(name, recipe) {
        this.recipes.push({ name: name, recipe: recipe });
    },
    addCoffeeMachine(machine) {
        this.machine = machine;
    },
    logMachineState() {
        console.log('The coffee machine has:');
        console.log(`${this.machine.ingredients.get('water').quantity} ml of water`);
        console.log(`${this.machine.ingredients.get('milk').quantity} ml of milk`);
        console.log(`${this.machine.ingredients.get('coffee beans').quantity} g of coffee beans`);
        console.log(`${this.machine.disposableCups} disposable cups`);
        console.log(`$${this.machine.money} of money`);
    },
    promptAction() {
        console.log('Write action (buy, fill, take, remaining, exit):');
        return input().toLowerCase();
    },
    buyAction() {
        let options = this.recipes.reduce(
            (previousValue, currentValue, currentIndex) => {
                return `${previousValue}${currentIndex + 1} - ${currentValue.name}, `;
            }
        , 'What do you want to buy? ');
        console.log(options.slice(0, -2) + ', back - to main menu:');
        let option = input();

        if (option.toLowerCase() === 'back') {
            return;
        }

        let type = this.recipes[Number(option) - 1].recipe;
        this.machine.buy(type, 1);
        console.log('I have enough resources, making you a coffee!');
    },
    fillAction() {
        this.machine.ingredients.forEach((data, ingredient) => {
            console.log(`Write how many ${data.unity} of ${ingredient} you want to add:`);
            const amount = Number(input());
            this.machine.supplyIngredient(ingredient, amount);
        });
        console.log(`Write how many disposable coffee cups you want to add:`);
        const cups = Number(input());
        this.machine.supplyCups(cups);
    },
    takeAction() {
        let money = this.machine.flushMoney();
        console.log(`I gave you $${money}`);
    },
    startMachine() {
        let option;
        do {
            option = this.promptAction();
            console.log("");
            switch (option) {
                case 'buy':
                    try {
                        this.buyAction();
                    } catch (e) {
                        console.log(e.message);
                    }
                    break;
                case 'fill':
                    this.fillAction();
                    break;
                case 'take':
                    this.takeAction();
                    break;
                case 'remaining':
                    this.logMachineState();
                    break;
            }
            console.log("");
        } while (option !== 'exit');
    }
}

coffeeMachineController.addCoffeeMachine(new CoffeeMachine());
coffeeMachineController.addRecipe('espresso', new CoffeeRecipe(250, 0, 16, 4));
coffeeMachineController.addRecipe('latte', new CoffeeRecipe(350, 75, 20, 7));
coffeeMachineController.addRecipe('cappuccino', new CoffeeRecipe(200, 100, 12, 6));
coffeeMachineController.addRecipe('double espresso', new CoffeeRecipe(500, 0, 32, 7));

coffeeMachineController.startMachine();