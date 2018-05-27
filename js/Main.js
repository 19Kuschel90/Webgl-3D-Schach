"use strict";
window.addEventListener("load", function () {
    G_LoadShader();
});
var gSelected;
document.getElementById("PlayerSelect").addEventListener("change", () => {
    gSelected = document.getElementById("PlayerSelect").value;
    gFigure[Number(oldSelection)].restColor();
    oldSelection = gSelected;
    gFigure[Number(gSelected)].SetSelctionColor();
    gRuls.iCanMove(gFigure[Number(gSelected)]);
});
function PlayerMove() {
    gRuls.isMoveOK(gFigure[Number(gSelected)].GetFeldNumber(), gFigure[Number(gSelected)], document.getElementById("PlayerCanMove").value);
    gInputManager.removeOldMoveOptions();
    gFigure[Number(oldSelection)].restColor();
}
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
var gCubes = [
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""]
];
var gFigure = [];
var gInputManager = new C_InputManager();
var skyShader = [];
var { gShader, gVertex_shader, gFragment_shader } = gShaderFunction();
var gRuls = new C_ruls();
// var gSkymap:C_Modal;
var gSkymap;
var mDebug;
function gShaderFunction() {
    var gShader = null;
    var gVertex_shader = "";
    var gFragment_shader = "";
    return { gShader, gVertex_shader, gFragment_shader };
}
//#region init webgl
function main(VS, FS) {
    gVertex_shader = VS;
    gFragment_shader = FS;
    // init webgl2
    gl = GLInstance("webglCanvas").fFitScreen(0.95, 0.9).fClear();
    gCamera = new C_Camera(gl);
    gCamera.transform.position.set(2.5, 0, 14.7);
    gCamera.transform.rotation.set(-40, -30, 0);
    gCameraCtrl = new C_CameraController(gl, gCamera);
    gl.fLoadTexture("tex001", document.getElementById("imgTex"));
    gl.fLoadTexture("tex002", document.getElementById("imgTex1"));
    gl.fLoadTexture("tex003", document.getElementById("imgTex2"));
    gl.fLoadTexture("tex004", document.getElementById("imgTex3"));
    gl.fLoadTexture("tex005", document.getElementById("imgTex4"));
    // gl.fLoadCubeMap("skybox01",[
    // 	document.getElementById("cube01_right"),document.getElementById("cube01_left"),
    // 	document.getElementById("cube01_top"),document.getElementById("cube01_bottom"),
    // 	document.getElementById("cube01_back"),document.getElementById("cube01_front")
    // ]);
    // gl.fLoadCubeMap("skybox02",[
    // 	document.getElementById("cube02_right"),document.getElementById("cube02_left"),
    // 	document.getElementById("cube02_top"),document.getElementById("cube02_bottom"),
    // 	document.getElementById("cube02_back"),document.getElementById("cube02_front")
    // ]);
    //....................................
    //Setup Test Shader, Modal, Meshes
    // gShader = new TestShader(gl,gCamera.projectionMatrix);
    // .setTexture(gl.mTextureCache["tex001"]);
    gRLoop = new C_RenderLoop(onRender, 30);
    C_Resources.setup(gl, onReady).loadTexture("atlas", gInputManager.atlasLink).start();
}
//#endregion
//#region Load Objects
function onReady() {
    var cubemesh = Primatives.Cube.createMesh(gl, "Cube", 1, 1, 1, 0, 0, 0, false);
    initDebugger();
    initShader();
    initFeld();
    Setfigure();
    // gSkymap = new C_Modal(Primatives.Cube.createMesh(gl,"Skymap",100,100,100,0,0,0));
    gRLoop.start();
    function initFeld() {
        var i = 0;
        for (var X = 0; X < 8; X++) {
            for (var Y = 0; Y < 8; Y++) {
                var model = new C_GameObject(cubemesh).setPosition((i % 8), 0.0, -Math.floor(i / 8));
                i++;
                model.setColor(i % 2);
                model.SetFeld(X + 1, Y + 1);
                model.SetState("feld");
                gCubes[Y][X] = model;
            }
        }
    }
    function Setfigure() {
        var IDs = 0;
        for (var i = 0; i < 16; i++) {
            IDs++;
            var model;
            if (i > 7 && i < 16) {
                model = new C_GameObject(ObjLoader.domToMesh("objCube", "obj_fileBauer", true)).setPosition((i % 8), 1.0, -Math.floor(i / 8));
                model.SetID(IDs);
                model.setScale(0.2, 0.2, 0.2);
                model.SetState("BB");
            }
            else {
                model = new C_GameObject(ObjLoader.domToMesh("objCube", "obj_file", true)).setPosition((i % 8), 1.0, -Math.floor(i / 8));
                switch (i) {
                    case 0:
                        model.SetState("BT");
                        break;
                    case 2:
                        model.SetState("BL");
                        break;
                    case 5:
                        model.SetState("BL");
                        break;
                    case 7:
                        model.SetState("BT");
                        break;
                    default:
                        model.SetState("BtooDo");
                        break;
                }
                model.SetID(IDs);
                model.setScale(0.2, 0.2, 0.2);
            }
            gRuls.SetOnfeld(model.GetState(), Number(model.GetID()), i % 8, Math.floor(i / 8));
            model.SetFeld(i % 8 + 1, Math.floor(i / 8));
            gInputManager.setOptionsInHtml(String(model.GetID()), model.GetState());
            model.setColor(2);
            gFigure.push(model);
        }
        for (var i = 48; i < 64; i++) {
            IDs++;
            var model;
            if (i < 56) {
                model = new C_GameObject(ObjLoader.domToMesh("objCube", "obj_fileBauer", true)).setPosition((i % 8), 1.0, -Math.floor(i / 8));
                model.SetState("WB");
                model.SetID(IDs);
                // model.setRotation(180.0,0.0,0.0);
                model.setScale(0.2, 0.2, 0.2);
            }
            else {
                model = new C_GameObject(ObjLoader.domToMesh("objCube", "obj_file", true)).setPosition((i % 8), 1.0, -Math.floor(i / 8));
                switch (i) {
                    case 56:
                        model.SetState("BT");
                        break;
                    case 58:
                        model.SetState("BL");
                        break;
                    case 61:
                        model.SetState("BL");
                        break;
                    case 63:
                        model.SetState("BT");
                        break;
                    default:
                        model.SetState("BtooDo");
                        break;
                }
                model.setScale(0.2, 0.2, 0.2);
                model.SetID(IDs);
            }
            gRuls.SetOnfeld(model.GetState(), Number(model.GetID()), i % 8, Math.floor(i / 8));
            gInputManager.setOptionsInHtml(String(model.GetID()), model.GetState());
            model.SetFeld(i % 8 + 1, Math.floor(i / 8));
            model.setColor(3);
            gFigure.push(model);
        }
    }
    function initShader() {
        gSkymap = new Skymap(gl)
            .setDayTexByDom("cube01_right", "cube01_left", "cube01_top", "cube01_bottom", "cube01_back", "cube01_front")
            .setNightTexByDom("cube02_right", "cube02_left", "cube02_top", "cube02_bottom", "cube02_back", "cube02_front")
            .setTime(0.7).finalize();
        gShader = new TestShader(gl, gCamera.projectionMatrix)
            .setTexture(gl.mTextureCache["tex001"])
            .setTexture(gl.mTextureCache["tex002"])
            .setTexture(gl.mTextureCache["tex003"])
            .setTexture(gl.mTextureCache["tex004"])
            .setTexture(gl.mTextureCache["tex005"]);
    }
    function initDebugger() {
        mDebug = new VertexDebugger(gl, 10)
            .addColor("#ff0000")
            .addPoint(0, 0, 0, 0)
            .finalize();
    }
}
//#endregion
var radius = 5.5, //Radius from the center to rotate the light
angle = 0, //Main Angle var for Light
angleInc = 1, //How much to move per second
yPos = 0, //Current Position of light
yPosInc = 0.2; //How fast to move light vertically per secomd
//#region Render Loop 
function onRender(dt) {
    update();
    gCamera.updateViewMatrix();
    gl.fClear();
    //................................
    //Move the Light
    angle += angleInc * dt;
    yPos += yPosInc * dt;
    var x = radius * Math.cos(angle), z = radius * Math.sin(angle), y = C_MathUtil.Map(Math.sin(yPos), 0, 1, 5.1, 2);
    mDebug.transform.position.set(x, y, z);
    //................................
    //Draw Out models
    gSkymap
        .setTime(performance.now())
        .render(gCamera);
    gShader.activate().preRender()
        .setCameraMatrix(gCamera.viewMatrix)
        .setCameraPos(gCamera)
        .setLightPos(mDebug);
    //.renderModal( gModal.preRender() )
    // .renderModal( gModal2.preRender() );
    gShader.activate();
    for (var i = 0; i < gCubes.length; i++) {
        for (var X = 0; X < gCubes.length; X++) {
            gShader.preRender(gCubes[X][i].GetColor()).renderModal(gCubes[X][i].preRender());
        }
    }
    for (var i = 0; i < gFigure.length; i++) {
        gShader.preRender(gFigure[i].GetColor()).renderModal(gFigure[i].preRender());
    }
    mDebug.render(gCamera);
}
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
    // gInputManager.yourCommand();
    // gRLoop.start();// too do
}
//# sourceMappingURL=Main.js.map