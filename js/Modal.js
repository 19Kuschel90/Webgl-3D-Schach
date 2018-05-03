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
var C_Modal = /** @class */ (function (_super) {
    __extends(C_Modal, _super);
    function C_Modal(meshData, colord) {
        if (colord === void 0) { colord = 0; }
        var _this = _super.call(this) || this;
        _this.transform = new C_Transform();
        _this.mesh = meshData;
        return _this;
    }
    //--------------------------------------------------------------------------
    //Getters/Setters
    C_Modal.prototype.setScale = function (x, y, z) { this.transform.scale.set(x, y, z); return this; };
    C_Modal.prototype.setPosition = function (x, y, z) { this.transform.position.set(x, y, z); return this; };
    C_Modal.prototype.setRotation = function (x, y, z) { this.transform.rotation.set(x, y, z); return this; };
    C_Modal.prototype.addScale = function (x, y, z) { this.transform.scale.x += x; this.transform.scale.y += y; this.transform.scale.y += y; return this; };
    C_Modal.prototype.addPosition = function (x, y, z) { this.transform.position.x += x; this.transform.position.y += y; this.transform.position.z += z; return this; };
    C_Modal.prototype.addRotation = function (x, y, z) { this.transform.rotation.x += x; this.transform.rotation.y += y; this.transform.rotation.z += z; return this; };
    //--------------------------------------------------------------------------
    //Things to do before its time to render
    C_Modal.prototype.preRender = function () { this.transform.updateMatrix(); return this; };
    return C_Modal;
}(C_Feld));
//# sourceMappingURL=Modal.js.map