"use strict";
window.addEventListener("load", function () {
    G_LoadShader();
});
var gl = null;
var gModal = null;
var gCamera;
var gCameraCtrl;
var gShader = null;
var gGridShader = null;
var gGridModal = null;
var RLoop = null;
var gRLoop;
var Resources = null;
var gCubes = [];
var gInputManager = new C_InputManager();
var gVertex_shader;
var gFragment_shader;
var uPositonX = 0;
var uPositonY = 0;
var temp = 15;
var NewLine = 0;
var moveBot = [];
function main(vertex_shader, fragment_shader) {
    gVertex_shader = vertex_shader;
    gFragment_shader = fragment_shader;
    // init webgl2
    gl = GLInstance("webglCanvas").fFitScreen(0.95, 0.9).fClear();
    gCamera = new C_Camera(gl);
    gCamera.transform.rotation.set(90, 0, 0);
    gCameraCtrl = new C_CameraController(gl, gCamera);
    gRLoop = new C_RenderLoop(onRender, 30);
    C_Resources.setup(gl, onReady).loadTexture("atlas", gInputManager.atlasLink).start();
}
function onReady() {
    gShader = new C_ShaderBuilder(gl, gVertex_shader, gFragment_shader)
        .prepareUniforms("uPMatrix", "mat4", "uMVMatrix", "mat4", "uCameraMatrix", "mat4", "uFaces", "2fv", "uPositonX", "fv", "uPositonY", "fv")
        .prepareTextures("uAltas", "atlas")
        .setUniforms("uPMatrix", gCamera.projectionMatrix);
    var cubemesh = Primatives.Cube.createMesh(gl, "Cube", 1, 1, 1, 0, 0, 0, false);
    gCamera.transform.position.set(7.5, -7.5, 14.7);
    for (var i = 0; i < 256; i++) {
        var model = new C_Modal(cubemesh).setPosition((i % 16), 0.0, -Math.floor(i / 16));
        gCubes.push(model);
        moveBot.push(new C_MoveBot(model.transform, model.transform.position));
        moveBot[i].SetPosition(new C_Vector3(gInputManager.startPos.x, gInputManager.startPos.y, gInputManager.startPos.z));
        moveBot[i].SetSpeed(1.0);
    }
    gRLoop.start();
}
function onRender(dt) {
    gl.fClear();
    gCamera.updateViewMatrix();
    gShader.preRender("uCameraMatrix", gCamera.viewMatrix);
    uPositonX = 0;
    uPositonY = 0;
    temp = 15;
    for (var i = 0; i < gCubes.length; i++) {
        gShader.setUniforms("uPositonX", uPositonX).setUniforms("uPositonY", uPositonY).renderModel(gCubes[i].preRender());
        SetPositioninTexture(i);
        if (moveBot[i].GetIsRun() == true && NewLine == i) {
            moveBot[i].Update();
            if (moveBot[i].GetIsRun() == false) {
                NewLine++;
            }
        }
    }
}
function SetPositioninTexture(i) {
    if (i >= temp) {
        temp += 16;
        uPositonY++;
        uPositonX = 0;
    }
    else {
        uPositonX++;
    }
}
function Shutdown() {
    gl = null;
    gModal = null;
    gCamera.rest();
    gCameraCtrl.rest();
    gShader = null;
    gGridShader = null;
    gGridModal = null;
    RLoop = null;
    gRLoop.rest();
    C_Resources.rest();
    gCubes = [];
    NewLine = 0;
    gVertex_shader = null;
    gFragment_shader = null;
    uPositonX = 0;
    uPositonY = 0;
    temp = 15;
    moveBot = [];
}
function NewStart() {
    Shutdown();
    gInputManager.update();
    gRLoop.stop();
    G_LoadShader();
}
function StopRenderLoop() {
    gRLoop.stop();
}
function StartRenderLoop() {
    gRLoop.start();
}
//# sourceMappingURL=Main.js.map