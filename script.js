// Writen on: Nov 23, 2016
// Writen by: Bruno Santos

'use strict';
const BASIC_LEVEL = 3;
const BASIC_MOVEMENTS = 7;
const HARD_LEVEL = 4;
const HARD_MOVEMENTS = 15;
const PRO_LEVEL = 5;
const PRO_MOVEMENTS = 31;

const IDX_TOWER_A = 0;
const IDX_TOWER_B = 1;
const IDX_TOWER_C = 2;

const RING_HEIGHT = 20;         // fixed high of rings

let towerArr = [5];             // array length of max level which contains tower's objects 
let countPlayersMovement = 0;   // general counter to show
let bestMovementsToSolve = 0;   // it's a counter of an array movementsToSolve

let c, ctx;                     // used to draw canvas
c = document.getElementById("myCanvas");
ctx = c.getContext("2d");

let gameLevel;
let cmbGameLevel = document.getElementById("gameMode");
cmbGameLevel.onchange=function onchange(event) {reset()};

document.getElementById("reset").onclick=function onclick(event) {reset()};

window.onload = reset;

/* ----------------
* OBJECT: used to store Rings objects and act on each one
*/
function Tower(centerX) {
    this.centerX = centerX;     // it is used to draw object Rings on each tower
    this.ringsArr = [];         // it stores Rings object
    this.topTowerY = 100;
    this.isThereARingOnTop = false; // it is used to interact using click Up/Down Rings
    
    // it returns true if it can receive an object Ring otherwise, return false
    this.isAble2ReceiveRing = function(ring) {
        return (this.ringsArr.length==0 || this.ringsArr[this.ringsArr.length-1].size > ring.size)? true : false;
    };    
    // it returns a higher object Rings in Tower if there is one
    this.getHigherRing = function() {
        return (this.ringsArr==0)? -1 : this.ringsArr[this.ringsArr.length-1];
    };    
    // it returns the lower y coordinates based on number of rings stacked
    this.getLowerY = function() {
        return (330 - (this.ringsArr.length * RING_HEIGHT));
    };    
    // it release an object Rings from the RingsArr[]
    this.releaseRing = function() {
        this.ringsArr[this.ringsArr.length-1].clearMe(this.centerX, this.topTowerY);
        this.ringsArr.pop();
        this.isThereARingOnTop = false;
        return;
    };    
    // it store an object Rings into the RingsArr[]
    this.receiveNewRing = function(ring) {
        ring.drawMe(this.centerX, this.getLowerY());
        this.ringsArr.push(ring);
        return;
    };
    // It shows an interactive action moving a ring up to the tower
    this.moveRingUp = function() {
        this.ringsArr[this.ringsArr.length-1].preMoveRing(this.centerX, this.getLowerY() + RING_HEIGHT, this.topTowerY);
        this.isThereARingOnTop = true;
        return;
    };
    // It shows an interactive action moving a ring down to the tower
    this.moveRingDown = function() {
        this.ringsArr[this.ringsArr.length-1].preMoveRing(this.centerX, this.topTowerY, this.getLowerY() + RING_HEIGHT);
        this.isThereARingOnTop = false;
        return;
    };
    // It stack "n" object Rings over tower based on a level selected
    this.initialState = function(numRings) {
        for (let i=numRings; i>0; i--) {
            this.receiveNewRing(new Ring(i));
        }
    }
}
/* ----------------
* OBJECT: used to stores Rings properties and actions
*/
function Ring(size) {
    this.size = size;
    switch (this.size) {            // sets visual properties of each ring size
        case 5:
            this.width = 220;
            this.color = "purple";
            break;
        case 4:
            this.width = 180;
            this.color = "gray";
            break;
        case 3:
            this.width = 140;
            this.color = "red";
            break;
        case 2:
            this.width = 100;
            this.color = "green";
            break;
        case 1:
            this.width = 60;
            this.color = "blue";
            break;
    }
    // It draws a canvas of a Ring based on tower's coordinate
    this.drawMe = function(centerX, lowerY){
        ctx.fillStyle = this.color;
        ctx.fillRect(centerX - this.width/2, lowerY, this.width, RING_HEIGHT);
        ctx.fillStyle = "yellow";
        ctx.font='20px Arial';
        ctx.fillText(this.size, centerX-3, lowerY+RING_HEIGHT-2);
        return;
    };
    // It simulates a move up/down on canvas based on tower's coordinate
    this.preMoveRing = function(centerX, lowerY, higherY) {
        this.clearMe(centerX, lowerY);
        this.drawMe(centerX, higherY);
        return;
    };
    // It clears a place where a Ring was in a tower
    this.clearMe = function(centerX, lowerY){
        ctx.clearRect(centerX - this.width/2, lowerY, this.width, RING_HEIGHT);
        // Redraw the left tower space only if ring is in there
        if (lowerY > 150) {
            ctx.fillStyle = "black";
            ctx.fillRect(centerX, lowerY, 10, RING_HEIGHT);
        }
        return;
    };   
}
/* ----------------
* FUNCTION: It interact with rings if it's clicked over tower's coordinate
*/
function getPositionClicked(event) {
    let xClicked = event.offsetX;
    let yClicked = event.offsetY;
    
    showMsg("");

    // TODO improve the settings of those 3 IDX as parameters below
    if (xClicked >= 35 && xClicked <= 255) {            // if clicked on TowerA
        workOnMovementRing(IDX_TOWER_A, IDX_TOWER_B, IDX_TOWER_C);
        
    } else if (xClicked >= 285 && xClicked <= 505) {    // if clicked on TowerB
        workOnMovementRing(IDX_TOWER_B, IDX_TOWER_A, IDX_TOWER_C);
        
    } else if (xClicked >= 540 && xClicked <= 760) {    // if clicked on TowerC
        workOnMovementRing(IDX_TOWER_C, IDX_TOWER_A, IDX_TOWER_B);
    }
}
/* ----------------
* FUNCTION: It performs a movement of a ring based on the tower clicked
*/
function workOnMovementRing(idxTowerClicked, idxOtherTower1, idxOtherTower2) {
    if (towerArr[idxTowerClicked].isThereARingOnTop) {
        towerArr[idxTowerClicked].moveRingDown();
        
    } else if (towerArr[idxOtherTower1].isThereARingOnTop) {
        moveRing(idxOtherTower1, idxTowerClicked);
        
    } else if (towerArr[idxOtherTower2].isThereARingOnTop) {
        moveRing(idxOtherTower2, idxTowerClicked);
        
    } else if (towerArr[idxTowerClicked].ringsArr.length > 0) {
        towerArr[idxTowerClicked].moveRingUp();
    }
    return;
}
/* ----------------
* FUNCTION: It performs a movement of a ring from a source Tower to a Destination
*/
function moveRing(idxTowerSrc, idxTowerDst) {
    let ring2Move = towerArr[idxTowerSrc].getHigherRing();
    
    if (towerArr[idxTowerDst].isAble2ReceiveRing(ring2Move)) {
        towerArr[idxTowerSrc].releaseRing();
        towerArr[idxTowerDst].receiveNewRing(ring2Move);
        countPlayersMovement++;
        checkEndOfGame(idxTowerDst);
    } else {
        showMsg("Movement not allowed!");
    }
}
/* ----------------
* FUNCTION: Shows message and reset the game if users reach end of the game
*/
function checkEndOfGame(idxTowerDst) {
    let msg = "";
    if (idxTowerDst != 0 && towerArr[idxTowerDst].ringsArr.length == gameLevel) {
        if (countPlayersMovement == bestMovementsToSolve) {
            msg = "Perfect! Goal reached with mimimum ";
        } else {
            msg = "Well done! You should try with ";
        }
        msg += bestMovementsToSolve+" moves.";
        c.onclick="";       // remove canvas event
    }
    showMsg(msg);
}
/* ----------------
* FUNCTION: It reset the screen drawing towers and loading rings based on a level selected
*/
function reset() {
    drawCanvas();
    c.onclick=function onclick(event) {getPositionClicked(event)};

    // It fills all rings at tower "A" based on a level selected
    gameLevel = +cmbGameLevel.options[cmbGameLevel.selectedIndex].value;
    towerArr[0].initialState(gameLevel);
    countPlayersMovement = 0;
    switch (gameLevel) {
        case PRO_LEVEL: 
            bestMovementsToSolve = PRO_MOVEMENTS;
            break;
        case HARD_LEVEL: 
            bestMovementsToSolve = HARD_MOVEMENTS;
            break;
        default:
            bestMovementsToSolve = BASIC_MOVEMENTS;
            break;
    }
    showMsg("Good luck!");
    return;
}
/* ----------------
* FUNCTION: It presents a div id=alert and presents a message by its caller
*/
function drawCanvas() {
    let towerCenterX;

    // Drawing tower's and loading tower's Object into global towerArr[]
    ctx.fillStyle = "black";
    ctx.font='25px Arial';

    ctx.clearRect(0, 0, c.width, c.height); // Clear all screen
    ctx.fillRect(20, 350, 760, 10);
    
    towerCenterX = 140;                     // drawing Tower A and build its object
    towerArr[0] = new Tower(towerCenterX);
    ctx.fillRect(towerCenterX, 150, 10, 200);
    ctx.fillText('Tower A',100,60);
    
    towerCenterX = 400;                     // drawing Tower B and build its object
    towerArr[1] = new Tower(towerCenterX);
    ctx.fillRect(towerCenterX, 150, 10, 200);
    ctx.fillText('Tower B',350,60);

    towerCenterX = 650;                     // drawing Tower C and build its object
    towerArr[2] = new Tower(towerCenterX);
    ctx.fillRect(towerCenterX, 150, 10, 200);
    ctx.fillText('Tower C',600,60);
}
/* ----------------
* FUNCTION: It presents a div id=alert and presents a message by its caller
*/
function showMsg(msg) {
    document.getElementById("gameMsg").innerHTML = msg;
}
