window.addEventListener("load",function(){
	G_LoadShader();
});
var gl:any = null;
var gModal:any = null;
var gCamera:C_Camera;
var gCameraCtrl:C_CameraController;
var RLoop:any = null;
var gRLoop:C_RenderLoop;
var Resources:any = null;
var gCubes:C_Modal[] = [];
var gInputManager:C_InputManager = new C_InputManager();
var { gShader, gVertex_shader, gFragment_shader }: { gShader: any; gVertex_shader: any; gFragment_shader: any; } = gShaderFunction();
		
var moveBot:C_MoveBot[] = [];
		
var { uPositonX, uPositonY, temp, NewLine }: { uPositonX: number; uPositonY: number; temp: number; NewLine: number; } = BotHelperNumbers();

function gShaderFunction() {
	var gShader: any = null;
	var gVertex_shader: any = "";
	var gFragment_shader: any = "";
	return { gShader, gVertex_shader, gFragment_shader };
}

function BotHelperNumbers() {
	var uPositonX: number = 0;
	var uPositonY: number = 0;
	var temp: number = 15;
	var NewLine: number = 0;
	return { uPositonX, uPositonY, temp, NewLine };
}

//#region init webgl
function main(VS:string,FS:string):void
{
	gVertex_shader = VS;
	gFragment_shader = FS;
	// init webgl2
	gl = GLInstance("webglCanvas").fFitScreen(0.95,0.9).fClear();
	gCamera = new C_Camera(gl);
	gCamera.transform.rotation.set(90,0,0);
	gCameraCtrl = new C_CameraController(gl,gCamera);
	gRLoop = new C_RenderLoop(onRender,30);
	C_Resources.setup(gl,onReady).loadTexture("atlas",gInputManager.atlasLink).start();
}
//#endregion

//#region Load Objects
function onReady():void{
	initShader();
	initCubs();
	gRLoop.start();	

	function initCubs() {
		var cubemesh: any = Primatives.Cube.createMesh(gl, "Cube", 1, 1, 1, 0, 0, 0, false);
		gCamera.transform.position.set(7.5, -7.5, 14.7);
		for (var i = 0; i < 64; i++) {
			var model: C_Modal = new C_Modal(cubemesh).setPosition((i % 8), 0.0, -Math.floor(i / 8));
			gCubes.push(model);
			moveBot.push(new C_MoveBot(model.transform, model.transform.position));
			moveBot[i].SetPosition(new C_Vector3(gInputManager.startPos.x, gInputManager.startPos.y, gInputManager.startPos.z));
			moveBot[i].SetSpeed(1.0);
		}
	}

	
	 function initShader() {
		gShader = new C_ShaderBuilder(gl, gVertex_shader, gFragment_shader)
			.prepareUniforms("uPMatrix", "mat4", "uMVMatrix", "mat4", "uCameraMatrix", "mat4", "uFaces", "2fv", "uPositonX", "fv", "uPositonY", "fv")
			.prepareTextures("uAltas", "atlas")
			.setUniforms("uPMatrix", gCamera.projectionMatrix);
	}

}
//#endregion

//#region Render Loop 
function onRender(dt:number):void{
		gl.fClear();
		gCamera.updateViewMatrix();
		gShader.preRender("uCameraMatrix",gCamera.viewMatrix);
		uPositonX = 0;
		uPositonY = 0;
		temp = 15;
		for(var i:number=0; i < gCubes.length; i++){
			gShader.setUniforms("uPositonX",uPositonX).setUniforms("uPositonY",uPositonY).renderModel( gCubes[i].preRender() );
			SetPositioninTexture(i);
			if(moveBot[i].GetIsRun() == true &&NewLine == i)
			{
				moveBot[i].Update();
				if(moveBot[i].GetIsRun() == false)
				{
					NewLine++;
				}
			}
		}
}
//#endregion

function SetPositioninTexture(i:number):void{
	if(i >= temp)
	{
		temp += 16;
		uPositonY++; 
		uPositonX = 0;
	}else
	{
		uPositonX++;
	}
}

//#region Shutdown
function Shutdown()
{
	 gl = null;
	  gModal = null;
 gCamera.rest();
 gCameraCtrl.rest();
 gShader = null;
 RLoop = null;
 gRLoop.rest();
 C_Resources.rest();
 gCubes = [];
 NewLine = 0;
 
 uPositonX = 0;
 uPositonY = 0;
 temp = 15;
 moveBot = [];
 // we not need to null
 //  gVertex_shader = null;
 //  gFragment_shader = null;
}
//#endregion

function NewStart()
{
	Shutdown();
	gInputManager.update();
	gRLoop.stop();	
	// G_LoadShader();
	main();
}

function StopRenderLoop()
{
	gRLoop.stop();
}

function StartRenderLoop()
{
	gRLoop.start();
}