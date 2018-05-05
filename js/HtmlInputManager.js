"use strict";
var C_InputManager = /** @class */ (function () {
    function C_InputManager() {
        this.atlasLink = "../image/c62bb9b27329447cb2b937fe6213889a.jpg";
        this.startPos = new C_Vector3(8, 15, -20);
        this.canvasSizeW = 600;
        this.canvasSizeH = 600;
        this.isYourTure = true;
    }
    C_InputManager.prototype.update = function () {
        this.startPos.x = Number(document.getElementById("SX").value);
        this.startPos.y = Number(document.getElementById("SY").value);
        this.startPos.z = Number(document.getElementById("SZ").value);
        this.canvasSizeW = Number(document.getElementById("canvasSizeW").value);
        this.canvasSizeH = Number(document.getElementById("canvasSizeH").value);
    };
    C_InputManager.prototype.yourCommand = function () {
        gRuls.isMoveOK("B1", gFigure[10], "B3");
    };
    C_InputManager.prototype.setOptionsInHtml = function (ID, state) {
        var x = document.createElement("OPTION");
        x.setAttribute("value", String(Number(ID) - 1));
        var t = document.createTextNode(state + ID);
        x.appendChild(t);
        document.getElementById("PlayerSelect").appendChild(x);
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
        this.feld;
    }
    /**
     * SetOnfeld
     */
    C_ruls.prototype.SetOnfeld = function (state, ID, targetA, targetB) {
        this.feld[targetA][targetB] = state + String(ID);
        console.log(this.feld);
    };
    C_ruls.prototype.isMoveOK = function (pos, figure, target) {
        var posA = Number(this.toNumber(pos[0]));
        var posB = Number(pos[1]);
        var targetA = Number(this.toNumber(target[0]));
        var targetB = Number(target[1]);
        this.MoveOK([posA, posB], figure, [targetA, targetB]);
        return false;
    };
    C_ruls.prototype.MoveOK = function (move, figure, target) {
        var temp = this.feld[move[0]][move[1]];
        this.feld[move[0]][move[1]] = "";
        this.feld[target[0]][target[1]] = temp;
        figure.setPosition(target[0], -1.0, -target[1]);
        console.log("errgbins");
        console.log(temp);
        console.log(this.feld);
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
            return -1;
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
        return -1; // only by error
    };
    return C_ruls;
}());
//# sourceMappingURL=HtmlInputManager.js.map