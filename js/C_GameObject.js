"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var C_GameObject = /** @class */ (function (_super) {
    __extends(C_GameObject, _super);
    function C_GameObject(meshData, _myState) {
        if (_myState === void 0) { _myState = "feld"; }
        var _this = _super.call(this, meshData) || this;
        _this.feldNumber = ""; // z.b: B1 Oder A1
        _this.myState = "";
        _this.ID = 0;
        _this.selctionColor = 4;
        _this.color = 0.0;
        _this.OrColor = 0.0;
        _this.wasFristMove = false;
        _this.feldNumber;
        _this.ID;
        _this.myState = _myState;
        _this.color;
        _this.selctionColor;
        _this.OrColor;
        _this.wasFristMove;
        return _this;
    }
    C_GameObject.prototype.SetfristMove = function () {
        this.wasFristMove = true;
    };
    C_GameObject.prototype.GetfristMove = function () {
        return this.wasFristMove;
    };
    C_GameObject.prototype.GetColor = function () {
        return this.color;
    };
    C_GameObject.prototype.setColor = function (color) {
        this.OrColor = this.color;
        this.color = color;
    };
    C_GameObject.prototype.restColor = function () {
        this.color = this.OrColor;
    };
    C_GameObject.prototype.SetSelctionColor = function () {
        this.setColor(this.selctionColor);
    };
    C_GameObject.prototype.SetID = function (ID) {
        this.ID = ID;
    };
    C_GameObject.prototype.GetID = function () {
        return this.ID;
    };
    /**
     * GetFeldNumber z.b: B1 Oder A1
     */
    C_GameObject.prototype.GetFeldNumber = function () {
        return this.feldNumber;
    };
    /**
     * SetFeldNumber
      feldNumber:string :void
      z.b: B1 Oder A1
      */
    C_GameObject.prototype.SetFeldNumber = function (feldNumber) {
        this.feldNumber = feldNumber;
    };
    C_GameObject.prototype.SetFeld = function (X, Y) {
        this.feldNumber = String(this.toNumber(X));
        this.feldNumber += String(Y);
        this.color = (this.toNumber(this.feldNumber[0]) + Number(this.feldNumber[1])) % 2;
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
    return C_GameObject;
}(C_Modal));
//# sourceMappingURL=C_GameObject.js.map