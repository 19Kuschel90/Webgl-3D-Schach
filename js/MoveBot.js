"use strict";
var C_MoveBot = /** @class */ (function () {
    function C_MoveBot(ObjectTransform, TragetVec, imRun, Speed) {
        if (ObjectTransform === void 0) { ObjectTransform = new C_Transform(); }
        if (TragetVec === void 0) { TragetVec = new C_Vector3(0, 0, 0); }
        if (imRun === void 0) { imRun = true; }
        if (Speed === void 0) { Speed = 1; }
        this.speed = 1;
        this.MyObjectTransform = ObjectTransform;
        this.TragetVec = TragetVec;
        this.isRun = imRun;
        this.speed = Speed;
    }
    C_MoveBot.prototype.Update = function () {
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
        if (this.MyObjectTransform.position.z === this.TragetVec.z) {
            if (this.MyObjectTransform.position.x === this.TragetVec.x) {
                this.isRun = false;
            }
        }
    };
    // step * speed
    C_MoveBot.prototype.MoveZ = function (step) {
        var temp = step * this.speed;
        this.MyObjectTransform.position.z += temp;
        if (this.MyObjectTransform.position.z < this.TragetVec.z) {
            if (this.MyObjectTransform.position.z + temp > this.TragetVec.z) {
                this.MyObjectTransform.position.z = this.TragetVec.z;
            }
        }
        if (this.MyObjectTransform.position.z > this.TragetVec.z) {
            if (this.MyObjectTransform.position.z + temp < this.TragetVec.z) {
                this.MyObjectTransform.position.z = this.TragetVec.z;
            }
        }
    };
    // step * speed
    C_MoveBot.prototype.MoveX = function (step) {
        var temp = step * this.speed;
        this.MyObjectTransform.position.x += temp;
        if (this.MyObjectTransform.position.x < this.TragetVec.x) {
            if (this.MyObjectTransform.position.x + temp > this.TragetVec.x) {
                this.MyObjectTransform.position.x = this.TragetVec.x;
            }
        }
        if (this.MyObjectTransform.position.x > this.TragetVec.x) {
            if (this.MyObjectTransform.position.x + temp < this.TragetVec.x) {
                this.MyObjectTransform.position.x = this.TragetVec.x;
            }
        }
    };
    // step * speed
    C_MoveBot.prototype.MoveY = function (step) {
        var temp = step * this.speed;
        this.MyObjectTransform.position.y += temp;
        if (this.MyObjectTransform.position.y < this.TragetVec.y) {
            if (this.MyObjectTransform.position.y + temp > this.TragetVec.y) {
                this.MyObjectTransform.position.y = this.TragetVec.y;
            }
        }
        if (this.MyObjectTransform.position.y > this.TragetVec.y) {
            if (this.MyObjectTransform.position.y + temp < this.TragetVec.y) {
                this.MyObjectTransform.position.y = this.TragetVec.y;
            }
        }
    };
    C_MoveBot.prototype.saveMove = function (pos, stepSpeed) {
        // if(pos + (stepSpeed*2) <  )
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
    ////////////////////////////////////
    C_MoveBot.prototype.GetIsRun = function () {
        return this.isRun;
    };
    C_MoveBot.prototype.SetIsRun = function (wert) {
        this.isRun = wert;
    };
    return C_MoveBot;
}());
//# sourceMappingURL=MoveBot.js.map