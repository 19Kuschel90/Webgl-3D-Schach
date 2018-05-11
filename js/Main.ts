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
var gCubes:any[][] =  [
	["","","","","","","",""],
	["","","","","","","",""],
	["","","","","","","",""],
	["","","","","","","",""],
	["","","","","","","",""],
	["","","","","","","",""],
	["","","","","","","",""],
	["","","","","","","",""]];
var gFigure:C_GameObject[] = [];
var gInputManager:C_InputManager = new C_InputManager();
var skyShader:string[] = [];
var { gShader, gVertex_shader, gFragment_shader }: { gShader: any; gVertex_shader: any; gFragment_shader: any; } = gShaderFunction();
var gRuls:C_ruls = new C_ruls();
// var gSkymap:C_Modal;
var gSkymap:Skymap;
var mDebug:VertexDebugger;
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
	gCamera.transform.position.set(2.5, 0, 14.7);
	gCamera.transform.rotation.set(-40,-30,0);
	gCameraCtrl = new C_CameraController(gl,gCamera);
	gl.fLoadTexture("tex001",document.getElementById("imgTex"));
	gl.fLoadTexture("tex002",document.getElementById("imgTexBlack"));

	
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
	gRLoop = new C_RenderLoop(onRender,30);
	C_Resources.setup(gl,onReady).loadTexture("atlas",gInputManager.atlasLink).start();
	
}
//#endregion

//#region Load Objects
function onReady():void{
	var cubemesh: any = Primatives.Cube.createMesh(gl, "Cube", 1, 1, 1, 0, 0, 0, false);
	initShader();
	initFeld();
	Setfigure();
	// gSkymap = new C_Modal(Primatives.Cube.createMesh(gl,"Skymap",100,100,100,0,0,0));
	gSkymap = new Skymap(gl)
	.setDayTexByDom("cube01_right","cube01_left","cube01_top","cube01_bottom","cube01_back","cube01_front")
	.setNightTexByDom("cube02_right","cube02_left","cube02_top","cube02_bottom","cube02_back","cube02_front")
	.setTime(0.7).finalize();
	gShader = new TestShader(gl,gCamera.projectionMatrix)
	.setTexture2(gl.mTextureCache["tex002"])
	.setTexture(gl.mTextureCache["tex001"]);
	mDebug = new VertexDebugger(gl,10)
	.addColor("#ff0000")
	.addPoint(0,0,0,0)
	.finalize();
		gRLoop.start();	
		
		function initFeld():void {
			
			var i =0;
			for (var X: number = 0; X < 8; X++) {
				for (var Y: number = 0; Y < 8; Y++) {
					var model: C_GameObject = new C_GameObject(cubemesh ).setPosition((i % 8), 0.0, -Math.floor(i / 8));
					i++;
					model.setColor(i % 2);
					model.SetFeld(X+1,Y+1);
					model.SetState("feld");
					console.log(model.GetColor());
					gCubes[Y][X] = model;
				}
				
			}
 			}
		
		function Setfigure():void
		{
			var IDs:number = 0;
			for (var i = 0; i < 16; i++) {
				IDs++;
				var model: C_GameObject;
				if(i > 7 && i < 16)
				{
					model	 = new C_GameObject( ObjLoader.domToMesh("objCube","obj_fileBauer",true)  ).setPosition((i % 8), 1.0, -Math.floor(i / 8));
					model.SetID(IDs);				
					model.setScale(0.2,0.2,0.2);
					model.SetState("BB");				
				}
				else{
					model	 = new C_GameObject( ObjLoader.domToMesh("objCube","obj_file",true)  ).setPosition((i % 8), 1.0, -Math.floor(i / 8));
					model.SetState("BtooDo");				
					model.SetID(IDs);				
					model.setScale(0.2,0.2,0.2);
				}
				gRuls.SetOnfeld(model.GetState(),Number(model.GetID()),i % 8, Math.floor(i / 8 ));
				model.SetFeld(i % 8+1, Math.floor(i / 8 ));
				gInputManager.setOptionsInHtml(String(model.GetID()),model.GetState());
				(<C_GameObject> model).setColor(1.0);
				gFigure.push(model);
			}
			for (var i = 48; i < 64; i++) {
				IDs++;
				var model: C_GameObject;
				if(i < 56)
				{
					model = new C_GameObject( ObjLoader.domToMesh("objCube","obj_fileBauer",true)  ).setPosition((i % 8), 1.0, -Math.floor(i / 8));
					model.SetState("WB");				
					model.SetID(IDs);				
					// model.setRotation(180.0,0.0,0.0);
					model.setScale(0.2,0.2,0.2);
				}else{
					model = new C_GameObject( ObjLoader.domToMesh("objCube","obj_file",true)  ).setPosition((i % 8), 1.0, -Math.floor(i / 8));
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
			// gModal2 = new C_Modal( ObjLoader.domToMesh("objCube","obj_file",true) )
			// gModal2.setPosition(0,0,0).
		}
		
		function initShader():void {
			// gShader = new C_ShaderBuilder(gl, gVertex_shader, gFragment_shader)
			// .prepareUniforms("uPMatrix", "mat4", "uMVMatrix", "mat4", "uCameraMatrix", "mat4", "uFaces", "2fv", "ublackWite", "fv")
			// .prepareTextures("uAltas", "atlas")
			// .setUniforms("uPMatrix", gCamera.projectionMatrix);
		}
		
	}
	//#endregion

	var radius = 1.5,		//Radius from the center to rotate the light
	angle = 0,			//Main Angle var for Light
	angleInc = 1,		//How much to move per second
	yPos = 0,			//Current Position of light
	yPosInc = 0.2;		//How fast to move light vertically per secomd


	
	//#region Render Loop 
	function onRender(dt:number):void
	{
		update();
		gCamera.updateViewMatrix();
		gl.fClear();
		
				//................................
				//Move the Light
				angle += angleInc * dt;
				yPos += yPosInc * dt;

				var x = radius * Math.cos(angle),
					z = radius * Math.sin(angle),
					y = C_MathUtil.Map(Math.sin(yPos),-1,1,5.1,2);
				mDebug.transform.position.set(x,y,z);
			//................................
				//Draw Out models
				gSkymap.render(gCamera);
				gShader.activate().preRender()
					.setCameraMatrix(gCamera.viewMatrix)
					.setCameraPos(gCamera)
					.setLightPos(mDebug)
					//.renderModal( gModal.preRender() )
					// .renderModal( gModal2.preRender() );

		gShader.activate();
		for(var i:number=0; i < gCubes.length; i++){	
			for(var X:number=0; X < gCubes.length; X++){
				gShader.preRender( (<C_GameObject>gCubes[X][i]).GetColor()).renderModal( gCubes[X][i].preRender() );
				// .setUniforms("ublackWite", (<C_GameObject>gCubes[X][i]).GetColor() )
				// .renderModel( gCubes[X][i].preRender() );
			}
		}
		for(var i:number= 0; i < gFigure.length ; i++){
			
			gShader.renderModal( gFigure[i].preRender() );
			// .setUniforms("ublackWite", gFigure[i].GetColor())
			// .renderModel( gFigure[i].preRender() );		
		}

		mDebug.render(gCamera);

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
	gInputManager.yourCommand();
	// gRLoop.start();// too do
}