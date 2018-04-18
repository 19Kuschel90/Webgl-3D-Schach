window.addEventListener("load",function(){
    G_LoadShader();
});
var gl:any;
var gModal:any;
var gCamera:C_Camera;
var gCameraCtrl:C_CameraController;
var gShader:any;
var gGridShader:any;
var gGridModal:any;
var RLoop:any;
var gGridFloor:C_GridFloor;
var gRLoop:C_RenderLoop;
var Resources:any;
var gCubes:C_Modal[] = [];
var texMap:any[] = [
	[15,15, 1,0, 1,0, 1,0, 1,0, 1,0],			//GrassDirt
	[4,1, 4,1, 4,1, 5,1, 4,1, 5,1],			//Log
	[11,1, 10,1, 10,1, 9,1, 10,1, 9,1],		//Chest
	[7,7, 6,7, 6,7, 6,7, 6,7, 6,6],			//Pumpkin
	[8,8, 8,8, 8,8, 9,8, 8,8, 9,8],			//WaterMelon
	[8,0, 8,0, 8,0, 10,0, 8,0, 9,0]			//TNT
];

var gvertex_shader:string;
var gfragment_shader:string;
var uPositonX:number = 0;
var uPositonY:number = 0;
var temp:number = 15;
var moveBot:C_MoveBot[] = [];
// var tesft:HTMLElement  | null;
// var fsds:string ;

function main(vertex_shader:string,fragment_shader:string):void
{
	gvertex_shader = vertex_shader;
	gfragment_shader = fragment_shader;
					//....................................
				//System Setup
				gl = GLInstance("webglCanvas").fFitScreen(0.95,0.9).fClear();
				
				gCamera = new C_Camera(gl);
				//gCamera.transform.position.set(8,-8,15);
				gCamera.transform.rotation.set(90,0,0);
				gCameraCtrl = new C_CameraController(gl,gCamera);

				gGridFloor = new C_GridFloor(gl);
				gRLoop = new C_RenderLoop(onRender,30);

				//....................................
				//Load up resources team-liquid-logo-blue-ocean.jpg
		//		C_Resources.setup(gl,onReady).loadTexture("atlas","../image/Pony.png").start();
				C_Resources.setup(gl,onReady).loadTexture("atlas","../image/c62bb9b27329447cb2b937fe6213889a.jpg").start();
			//	C_Resources.setup(gl,onReady).loadTexture("atlas","../image/team-liquid-logo-blue-ocean.jpg").start();
			//	C_Resources.setup(gl,onReady).loadTexture("atlas","../image/atlas_mindcraft.png").start();
			}
			
			//==================================================
			//When Main System is setup and all resources are downloaded.
			function onReady():void{
				// console.log("onReady()");
				//Setup Test Shader, Modal, Meshes
				gShader = new C_ShaderBuilder(gl,gvertex_shader,gfragment_shader)
				.prepareUniforms("uPMatrix","mat4"
				,"uMVMatrix","mat4"
				,"uCameraMatrix","mat4"
				,"uFaces","2fv",
				"uPositonX","fv"
				,"uPositonY","fv")
				.prepareTextures("uAltas","atlas")
				.setUniforms("uPMatrix",gCamera.projectionMatrix);
				//gModel = Primatives.Cube.createModal(gl,"Cube",true)
				//		.setPosition(0,0.6,0);//.setScale(0.7,0.7,0.7);

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
					moveBot[i].SetPosition(new C_Vector3(0,0,0));
					moveBot[i].SetSpeed(0.5);
				}
				//....................................
				gRLoop.start();
				//onRender(0);
			}

function onRender(dt:number):void{
	// console.log("run");
	//................................
				//Main Elements to draw to the frame
				gl.fClear();
				gCamera.updateViewMatrix();
				gGridFloor.render(gCamera);

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
					moveBot[i].Update();
				}
			 	//  (<HTMLElement>document.getElementById('PosX')).innerText = String(gCamera.transform.position.x);
			 	//  (<HTMLElement>document.getElementById('PosY')).innerText = String(gCamera.transform.position.y);
			 	//  (<HTMLElement>document.getElementById('PosZ')).innerText = String(gCamera.transform.position.z);
			// (<HTMLElement>document.getElementById('PosY')).innerText = String(moveBot.GetMyObjectTransform().position.y);
				//fsds = tesft.innerText;
		  
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