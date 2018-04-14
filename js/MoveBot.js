"use strict";
var C_MoveBot = /** @class */ (function () {
    function C_MoveBot(ObjectTransform, TragetVec, imRun) {
        if (ObjectTransform === void 0) { ObjectTransform = new C_Transform(); }
        if (TragetVec === void 0) { TragetVec = new C_Vector3(0, 0, 0); }
        if (imRun === void 0) { imRun = false; }
        this.TragetVec = new C_Vector3(0, 0, 0);
        this.MyObjectTransform = ObjectTransform;
        this.isRun = imRun;
    }
    C_MoveBot.prototype.Update = function () {
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