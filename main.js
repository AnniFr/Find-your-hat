const prompt = require('prompt-sync')({sigint: true});

const hat = '^';
const hole = 'O';
const fieldCharacter = '░';
const pathCharacter = '*';

//starting positions
let x = 0;
let y = 0;
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
        for(let i = 0; i < this.field.length; i++) {
            console.log(this.field[i].join(' '))
        }    
    };

    movePlayer = direction => {
        direction = direction.toLowerCase();
        if(direction === 'd' || direction === 'down') {
            y += 1;
            this.hazardCheck(myField.field[y][x]);
            myField.field[y][x] = '*';
            myField.print();
        } else if(direction === 'u' || direction === 'up') {
            y -= 1;
            this.hazardCheck(myField.field[y][x]);
            myField.field[y][x] = '*';
            myField.print();
        } else if(direction === 'r' || direction === 'right') {
            x += 1;
            this.hazardCheck(myField.field[y][x]);
            myField.field[y][x] = '*';
            myField.print();
        } else if(direction === 'l' || direction === 'left') {
            x -= 1;
            this.hazardCheck(myField.field[y][x]);
            myField.field[y][x] = '*';
            myField.print();
        } else {
            console.log('Please use the following commands: up, down, left, right');
        }
     };

     //method checks for hazards each move
     hazardCheck = (coor) => {
        if(coor === 'O') {
            //catches players falling into the hole
            console.log('Oh no! You fell in a hole.');
            gameState = 'gameover';
        } else if(coor === '^') {
            //catches players reaching the hat
            console.log('Yay! You got your hat back!');
            gameState = 'gameover';  
        } else if(coor === '░') {
            //ignores normal path elements
        } else {
            //catches players going out of bounds
            console.log('Oh no! You fell off the map.');
            gameState = 'gameover';
        }
     };

     

     static generateField = (height, width, holesPercentage) => {
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



let myField = new Field(Field.generateField(5,5,50));
myField.print();

while(gameState != 'gameover') {
  const direction = prompt('Which direction will you move in?');
  myField.movePlayer(direction);
}

console.log('Game over!');