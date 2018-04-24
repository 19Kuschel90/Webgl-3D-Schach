window.addEventListener("load",function(){
    G_LoadShader();
});
var gl:any = null;
var gModal:any = null;
var gCamera:C_Camera;
var gCameraCtrl:C_CameraController;
var gShader:any = null;
var gGridShader:any = null;
var gGridModal:any = null;
var RLoop:any = null;
var gRLoop:C_RenderLoop;
var Resources:any = null;
var gCubes:C_Modal[] = [];
var gInputManager:C_InputManager = new C_InputManager();
var gVertex_shader:any;
var gFragment_shader:any;

var uPositonX:number = 0;
var uPositonY:number = 0;
var temp:number = 15;
var moveBot:C_MoveBot[] = [];


function main(vertex_shader:string,fragment_shader:string):void
{
	gVertex_shader = vertex_shader;
	gFragment_shader = fragment_shader;
	//....................................
	//System Setup
	gl = GLInstance("webglCanvas").fFitScreen(0.95,0.9).fClear();
	
	gCamera = new C_Camera(gl);
	gCamera.transform.rotation.set(90,0,0);
	gCameraCtrl = new C_CameraController(gl,gCamera);
	
	gRLoop = new C_RenderLoop(onRender,30);
	
	//....................................
	//Load up resources team-liquid-logo-blue-ocean.jpg
	//		C_Resources.setup(gl,onReady).loadTexture("atlas","../image/Pony.png").start();
	C_Resources.setup(gl,onReady).loadTexture("atlas",gInputManager.atlasLink).start();
	//	C_Resources.setup(gl,onReady).loadTexture("atlas","../image/team-liquid-logo-blue-ocean.jpg").start();
	//	C_Resources.setup(gl,onReady).loadTexture("atlas","../image/atlas_mindcraft.png").start();
}

function onReady():void{
	
	gShader = new C_ShaderBuilder(gl,gVertex_shader,gFragment_shader)
	.prepareUniforms("uPMatrix","mat4"
	,"uMVMatrix","mat4"
	,"uCameraMatrix","mat4"
	,"uFaces","2fv",
	"uPositonX","fv"
	,"uPositonY","fv")
	.prepareTextures("uAltas","atlas")
	.setUniforms("uPMatrix",gCamera.projectionMatrix);


				var cubemesh:any = Primatives.Cube.createMesh(gl,"Cube",1,1,1,0,0,0,false);
				// 8 y = x  // 16 l
				gCamera.transform.position.set(7.5,-7.5,14.7);
				//gCamera.transform.position.set(0,0,64);
				for(var i=0; i < 256; i++){
					var model:C_Modal = new C_Modal(cubemesh).setPosition( (i%16 ) , 0.0 , -Math.floor(i/16) );
					gCubes.push(model);
					moveBot.push( new C_MoveBot(model.transform,
						model.transform.position
						));
					moveBot[i].SetPosition(new C_Vector3(gInputManager.startPos.x,gInputManager.startPos.y,gInputManager.startPos.z));
					moveBot[i].SetSpeed(1.0);
				}
				
				//....................................
				gRLoop.start();
				//onRender(0);
			}
var testi:number = 0;// Too Do
function onRender(dt:number):void{
	// console.log("run");
	//................................
				//Main Elements to draw to the frame
				gl.fClear();
				gCamera.updateViewMatrix();

				//................................
				//Draw Out models
				gShader.preRender("uCameraMatrix",gCamera.viewMatrix);
				//.renderModel(gModel.preRender(),false);
				// console.log(gCubes);
				uPositonX = 0;
				uPositonY = 0;
				temp = 15;
				for(var i:number=0; i < gCubes.length; i++){
					gShader.setUniforms("uPositonX",uPositonX).setUniforms("uPositonY",uPositonY).renderModel( gCubes[i].preRender() );
					getPositioninTexture(i);
					if(moveBot[i].GetIsRun() == true &&testi == i)
					{
						moveBot[i].Update();
						if(moveBot[i].GetIsRun() == false)
						{
							testi++;
						}
					}
				}
}


function getPositioninTexture(i:number):void{
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

function shutdown()
{
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
 testi = 0;
 gVertex_shader = null;
 gFragment_shader = null;

 uPositonX = 0;
 uPositonY = 0;
 temp = 15;
 moveBot = [];
}

function NewStart()
{
	shutdown();
	G_LoadShader();
}

function StopRenderLoop()
{
	gRLoop.stop();
}

function StartRenderLoop()
{
	gRLoop.start();
}