const prompt = require('prompt-sync')({sigint: true});
const term = require('terminal-kit').terminal;

const hat = '^';
const hole = 'O';
const fieldCharacter = '░';
const pathCharacter = '*';

//starting positions
let x = 0;
let y = 0;
let globalHeight;
let globalWidth;
let gameState = '';

ranNumGen = (max) => {
    ranNum = Math.floor(Math.random() * max);
    return ranNum;
};

class Field {
    constructor(field) {
        this.field = field;
    }

    print() {
        term.clear();        
        for(let i = 0; i < this.field.length; i++) {
            console.log(this.field[i].join(' '))
        }    
    };

    movePlayer = direction => {
        direction = direction.toLowerCase();
        if(direction === 'd' || direction === 'down') {
            x += 1;
            this.hazardCheck(myField.field[x][y]);
            myField.field[x][y] = '*';
            myField.print();
        } else if(direction === 'u' || direction === 'up') {
            x -= 1;
            this.hazardCheck(myField.field[x][y]);
            myField.field[x][y] = '*';
            myField.print();
        } else if(direction === 'r' || direction === 'right') {
            y += 1;
            this.hazardCheck(myField.field[x][y]);
            myField.field[x][y] = '*';
            myField.print();
        } else if(direction === 'l' || direction === 'left') {
            y -= 1;
            this.hazardCheck(myField.field[x][y]);
            myField.field[x][y] = '*';
            myField.print();
        } else {
            console.log('Please use the following commands: up, down, left, right');
        }
     };

     //hard mode feature, 1/3 chance of creating an extra hole each turn
     digHole = () => {
        const dice = ranNumGen(3);
        if(dice === 2) {
        let ranHeight = ranNumGen(globalHeight);
        let ranWidth = ranNumGen(globalWidth);
        myField.field[ranWidth][ranHeight] = 'O';
        }
     };

     //method checks for hazards each move
     hazardCheck = (coor) => {
        if(coor === 'O') {
            //catches players falling into the hole
            term.red('Oh no! You fell in a hole. Game over!');
            gameState = 'gameover';
            process.exit(0);
        } else if(coor === '^') {
            //catches players reaching the hat
            term.green('Yay! You got your hat back! You win!');
            gameState = 'gameover';
            process.exit(0);  
        } else if(coor === '░' || coor === '*') {
            //ignores normal path elements and 1/3 chance of creating new hole
            this.digHole();
        } else {
            //catches players going out of bounds
            term.red('Oh no! You fell off the map. Game over.');
            gameState = 'gameover';
            process.exit(0);
        }
     };

     static generateField = (height, width, holesPercentage) => {
        globalHeight = height;
        globalWidth = width;
        let newField = Array(height);
        for(let i = 0; i < height; i++) {
            newField[i] = Array(width).fill(fieldCharacter);
        }
        let holes = Math.round(holesPercentage / 100 * (height * width));
        //randomize hole placement
        for(let i = 0; i < holes; i++) {
            let ranHeight = ranNumGen(height);
            let ranWidth = ranNumGen(width);
            newField[ranHeight][ranWidth] = hole;
        }
        //place hat
        let hatHeight = ranNumGen(height);
        //checks create a hat free zone at [0][0]
            while(hatHeight === 0) {
                hatHeight = ranNumGen(height);
            }
        let hatWidth = ranNumGen(width);
                while(hatWidth === 0) {
            hatWidth = ranNumGen(width);
        }

        newField[hatHeight][hatWidth] = hat;

        //place player
        x = ranNumGen(width);
        y = ranNumGen(height);
        if(newField[x][y] === '░' || newField[x][y] === 'O') {
            newField[x][y] = pathCharacter;
        } else {
            //uses hat free zone for player if random one happens to clash with ^
            x = 0;
            y = 0;
            newField[x][y] = pathCharacter;
        }
        
        //console.log(newField);
        return newField;
     };
    };

let myField = new Field(Field.generateField(5,5,40));
myField.print();
let h = ranNumGen(globalHeight);
let w = ranNumGen(globalWidth);

while(gameState != 'gameover') {
  const direction = prompt('Which direction will you move in?');
  myField.movePlayer(direction);
}

console.log('Game over!');