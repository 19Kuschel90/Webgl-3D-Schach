"use strict";
class C_GameObject extends C_Modal {
    constructor(meshData, _myState = "feld") {
        super(meshData);
        this.feldNumber = ""; // z.b: B1 Oder A1
        this.myState = "";
        this.ID = 0;
        this.selctionColor = 4;
        this.color = 0.0;
        this.OrColor = 0.0;
        this.wasFristMove = false;
        this.feldNumber;
        this.ID;
        this.myState = _myState;
        this.color;
        this.selctionColor;
        this.OrColor;
        this.wasFristMove;
    }
    SetfristMove() {
        this.wasFristMove = true;
    }
    GetfristMove() {
        return this.wasFristMove;
    }
    GetColor() {
        return this.color;
    }
    setColor(color) {
        this.OrColor = this.color;
        this.color = color;
    }
    restColor() {
        this.color = this.OrColor;
    }
    SetSelctionColor() {
        this.setColor(this.selctionColor);
    }
    SetID(ID) {
        this.ID = ID;
    }
    GetID() {
        return this.ID;
    }
    /**
     * GetFeldNumber z.b: B1 Oder A1
     */
    GetFeldNumber() {
        return this.feldNumber;
    }
    /**
     * SetFeldNumber
      feldNumber:string :void
      z.b: B1 Oder A1
      */
    SetFeldNumber(feldNumber) {
        this.feldNumber = feldNumber;
    }
    SetFeld(X, Y) {
        this.feldNumber = String(this.toNumber(X));
        this.feldNumber += String(Y);
        this.color = (this.toNumber(this.feldNumber[0]) + Number(this.feldNumber[1])) % 2;
    }
    SetState(state) {
        this.myState = state;
    }
    GetState() {
        return this.myState;
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
//# sourceMappingURL=C_GameObject.js.map