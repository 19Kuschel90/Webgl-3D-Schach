"use strict";
var C_Modal = /** @class */ (function () {
    function C_Modal(meshData) {
        this.transform = new C_Transform();
        this.mesh = meshData;
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
}());
//# sourceMappingURL=Modal.js.map