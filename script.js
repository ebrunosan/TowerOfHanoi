// Writen on: Nov 23, 2016
// Writen by: Bruno Santos

"use strict";
var c, ctx;                     // used to draw canvas

const GAME_LEVEL = 3;           // TODO: define object

const BASIC_LEVEL = 3;           // TODO: define object
const BASIC_MOVEMENTS = 7;
const HARD_LEVEL = 4;           // TODO: define object
const HARD_MOVEMENTS = 15;
const PRO_LEVEL = 4;           // TODO: define object
const PRO_MOVEMENTS = 31;

const RING_HEIGHT = 20;         // fixed high of rings

var towerArr = [5];             // array length of max level which contains tower's objects 
var countPlayersMovement = 0;   // general counter to show
var bestMovementsToSolve = 0;   // it's a counter of an array movementsToSolve

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
        for (var i=numRings; i>0; i--) {
            this.receiveNewRing(new Ring(i));
        }
    }
}
/* ----------------
* OBJECT: used to stores Rings properties and actions
*/
function Ring(size) {
    this.size = size;
    switch (this.size) {            // stabilish visual properties of each ring size
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
    var xClicked = event.offsetX;
    var yClicked = event.offsetY;

    if (xClicked >= 35 && xClicked <= 255) {            // if clicked on TowerA
        workOnMovementRing(0, 1, 2);
    } else if (xClicked >= 285 && xClicked <= 505) {    // if clicked on TowerB
        workOnMovementRing(1, 0, 2);
    } else if (xClicked >= 540 && xClicked <= 760) {    // if clicked on TowerC
        workOnMovementRing(2, 0, 1);
    }
}
/* ----------------
* FUNCTION: It performs a movement of a ring based on the tower clicked
*/
function workOnMovementRing(idxTowerClicked, idxOtherTower1, idxOtherTower2) {
    var idxTowerSrc, idxTowerDst;
    
    if (towerArr[idxTowerClicked].isThereARingOnTop) {
        towerArr[idxTowerClicked].moveRingDown();
        
    } else if (towerArr[idxOtherTower1].isThereARingOnTop) {
        idxTowerSrc = idxOtherTower1;
        idxTowerDst = idxTowerClicked;
        moveRing(idxTowerSrc, idxTowerDst);
        
    } else if (towerArr[idxOtherTower2].isThereARingOnTop) {
        idxTowerSrc = idxOtherTower2;
        idxTowerDst = idxTowerClicked;
        moveRing(idxTowerSrc, idxTowerDst);
        
    } else {
        towerArr[idxTowerClicked].moveRingUp();
    }
    return;
}
/* ----------------
* FUNCTION: It performs a movement of a ring from a source Tower to a Destination
*/
function moveRing(idxTowerSrc, idxTowerDst) {
    var ring2Move = towerArr[idxTowerSrc].getHigherRing();
    
    if (towerArr[idxTowerDst].isAble2ReceiveRing(ring2Move)) {
        towerArr[idxTowerSrc].releaseRing();
        towerArr[idxTowerDst].receiveNewRing(ring2Move);
        countPlayersMovement++;
        checkEndOfGame(idxTowerDst);
    } else {
        showAlert("<h2>Ops!</h2>Movement not allowed!<br>You can't move a higher ring over a lower one.<br>Click on <strong>instructions</strong> to check it out all rules if you want.", "hideAlert");
    }
}
/* ----------------
* FUNCTION: Shows message and reset the game if users reach end of the game
*/
function checkEndOfGame(idxTowerDst) {
    if (idxTowerDst != 0 && towerArr[idxTowerDst].ringsArr.length == GAME_LEVEL) {
        var msg = "";
        if (countPlayersMovement == bestMovementsToSolve) {
            msg = "<h2>Perfect!</h2>You reached the goal pretty well!";
            msg += "<br>I wish you enjoyed the game! <br>Challenge yourself selecting a higher level of the game."
        } else {
            msg = "<h2>You could be better!</h2>You reached the goal with more movements than expected."; 
            msg+= "<br>Let's try it again with "+bestMovementsToSolve+" movements.";
        }
        showAlert(msg, "reset");
    }
}
/* ----------------
* FUNCTION: It reset the screen drawing towers and loading rings based on a level selected
*/
function reset() {
    c = document.getElementById("myCanvas");
    ctx = c.getContext("2d");
    var towerCenterX;

    document.getElementById("alert").style.zIndex="-1";
    activateMoveGame(true);

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

    // It fills all rings at tower "A" based on a level selected
    initialState(GAME_LEVEL);
}
/* ----------------
* FUNCTION: 1) It builds start rings into Tower A
*           2) fills solution array
*           3) shows the best numbers of movements
*/
function initialState(levelGame) {
    towerArr[0].initialState(levelGame);
    countPlayersMovement = 0;
    switch (GAME_LEVEL) {
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
    return;
}
/* ----------------
* FUNCTION: It hides a div id=alert
*/
function hideAlert() {
    document.getElementById("alert").style.zIndex="-1";
    activateMoveGame(true);
}
/* ----------------
* FUNCTION: It presents a div id=alert and presents a message by its caller
*/
function showAlert(msg, nextAction) {
    document.getElementById("alertMsg").innerHTML = msg;
    document.getElementById("alert").style.zIndex="1";
    if (nextAction=="reset"){
        document.getElementById("msgBoxDialogBtn").onclick = function onclick(event) {reset(event)};
    } else {
        document.getElementById("msgBoxDialogBtn").onclick = function onclick(event) {hideAlert(event)};
    }
    activateMoveGame(false);
}
/* ----------------
* FUNCTION: It enable/disable click on tower when shows a dialog box
*/
function activateMoveGame(bValue) {
    if (bValue){
        document.getElementById("myCanvas").onclick=function onclick(event) {getPositionClicked(event)};
    } else {
        document.getElementById("myCanvas").onclick="";
    }
}