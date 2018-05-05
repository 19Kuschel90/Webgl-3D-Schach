"use strict";
window.addEventListener("load", function () {
    G_LoadShader();
});
document.getElementById("PlayerSelect").addEventListener("change", function () {
    var temp = document.getElementById("PlayerSelect").value;
    gFigure[Number(oldSelection)].restColor();
    console.log(temp);
    oldSelection = temp;
    gFigure[Number(temp)].SetSelctionColor();
    console.log(gFigure);
});
var oldSelection = "0"; // tooDo
var gl = null;
var gModal = null;
var gModal2;
var testtemp;
var gCamera;
var gCameraCtrl;
var RLoop = null;
var gRLoop;
var Resources = null;
var gCubes = [];
var gFigure = [];
var gInputManager = new C_InputManager();
var _a = gShaderFunction(), gShader = _a.gShader, gVertex_shader = _a.gVertex_shader, gFragment_shader = _a.gFragment_shader;
var gRuls = new C_ruls();
function gShaderFunction() {
    var gShader = null;
    var gVertex_shader = "";
    var gFragment_shader = "";
    return { gShader: gShader, gVertex_shader: gVertex_shader, gFragment_shader: gFragment_shader };
}
//#region init webgl
function main(VS, FS) {
    gVertex_shader = VS;
    gFragment_shader = FS;
    // init webgl2
    gl = GLInstance("webglCanvas").fFitScreen(0.95, 0.9).fClear();
    gCamera = new C_Camera(gl);
    gCamera.transform.rotation.set(90, 0, 0);
    gCameraCtrl = new C_CameraController(gl, gCamera);
    gRLoop = new C_RenderLoop(onRender, 30);
    C_Resources.setup(gl, onReady).loadTexture("atlas", gInputManager.atlasLink).start();
}
//#endregion
//#region Load Objects
function onReady() {
    gCamera.transform.position.set(2.5, -2.5, 14.7);
    initShader();
    initFeld();
    Setfigure();
    gRLoop.start();
    function initFeld() {
        var cubemesh = Primatives.Cube.createMesh(gl, "Cube", 1, 1, 1, 0, 0, 0, false);
        for (var i = 0; i < 64; i++) {
            var model = new C_Modal(cubemesh).setPosition((i % 8), 0.0, -Math.floor(i / 8));
            model.SetState("feld");
            gCubes.push(model);
        }
        givePosition();
        // A1 A2 B1 B2 ....
        function givePosition() {
            var temp = 0;
            for (var X = 1; X <= 8; X++) {
                for (var Y = 1; Y <= 8; Y++) {
                    gCubes[temp].SetFeld(X, Y);
                    temp++;
                }
            }
        }
    }
    function Setfigure() {
        var IDs = 0;
        var cubemesh = Primatives.Cube.createMesh(gl, "Cube", 1, 1, 1, 0, 0, 0, false);
        for (var i = 0; i < 16; i++) {
            IDs++;
            var model;
            if (i > 7 && i < 16) {
                model = new C_Modal(ObjLoader.domToMesh("objCube", "obj_fileBauer", true)).setPosition((i % 8), -1.0, -Math.floor(i / 8));
                model.SetID(IDs);
                model.setScale(0.2, 0.2, 0.2);
                model.setRotation(180.0, 0.0, 0.0);
                model.SetState("BB");
            }
            else {
                model = new C_Modal(ObjLoader.domToMesh("objCube", "obj_file", true)).setPosition((i % 8), -1.0, -Math.floor(i / 8));
                model.SetState("BtooDo");
                model.SetID(IDs);
                model.setScale(0.2, 0.2, 0.2);
            }
            gRuls.SetOnfeld(model.GetState(), Number(model.GetID()), i % 8, Math.floor(i / 8));
            gInputManager.setOptionsInHtml(String(model.GetID()), model.GetState());
            model.setColor(0.2);
            gFigure.push(model);
        }
        for (var i = 48; i < 64; i++) {
            IDs++;
            var model;
            if (i < 56) {
                model = new C_Modal(ObjLoader.domToMesh("objCube", "obj_fileBauer", true)).setPosition((i % 8), -1.0, -Math.floor(i / 8));
                model.SetState("WB");
                model.SetID(IDs);
                model.setRotation(180.0, 0.0, 0.0);
                model.setScale(0.2, 0.2, 0.2);
            }
            else {
                model = new C_Modal(ObjLoader.domToMesh("objCube", "obj_file", true)).setPosition((i % 8), -1.0, -Math.floor(i / 8));
                model.SetState("WtooDo");
                model.setScale(0.2, 0.2, 0.2);
                model.SetID(IDs);
            }
            gRuls.SetOnfeld(model.GetState(), Number(model.GetID()), i % 8, -Math.floor(i / 8));
            gInputManager.setOptionsInHtml(String(model.GetID()), model.GetState());
            model.setColor(0.8);
            gFigure.push(model);
        }
        console.log(gFigure);
        // gModal2 = new C_Modal( ObjLoader.domToMesh("objCube","obj_file",true) )
        // gModal2.setPosition(0,0,0).
    }
    function initShader() {
        gShader = new C_ShaderBuilder(gl, gVertex_shader, gFragment_shader)
            .prepareUniforms("uPMatrix", "mat4", "uMVMatrix", "mat4", "uCameraMatrix", "mat4", "uFaces", "2fv", "ublackWite", "fv")
            .prepareTextures("uAltas", "atlas")
            .setUniforms("uPMatrix", gCamera.projectionMatrix);
    }
}
//#endregion
//#region Render Loop 
function onRender(dt) {
    update();
    gl.fClear();
    gCamera.updateViewMatrix();
    gShader.preRender("uCameraMatrix", gCamera.viewMatrix);
    for (var i = 0; i < gCubes.length; i++) {
        gShader.setUniforms("ublackWite", gCubes[i].GetFeldcolor()).renderModel(gCubes[i].preRender());
    }
    for (var i = 0; i < gFigure.length; i++) {
        gShader.setUniforms("ublackWite", gFigure[i].GetColor()).renderModel(gFigure[i].preRender());
    }
}
// gShader.setUniforms("ublackWite", 0).renderModal( gFigure[0].preRender() );
//gShader.setUniforms("ublackWite", 0.5).renderModel( gModal2.preRender() );
//#endregion
function update() {
}
//#region Shutdown
function Shutdown() {
    gl = null;
    gModal = null;
    gCamera.rest();
    gCameraCtrl.rest();
    gShader = null;
    RLoop = null;
    gRLoop.rest();
    C_Resources.rest();
    gCubes = [];
    // we not need to null
    //  gVertex_shader = null;
    //  gFragment_shader = null;
}
//#endregion
function NewStart() {
    Shutdown();
    gInputManager.update();
    gRLoop.stop();
    // G_LoadShader();
    G_LoadShader();
}
function StopRenderLoop() {
    gRLoop.stop();
}
function StartRenderLoop() {
    console.log("hi");
    gInputManager.yourCommand();
    // gRLoop.start();// too do
}
//# sourceMappingURL=Main.js.map