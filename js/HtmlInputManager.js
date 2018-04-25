"use strict";
var C_InputManager = /** @class */ (function () {
    function C_InputManager() {
        this.atlasLink = "../image/AiuiPlay_730x730.png";
        this.startPos = new C_Vector3(8, 15, -20);
        this.canvasSizeW = 600;
        this.canvasSizeH = 600;
    }
    C_InputManager.prototype.update = function () {
        this.startPos.x = Number(document.getElementById("SX").value);
        this.startPos.y = Number(document.getElementById("SY").value);
        this.startPos.z = Number(document.getElementById("SZ").value);
        this.canvasSizeW = Number(document.getElementById("canvasSizeW").value);
        this.canvasSizeH = Number(document.getElementById("canvasSizeH").value);
    };
    return C_InputManager;
}());
//# sourceMappingURL=HtmlInputManager.js.map