"use strict";
var C_InputManager = /** @class */ (function () {
    function C_InputManager() {
        this.atlasLink = "../image/c62bb9b27329447cb2b937fe6213889a.jpg";
        this.startPos = new C_Vector3(8, 15, -20);
        this.canvasSizeW = 600;
        this.canvasSizeH = 600;
        this.isYourTure = true;
        this.wasFisrtTure = false;
    }
    C_InputManager.prototype.update = function () {
        this.startPos.x = Number(document.getElementById("SX").value);
        this.startPos.y = Number(document.getElementById("SY").value);
        this.startPos.z = Number(document.getElementById("SZ").value);
        this.canvasSizeW = Number(document.getElementById("canvasSizeW").value);
        this.canvasSizeH = Number(document.getElementById("canvasSizeH").value);
    };
    C_InputManager.prototype.move = function () {
        gRuls.isMoveOK("B1", gFigure[10], "B3");
    };
    C_InputManager.prototype.setOptionsInHtml = function (ID, state) {
        var x = document.createElement("OPTION");
        x.setAttribute("value", String(Number(ID) - 1));
        var t = document.createTextNode(state + ID);
        x.appendChild(t);
        document.getElementById("PlayerSelect").appendChild(x);
    };
    C_InputManager.prototype.CreateNewMoveOption = function (X, Y) {
        var x = document.createElement("OPTION");
        x.setAttribute("value", String(String(X) + String(Y)));
        var t = document.createTextNode(String(X) + String(Y));
        x.appendChild(t);
        document.getElementById("PlayerCanMove").appendChild(x);
    };
    C_InputManager.prototype.removeOldMoveOptions = function () {
        if (this.wasFisrtTure) {
            while (document.getElementById("PlayerCanMove").firstChild) {
                document.getElementById("PlayerCanMove").removeChild(document.getElementById("PlayerCanMove").firstChild);
            }
        }
        this.wasFisrtTure = true;
    };
    return C_InputManager;
}());
var C_ruls = /** @class */ (function () {
    function C_ruls() {
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
    C_ruls.prototype.SetOnfeld = function (state, ID, targetA, targetB) {
        this.feld[targetA][targetB] = state + String(ID);
    };
    C_ruls.prototype.getFeld = function () {
        return this.feld;
    };
    C_ruls.prototype.isMoveOK = function (pos, figure, target) {
        // toodo Fals
        this.MoveOK([Number(this.toNumber(pos[0])), Number(pos[1])], figure, [Number(target[0]), Number(target[1])]);
        return true;
    };
    C_ruls.prototype.iCanMove = function (figure) {
        if (figure.GetState() == "WB" || "BB") {
            this.iCanBauerMove(figure.GetFeldNumber(), figure.GetfristMove(), figure.GetState());
        }
    };
    // A1 to array number [1][1]
    C_ruls.prototype.SetWorkPos = function (pos) {
        console.log(pos);
        this.WorkPos[0] = Number(this.toNumber(pos[0])) - 1;
        this.WorkPos[1] = Number(pos[1]);
    };
    C_ruls.prototype.SetWorkToString = function (pos) {
        console.log(pos);
        var a = String(this.toNumber(pos[0]));
        var b = String(pos[1]);
        var temp = a + b;
        return temp;
    };
    C_ruls.prototype.iCanBauerMove = function (feldNumber, fristmove, site) {
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
    };
    C_ruls.prototype.restOldSelect = function () {
        for (var X = 0; X < this.feld.length; X++) {
            for (var Y = 0; Y < this.feld.length; Y++) {
                if (this.feld[X][Y] == "X") {
                    gCubes[X][Y].restColor();
                    this.feld[X][Y] = "";
                }
            }
        }
        gInputManager.removeOldMoveOptions();
    };
    C_ruls.prototype.SetSelectFeld = function (A, B) {
        this.feld[A][B] = "X";
        gCubes[A][B].SetSelctionColor();
        gInputManager.CreateNewMoveOption(A, B);
    };
    C_ruls.prototype.MoveOK = function (pos, figure, target) {
        console.log(pos[0] - 1);
        var temp = this.feld[pos[0] - 1][pos[1]];
        this.feld[pos[0] - 1][pos[1]] = "";
        this.feld[target[0]][target[1]] = temp;
        figure.setPosition(target[0], 1.0, -target[1]);
        gCubes[target[0]][target[1]].restColor();
        this.restOldSelect();
    };
    C_ruls.prototype.toNumber = function (char) {
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
    };
    return C_ruls;
}());
//# sourceMappingURL=HtmlInputManager.js.map