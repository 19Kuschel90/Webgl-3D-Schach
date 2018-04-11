"use strict";
window.addEventListener("load", function () {
    G_LoadShader();
});
var gl;
var gModal;
var gCamera;
var gCameraCtrl;
var gShader;
var gGridShader;
var gGridModal;
var RLoop;
var gGridFloor;
var gRLoop;
var Resources;
var gCubes = [];
var texMap = [
    [3, 0, 3, 0, 3, 0, 2, 0, 3, 0, 2, 9],
    [4, 1, 4, 1, 4, 1, 5, 1, 4, 1, 5, 1],
    [11, 1, 10, 1, 10, 1, 9, 1, 10, 1, 9, 1],
    [7, 7, 6, 7, 6, 7, 6, 7, 6, 7, 6, 6],
    [8, 8, 8, 8, 8, 8, 9, 8, 8, 8, 9, 8],
    [8, 0, 8, 0, 8, 0, 10, 0, 8, 0, 9, 0] //TNT
];
var gvertex_shader;
var gfragment_shader;
function main(vertex_shader, fragment_shader) {
    gvertex_shader = vertex_shader;
    gfragment_shader = fragment_shader;
    //....................................
    //System Setup
    gl = GLInstance("webglCanvas").fFitScreen(0.95, 0.9).fClear();
    gCamera = new C_Camera(gl);
    gCamera.transform.position.set(0, 1, 3);
    gCameraCtrl = new C_CameraController(gl, gCamera);
    gGridFloor = new C_GridFloor(gl);
    gRLoop = new C_RenderLoop(onRender, 30);
    //....................................
    //Load up resources
    C_Resources.setup(gl, onReady).loadTexture("atlas", "../image/atlas_mindcraft.png").start();
}
//==================================================
//When Main System is setup and all resources are downloaded.
function onReady() {
    console.log("onReady()");
    //Setup Test Shader, Modal, Meshes
    gShader = new C_ShaderBuilder(gl, gvertex_shader, gfragment_shader)
        .prepareUniforms("uPMatrix", "mat4", "uMVMatrix", "mat4", "uCameraMatrix", "mat4", "uFaces", "2fv")
        .prepareTextures("uAltas", "atlas")
        .setUniforms("uPMatrix", gCamera.projectionMatrix);
    //gModel = Primatives.Cube.createModal(gl,"Cube",true)
    //		.setPosition(0,0.6,0);//.setScale(0.7,0.7,0.7);
    var cubemesh = Primatives.Cube.createMesh(gl, "Cube", 1, 1, 1, 0, 0, 0, false);
    for (var i = 0; i < 6; i++) {
        var model = new C_Modal(cubemesh).setPosition((i % 3) * 2, 0.6, Math.floor(i / 3) * -2);
        gCubes.push(model);
    }
    //....................................
    gRLoop.start();
    //onRender(0);
}
function onRender(dt) {
    // console.log("run");
    //................................
    //Main Elements to draw to the frame
    gl.fClear();
    gCamera.updateViewMatrix();
    gGridFloor.render(gCamera);
    //................................
    //Draw Out models
    gShader.preRender("uCameraMatrix", gCamera.viewMatrix);
    //.renderModel(gModel.preRender(),false);
    // console.log(gCubes);
    for (var i = 0; i < gCubes.length; i++) {
        gShader.setUniforms("uFaces", texMap[i]).renderModel(gCubes[i].preRender());
    }
}
//# sourceMappingURL=Main.js.map