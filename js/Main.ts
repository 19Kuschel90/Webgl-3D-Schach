window.addEventListener("load",function(){
	G_LoadShader();
});
var gl:any = null;
var gModal:any = null;
var gModal2: C_Modal;
var testtemp:any;
var gCamera:C_Camera;
var gCameraCtrl:C_CameraController;
var RLoop:any = null;
var gRLoop:C_RenderLoop;
var Resources:any = null;
var gCubes:C_Modal[] = [];
var gFigure:C_Modal[] = [];
var gInputManager:C_InputManager = new C_InputManager();
var { gShader, gVertex_shader, gFragment_shader }: { gShader: any; gVertex_shader: any; gFragment_shader: any; } = gShaderFunction();
var gRuls:C_ruls = new C_ruls();
		

function gShaderFunction() {
	var gShader: any = null;
	var gVertex_shader: any = "";
	var gFragment_shader: any = "";
	return { gShader, gVertex_shader, gFragment_shader };
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
	gCamera.transform.position.set(2.5, -2.5, 14.7);
	initShader();
	initFeld();
	Setfigure();
	gRLoop.start();	

	function initFeld():void {
		var cubemesh: any = Primatives.Cube.createMesh(gl, "Cube", 1, 1, 1, 0, 0, 0, false);
		for (var i = 0; i < 64; i++) {
			var model: C_Modal = new C_Modal(cubemesh ).setPosition((i % 8), 0.0, -Math.floor(i / 8));
			model.SetState("feld");
			gCubes.push(model);
		}
		givePosition();

		// A1 A2 B1 B2 ....
		function givePosition():void {
			var temp = 0;
			for (var X: number = 1; X <= 8; X++) {
				for (var Y: number = 1; Y <= 8; Y++) {
					(<C_GameObject>gCubes[temp]).SetFeld(X, Y);
					temp++;
				}
			}
		}
	}

	function Setfigure():void
	{
		var IDs:number = 0;
		var cubemesh: any = Primatives.Cube.createMesh(gl, "Cube", 1, 1, 1, 0, 0, 0, false);
		for (var i = 0; i < 16; i++) {
			IDs++;
			var model: C_Modal;
			if(i > 7 && i < 16)
			{
			model	 = new C_Modal( ObjLoader.domToMesh("objCube","obj_fileBauer",true)  ).setPosition((i % 8), -1.0, -Math.floor(i / 8));
			model.SetID(IDs);				
			model.setScale(0.2,0.2,0.2);
			model.setRotation(180.0,0.0,0.0);
			model.SetState("BB");				
		}
		else{
			model	 = new C_Modal( ObjLoader.domToMesh("objCube","obj_file",true)  ).setPosition((i % 8), -1.0, -Math.floor(i / 8));
			model.SetState("BtooDo");				
			model.SetID(IDs);				
			model.setScale(0.2,0.2,0.2);
		}
		gRuls.SetOnfeld(model.GetState(),Number(model.GetID()),i % 8, Math.floor(i / 8 ));
		gInputManager.setOptionsInHtml(String(model.GetID()),model.GetState());
			gFigure.push(model);
		}
		for (var i = 48; i < 64; i++) {
			IDs++;
			var model: C_Modal;
			if(i < 56)
			{
				model = new C_Modal( ObjLoader.domToMesh("objCube","obj_fileBauer",true)  ).setPosition((i % 8), -1.0, -Math.floor(i / 8));
				model.SetState("WB");				
				model.SetID(IDs);				
				model.setRotation(180.0,0.0,0.0);
				model.setScale(0.2,0.2,0.2);
			}else{
				model = new C_Modal( ObjLoader.domToMesh("objCube","obj_file",true)  ).setPosition((i % 8), -1.0, -Math.floor(i / 8));
			model.SetState("WtooDo");				
			model.setScale(0.2,0.2,0.2);
			model.SetID(IDs);				
		}
		gRuls.SetOnfeld(model.GetState(),Number(model.GetID()),i % 8, -Math.floor(i / 8 ));
		gInputManager.setOptionsInHtml(String(model.GetID()),model.GetState());		
			gFigure.push(model);
		}
		// gModal2 = new C_Modal( ObjLoader.domToMesh("objCube","obj_file",true) )
		// gModal2.setPosition(0,0,0).
	}

	 function initShader():void {
		gShader = new C_ShaderBuilder(gl, gVertex_shader, gFragment_shader)
			.prepareUniforms("uPMatrix", "mat4", "uMVMatrix", "mat4", "uCameraMatrix", "mat4", "uFaces", "2fv", "ublackWite", "fv")
			.prepareTextures("uAltas", "atlas")
			.setUniforms("uPMatrix", gCamera.projectionMatrix);
	}

}
//#endregion

//#region Render Loop 
function onRender(dt:number):void{
	update();
		gl.fClear();
		gCamera.updateViewMatrix();
		gShader.preRender("uCameraMatrix",gCamera.viewMatrix);
		for(var i:number=0; i < gCubes.length; i++){	
				 gShader.setUniforms("ublackWite", (<C_GameObject>gCubes[i]).GetFeldcolor() ).renderModel( gCubes[i].preRender() );		
			}
			for(var i:number=0; i < gFigure.length /2; i++){
				gShader.setUniforms("ublackWite", 0.4).renderModel( gFigure[i].preRender() );		
			}
			for(var i:number=gFigure.length/2; i < gFigure.length ; i++){
				if(gFigure[i].GetState() == "B")
				{
					gShader.setUniforms("ublackWite", 0.0).renderModel( gFigure[i].preRender() );		

				}else{

					gShader.setUniforms("ublackWite", 0.8).renderModel( gFigure[i].preRender() );		
				}
			}
			// gShader.setUniforms("ublackWite", 0).renderModal( gFigure[0].preRender() );
			//gShader.setUniforms("ublackWite", 0.5).renderModel( gModal2.preRender() );
		}
//#endregion

function update():void {
	
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
	G_LoadShader();
}

function StopRenderLoop()
{
	gRLoop.stop();
}

function StartRenderLoop()
{
	console.log("hi");
	gInputManager.yourCommand();
	// gRLoop.start();// too do
}