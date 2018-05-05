"use strict";
var C_GameObject = /** @class */ (function () {
    function C_GameObject(_myState) {
        if (_myState === void 0) { _myState = "feld"; }
        this.feldNumber = "";
        this.myState = "";
        this.ID = 0;
        this.feldNumber;
        this.ID;
        this.myState = _myState;
    }
    C_GameObject.prototype.SetID = function (ID) {
        this.ID = ID;
    };
    C_GameObject.prototype.GetID = function () {
        return this.ID;
    };
    // only for Feld
    C_GameObject.prototype.GetFeldcolor = function () {
        return (this.toNumber(this.feldNumber[0]) + Number(this.feldNumber[1])) % 2;
    };
    C_GameObject.prototype.SetFeld = function (X, Y) {
        this.feldNumber = String(this.toNumber(X));
        this.feldNumber += String(Y);
    };
    C_GameObject.prototype.SetState = function (state) {
        this.myState = state;
    };
    C_GameObject.prototype.GetState = function () {
        return this.myState;
    };
    C_GameObject.prototype.toNumber = function (char) {
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
    return C_GameObject;
}());
//# sourceMappingURL=C_GameObject.js.map