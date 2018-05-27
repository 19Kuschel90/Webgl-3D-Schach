"use strict";
class C_InputManager {
    constructor() {
        this.atlasLink = "../image/c62bb9b27329447cb2b937fe6213889a.jpg";
        this.startPos = new C_Vector3(8, 15, -20);
        this.canvasSizeW = 600;
        this.canvasSizeH = 600;
        this.isYourTure = true;
        this.wasFisrtTure = false;
    }
    update() {
        this.startPos.x = Number(document.getElementById("SX").value);
        this.startPos.y = Number(document.getElementById("SY").value);
        this.startPos.z = Number(document.getElementById("SZ").value);
        this.canvasSizeW = Number(document.getElementById("canvasSizeW").value);
        this.canvasSizeH = Number(document.getElementById("canvasSizeH").value);
    }
    move() {
        gRuls.isMoveOK("B1", gFigure[10], "B3");
    }
    setOptionsInHtml(ID, state) {
        var x = document.createElement("OPTION");
        x.setAttribute("value", String(Number(ID) - 1));
        var t = document.createTextNode(state + ID);
        x.appendChild(t);
        document.getElementById("PlayerSelect").appendChild(x);
    }
    CreateNewMoveOption(X, Y) {
        var x = document.createElement("OPTION");
        x.setAttribute("value", String(String(X) + String(Y)));
        var t = document.createTextNode(String(X) + String(Y));
        x.appendChild(t);
        document.getElementById("PlayerCanMove").appendChild(x);
    }
    removeOldMoveOptions() {
        if (this.wasFisrtTure) {
            while (document.getElementById("PlayerCanMove").firstChild) {
                document.getElementById("PlayerCanMove").removeChild(document.getElementById("PlayerCanMove").firstChild);
            }
        }
        this.wasFisrtTure = true;
    }
}
class C_ruls {
    constructor() {
        this.feld = [
            ["", "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "", ""]
        ];
        this.WorkPos = []; // temp figure Pos
        this.WorkPosTarget = []; // temp traget pos
        this.feld;
        this.WorkPos;
    }
    /**
     * SetOnfeld
     */
    SetOnfeld(state, ID, targetA, targetB) {
        this.feld[targetA][targetB] = state + String(ID);
    }
    getFeld() {
        return this.feld;
    }
    isMoveOK(pos, figure, target) {
        // toodo Fals
        this.MoveOK([Number(this.toNumber(pos[0])), Number(pos[1])], figure, [Number(target[0]), Number(target[1])]);
        return true;
    }
    iCanMove(figure) {
        console.log(figure.GetState());
        // Bauer
        if ((figure.GetState() == "WB") || ("BB" == figure.GetState())) {
            console.log("Bauer");
            this.iCanBauerMove(figure.GetFeldNumber(), figure.GetfristMove(), figure.GetState()); // too do Kurzen
        }
        else if ((figure.GetState() == "WL") || ("BL" == figure.GetState())) {
            console.log("Laufer");
            this.moveLeufer(figure.GetFeldNumber());
        }
        else if ((figure.GetState() == "WT") || ("BT" == figure.GetState())) {
            console.log("Tower");
            this.canMoveLeftRightTopBot(figure.GetFeldNumber());
        }
    }
    // A1 to array number [1][1]
    SetWorkPos(pos) {
        console.log(pos);
        this.WorkPos[0] = Number(this.toNumber(pos[0])) - 1;
        this.WorkPos[1] = Number(pos[1]);
    }
    SetWorkToString(pos) {
        var a = String(this.toNumber(pos[0]));
        var b = String(pos[1]);
        var temp = a + b;
        return temp;
    }
    canMoveLeftRightTopBot(feldNumber) {
        this.restOldSelect();
        // console.log(feldNumber);
        this.SetWorkPos(feldNumber);
        for (var top = this.WorkPos[1] + 1; top <= 7; top++) {
            if (this.feld[this.WorkPos[0]][top] == "") {
                console.log(this.WorkPos[0], top);
                this.SetSelectFeld(this.WorkPos[0], top);
            }
            else {
                break;
            }
        }
        for (var bot = this.WorkPos[1] - 1; bot <= 7; bot--) {
            if (this.feld[this.WorkPos[0]][bot] == "") {
                this.SetSelectFeld(this.WorkPos[0], bot);
            }
            else {
                break;
            }
        }
        for (var left = this.WorkPos[0] + 1; left <= 7; left++) {
            if (this.feld[left][this.WorkPos[1]] == "") {
                this.SetSelectFeld(left, this.WorkPos[1]);
            }
        }
        for (var right = this.WorkPos[0] - 1; right <= 7; right--) {
            if (this.feld[right][this.WorkPos[1]] == "") {
                this.SetSelectFeld(right, this.WorkPos[1]);
            }
        }
    }
    // Select
    moveLeufer(feldNumber) {
        this.restOldSelect();
        this.SetWorkPos(feldNumber);
        for (var top = 1; top <= 7; top++) {
            try {
                if (this.feld[this.WorkPos[0] + top][this.WorkPos[1] + top] == "") {
                    this.SetSelectFeld(this.WorkPos[0] + top, this.WorkPos[1] + top);
                }
            }
            catch (e) {
            }
        }
        for (var top = 1; top <= 7; top++) {
            try {
                if (this.feld[this.WorkPos[0] - top][this.WorkPos[1] - top] == "") {
                    this.SetSelectFeld(this.WorkPos[0] - top, this.WorkPos[1] - top);
                }
            }
            catch (e) {
                // break;
            }
        }
        for (var top = 1; top <= 7; top++) {
            try {
                if (this.feld[this.WorkPos[0] + top][this.WorkPos[1] - top] == "") {
                    this.SetSelectFeld(this.WorkPos[0] + top, this.WorkPos[1] - top);
                }
            }
            catch (e) {
                // break;
            }
        }
        for (var top = 1; top <= 7; top++) {
            try {
                if (this.feld[this.WorkPos[0] - top][this.WorkPos[1] + top] == "") {
                    this.SetSelectFeld(this.WorkPos[0] - top, this.WorkPos[1] + top);
                }
            }
            catch (e) {
                // break;
            }
        }
    }
    iCanBauerMove(feldNumber, fristmove, site) {
        this.restOldSelect();
        this.SetWorkPos(feldNumber);
        if ("WB" == site) {
            this.SetSelectFeld(this.WorkPos[0], this.WorkPos[1] - 1);
            if (fristmove == false) {
                this.SetSelectFeld(this.WorkPos[0], this.WorkPos[1] - 2);
            }
        }
        else {
            this.SetSelectFeld(this.WorkPos[0], this.WorkPos[1] + 1);
            if (fristmove == false) {
                this.SetSelectFeld(this.WorkPos[0], this.WorkPos[1] + 2);
            }
        }
    }
    // rest All Select
    restOldSelect() {
        for (var X = 0; X < this.feld.length; X++) {
            for (var Y = 0; Y < this.feld.length; Y++) {
                if (this.feld[X][Y] == "X") {
                    gCubes[X][Y].restColor();
                    this.feld[X][Y] = "";
                }
            }
        }
        gInputManager.removeOldMoveOptions();
    }
    // Select feld and Crate Move in html
    SetSelectFeld(A, B) {
        this.feld[A][B] = "X";
        gCubes[A][B].SetSelctionColor();
        gInputManager.CreateNewMoveOption(A, B);
        console.log(this.feld);
    }
    MoveOK(pos, figure, target) {
        figure.SetfristMove();
        var temp = this.feld[pos[0] - 1][pos[1]];
        this.feld[pos[0] - 1][pos[1]] = "";
        this.feld[target[0]][target[1]] = temp;
        figure.setPosition(target[0], 1.0, -target[1]);
        figure.SetFeldNumber(String(this.toNumber(target[0] + 1)) + String(target[1]));
        gCubes[target[0]][target[1]].restColor();
        this.restOldSelect();
    }
    toNumber(char) {
        if (typeof char === 'string') {
            switch (char) {
                case "A":
                    return 1;
                case "B":
                    return 2;
                case "C":
                    return 3;
                case "D":
                    return 4;
                case "E":
                    return 5;
                case "F":
                    return 6;
                case "G":
                    return 7;
                case "H":
                    return 8;
            }
            return -666;
        }
        else {
            switch (char) {
                case 1:
                    return "A";
                case 2:
                    return "B";
                case 3:
                    return "C";
                case 4:
                    return "D";
                case 5:
                    return "E";
                case 6:
                    return "F";
                case 7:
                    return "G";
                case 8:
                    return "H";
            }
        }
        return -666; // only by error
    }
}
//# sourceMappingURL=HtmlInputManager.js.map