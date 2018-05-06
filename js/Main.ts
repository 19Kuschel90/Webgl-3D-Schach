window.addEventListener("load",function(){
	G_LoadShader();
});

(<HTMLSelectElement>document.getElementById("PlayerSelect")).addEventListener("change", ()=>{
	var temp =	(<HTMLSelectElement>document.getElementById("PlayerSelect")).value;
	gFigure[Number(oldSelection)].restColor();
	console.log(temp);
	oldSelection = temp;
	gFigure[Number(temp)].SetSelctionColor();
	gRuls.iCanMove(gFigure[Number(temp)]);
	
});

var oldSelection:string = "0";// tooDo
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
var gFigure:C_GameObject[] = [];
var gInputManager:C_InputManager = new C_InputManager();
var skyShader:string[] = [];
var { gShader, gVertex_shader, gFragment_shader }: { gShader: any; gVertex_shader: any; gFragment_shader: any; } = gShaderFunction();
var gRuls:C_ruls = new C_ruls();
var gSkymap:C_Modal;
var gSkyMapShader:SkymapShader;
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
	// gl.fLoadTexture("tex001",document.getElementById("imgTex"));
	
	gl.fLoadCubeMap("skybox01",[
		document.getElementById("cube01_right"),document.getElementById("cube01_left"),
		document.getElementById("cube01_top"),document.getElementById("cube01_bottom"),
		document.getElementById("cube01_back"),document.getElementById("cube01_front")
	]);

	gl.fLoadCubeMap("skybox02",[
		document.getElementById("cube02_right"),document.getElementById("cube02_left"),
		document.getElementById("cube02_top"),document.getElementById("cube02_bottom"),
		document.getElementById("cube02_back"),document.getElementById("cube02_front")
	]);
	//....................................
	//Setup Test Shader, Modal, Meshes
	// gShader = new TestShader(gl,gCamera.projectionMatrix);
		// .setTexture(gl.mTextureCache["tex001"]);
		gSkymap = new C_Modal(Primatives.Cube.createMesh(gl,"Skymap",10,10,10,0,0,0));
	gSkyMapShader = new SkymapShader(gl,gCamera.projectionMatrix
		,gl.mTextureCache["skybox01"]
		,gl.mTextureCache["skybox02"]
	);
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
			var model: C_GameObject = new C_GameObject(cubemesh ).setPosition((i % 8), 0.0, -Math.floor(i / 8));
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
			var model: C_GameObject;
			if(i > 7 && i < 16)
			{
			model	 = new C_GameObject( ObjLoader.domToMesh("objCube","obj_fileBauer",true)  ).setPosition((i % 8), -1.0, -Math.floor(i / 8));
			model.SetID(IDs);				
			model.setScale(0.2,0.2,0.2);
			model.setRotation(180.0,0.0,0.0);
			model.SetState("BB");				
		}
		else{
			model	 = new C_GameObject( ObjLoader.domToMesh("objCube","obj_file",true)  ).setPosition((i % 8), -1.0, -Math.floor(i / 8));
			model.SetState("BtooDo");				
			model.SetID(IDs);				
			model.setScale(0.2,0.2,0.2);
		}
		gRuls.SetOnfeld(model.GetState(),Number(model.GetID()),i % 8, Math.floor(i / 8 ));
		model.SetFeld(i % 8+1, Math.floor(i / 8 ));
		gInputManager.setOptionsInHtml(String(model.GetID()),model.GetState());
		(<C_GameObject> model).setColor(0.2);
		gFigure.push(model);
		}
		for (var i = 48; i < 64; i++) {
			IDs++;
			var model: C_GameObject;
			if(i < 56)
			{
				model = new C_GameObject( ObjLoader.domToMesh("objCube","obj_fileBauer",true)  ).setPosition((i % 8), -1.0, -Math.floor(i / 8));
				model.SetState("WB");				
				model.SetID(IDs);				
				model.setRotation(180.0,0.0,0.0);
				model.setScale(0.2,0.2,0.2);
			}else{
				model = new C_GameObject( ObjLoader.domToMesh("objCube","obj_file",true)  ).setPosition((i % 8), -1.0, -Math.floor(i / 8));
			model.SetState("WtooDo");				
			model.setScale(0.2,0.2,0.2);
			model.SetID(IDs);				
		}
		gRuls.SetOnfeld(model.GetState(),Number(model.GetID()),i % 8, Math.floor(i / 8 ));
		gInputManager.setOptionsInHtml(String(model.GetID()),model.GetState());		
		model.SetFeld(i % 8 +1, Math.floor(i / 8 ));		
		(<C_GameObject> model).setColor(0.8);
			gFigure.push(model);
		}
		console.log(gFigure);
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
function onRender(dt:number):void
{
	update();
	gCamera.updateViewMatrix();
		gl.fClear();
		
		gSkyMapShader.activate().preRender()
		.setCameraMatrix(gCamera.getTranslatelessMatrix())
		.setTime(performance.now())
		.renderModal(gSkymap);
		gShader.activate().preRender("uCameraMatrix",gCamera.viewMatrix);
		for(var i:number=0; i < gCubes.length; i++){	
			gShader
			.setUniforms("ublackWite", (<C_GameObject>gCubes[i]).GetFeldcolor() )
			.renderModel( gCubes[i].preRender() );		
		}
		for(var i:number= 0; i < gFigure.length ; i++){
			
			gShader
			.setUniforms("ublackWite", gFigure[i].GetColor())
			.renderModel( gFigure[i].preRender() );		
		}


		}

			// gShader.setUniforms("ublackWite", 0).renderModal( gFigure[0].preRender() );
			//gShader.setUniforms("ublackWite", 0.5).renderModel( gModal2.preRender() );
		
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