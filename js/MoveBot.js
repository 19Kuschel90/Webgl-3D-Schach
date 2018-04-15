"use strict";
var C_MoveBot = /** @class */ (function () {
    function C_MoveBot(ObjectTransform, TragetVec, imRun, Speed) {
        if (ObjectTransform === void 0) { ObjectTransform = new C_Transform(); }
        if (TragetVec === void 0) { TragetVec = new C_Vector3(0, 0, 0); }
        if (imRun === void 0) { imRun = false; }
        if (Speed === void 0) { Speed = 1; }
        this.speed = 1;
        this.MyObjectTransform = ObjectTransform;
        this.TragetVec = TragetVec;
        this.isRun = imRun;
        this.speed = Speed;
    }
    C_MoveBot.prototype.Update = function () {
        console.log(this.MyObjectTransform.position.x);
        console.log(this.TragetVec.x);
        if (this.MyObjectTransform.position.x === this.TragetVec.x) {
        }
        else {
            if (this.MyObjectTransform.position.x < this.TragetVec.x) {
                this.MoveX(1);
            }
            else {
                this.MoveX(-1);
            }
        }
        if (this.MyObjectTransform.position.z === this.TragetVec.z) {
        }
        else {
            if (this.MyObjectTransform.position.z < this.TragetVec.z) {
                this.MoveZ(1);
            }
            else {
                this.MoveZ(-1);
            }
        }
    };
    // step * speed
    C_MoveBot.prototype.MoveZ = function (step) {
        this.MyObjectTransform.position.z += step * this.speed;
    };
    // step * speed
    C_MoveBot.prototype.MoveX = function (step) {
        this.MyObjectTransform.position.x += step * this.speed;
    };
    // step * speed
    C_MoveBot.prototype.MoveY = function (step) {
        this.MyObjectTransform.position.y += step * this.speed;
    };
    ////////////////////////////////////////////
    C_MoveBot.prototype.GetSpeed = function () {
        return this.speed;
    };
    C_MoveBot.prototype.SetSpeed = function (Speed) {
        this.speed = Speed;
    };
    //////////////////////////////////////////////////////
    C_MoveBot.prototype.GetMyObjectTransform = function () {
        return this.MyObjectTransform;
    };
    C_MoveBot.prototype.SetMyObjectTransform = function (newTransform) {
        this.MyObjectTransform = newTransform;
    };
    /////////////////////////////////////////////////////
    C_MoveBot.prototype.GetPosition = function () {
        return this.MyObjectTransform.position;
    };
    C_MoveBot.prototype.SetPosition = function (NewVector) {
        this.MyObjectTransform.position = NewVector;
    };
    return C_MoveBot;
}());
//# sourceMappingURL=MoveBot.js.map