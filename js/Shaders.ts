

class C_ShaderBuilder{
	public	program:any;
	public	gl:any;
	public mUniformList:any;
	public mTextureList:any;
	public noCulling:any;
	public doBlending:any;
	constructor(gl:any,vertShader:string,fragShader:string){
		
		//If the text is small, then its most likely DOM names (very hack) else its actual Source.
		//TODO, Maybe check for new line instead of length, Dom names will never have new lines but source will.
		if(vertShader.length < 20)	this.program = C_ShaderUtil.domShaderProgram(gl,vertShader,fragShader,true);
		else						this.program = C_ShaderUtil.createProgramFromText(gl,vertShader,fragShader,true);
		
		if(this.program != null){
			this.gl = gl;
			gl.useProgram(this.program);
			this.mUniformList = [];		//List of Uniforms that have been loaded in. Key=UNIFORM_NAME {loc,type}
			this.mTextureList = [];		//List of texture uniforms, Indexed {loc,tex}

			this.noCulling = false;		//If true disables culling
			this.doBlending = false;	//If true, allows alpha to work.
		}
	}

   //---------------------------------------------------
    // Methods For Shader Prep.
    //---------------------------------------------------
    //Takes in unlimited arguments. Its grouped by two so for example (UniformName,UniformType): "uColors","3fv"
	public  prepareUniforms(...myargument:any[]) {
		// console.log(this.mUniformList);
		// console.log("prepareUniforms: " +myargument);
		
        if (myargument.length % 2 != 0) { console.log("prepareUniforms needs arguments to be in pairs."); return this; }

        var loc = 0;
        for (var i = 0; i < myargument.length; i += 2) {
            loc = gl.getUniformLocation(this.program, myargument[i]);
            if (loc != null) this.mUniformList[myargument[i]] = { loc: loc, type: myargument[i + 1] };
		}
        return this;
    }

    //Takes in unlimited arguments. Its grouped by two so for example (UniformName,CacheTextureName): "uMask01","tex001";
	public prepareTextures(...myargument:any[]) {
		// console.log("prepareTextures: " +myargument);
		
        if (myargument.length % 2 != 0) { console.log("prepareTextures needs arguments to be in pairs."); return this; }

        var loc = 0,
            tex = "";
        for (var i = 0; i < myargument.length; i += 2) {
            tex = this.gl.mTextureCache[myargument[i + 1]];
            if (tex === undefined) { console.log("Texture not found in cache " + myargument[i + 1]); continue; }

            loc = gl.getUniformLocation(this.program, myargument[i]);
            if (loc != null) this.mTextureList.push({ loc: loc, tex: tex });
        }
        return this;
    }

    //---------------------------------------------------
    // Setters Getters
    //---------------------------------------------------
    //Uses a 2 item group argument array. Uniform_Name, Uniform_Value;
    public setUniforms(...myargument:any[]) {
		// console.log("setUniforms: " +myargument);
        if (myargument.length % 2 != 0) { console.log("setUniforms needs myargument to be in pairs."); return this; }

        var name;
        for (var i = 0; i < myargument.length; i += 2) {
            name = myargument[i];
            if (this.mUniformList[name] === undefined) { console.log("uniform not found " + name); return this; } else {

            }
            switch (this.mUniformList[name].type) {
				case "fv":
					this.gl.uniform1f(this.mUniformList[name].loc, myargument[i+1]);
				break;
				case "2fv":
                    this.gl.uniform2fv(this.mUniformList[name].loc, new Float32Array(myargument[i + 1]));
                    break;
                case "3fv":
                    this.gl.uniform3fv(this.mUniformList[name].loc, new Float32Array(myargument[i + 1]));
                    break;
                case "4fv":
                    this.gl.uniform4fv(this.mUniformList[name].loc, new Float32Array(myargument[i + 1]));
                    break;
                case "mat4":
                    this.gl.uniformMatrix4fv(this.mUniformList[name].loc, false, myargument[i + 1]);
                    break;
                default:
                    console.log("unknown uniform type for " + name);
                    break;
            }
        }

        return this;
    }

	//---------------------------------------------------
	// Methods
	//---------------------------------------------------
	public activate():this{ this.gl.useProgram(this.program); return this; }
	public	deactivate():this{ this.gl.useProgram(null); return this; }

	//function helps clean up resources when shader is no longer needed.
	public dispose():void{
		//unbind the program if its currently active
		if(this.gl.getParameter(this.gl.CURRENT_PROGRAM) === this.program) this.gl.useProgram(null);
		this.gl.deleteProgram(this.program);
	}

	public preRender():this{
		this.gl.useProgram(this.program); //Save a function call and just activate this shader program on preRender

		//If passing in arguments, then lets push that to setUniforms for handling. Make less line needed in the main program by having preRender handle Uniforms
		if(arguments.length > 0) this.setUniforms.apply(this,arguments);

		//..........................................
		//Prepare textures that might be loaded up.
		//TODO, After done rendering need to deactivate the texture slots
		if(this.mTextureList.length > 0){
			var texSlot;
			for(var i=0; i < this.mTextureList.length; i++){
				texSlot = this.gl["TEXTURE" + i];
				this.gl.activeTexture(texSlot);
				this.gl.bindTexture(this.gl.TEXTURE_2D,this.mTextureList[i].tex);
				this.gl.uniform1i(this.mTextureList[i].loc,i);
			}
		}

		return this;
	}
	//Handle rendering a modal
	public renderModel(model:C_Modal, doShaderClose:boolean = false):any{
		this.setUniforms("uMVMatrix",model.transform.getViewMatrix());
		// console.log(model.mesh.vao);
		this.gl.bindVertexArray(model.mesh.vao);

		if(model.mesh.noCulling || this.noCulling)
		{
			this.gl.disable(this.gl.CULL_FACE);
		}else{
		}
		if(model.mesh.doBlending || this.doBlending) 
		{
			this.gl.enable(this.gl.BLEND);
		}else{
		}
		
		if(model.mesh.indexCount) 
		{
			this.gl.drawElements(model.mesh.drawMode, model.mesh.indexCount, gl.UNSIGNED_SHORT, 0); 
		}else{ this.gl.drawArrays(model.mesh.drawMode, 0, model.mesh.vertexCount);
		}
		//Cleanup
		this.gl.bindVertexArray(null);
		if(model.mesh.noCulling || this.noCulling) this.gl.enable(this.gl.CULL_FACE);
		if(model.mesh.doBlending || this.doBlending) this.gl.disable(this.gl.BLEND);

		if(doShaderClose) 
		{
			this.gl.useProgram(null);
		}
		else{
			// console.log(doShaderClose);
			// console.log("renderModel doShaderClose | 1142018190842");
		}
		return this;
	}
}
//////////////////////////////////////////////////////////////////////////////
class GlUtil{

	//Convert Hex colors to float arrays, can batch process a list into one big array.
	//example : GlUtil.rgbArray("#FF0000","00FF00","#0000FF");
	static rgbArray(...myArguments:any[]):any{
		if(myArguments.length == 0) return null;
		var rtn = [];

		for(var i=0,c,p; i < myArguments.length; i++){
			if(myArguments[i].length < 6) continue;
			c = myArguments[i];		//Just an alias(copy really) of the color text, make code smaller.
			p = (c[0] == "#")?1:0;	//Determine starting position in char array to start pulling from

			rtn.push(
				parseInt(c[p]	+c[p+1],16)	/ 255.0,
				parseInt(c[p+2]	+c[p+3],16)	/ 255.0,
				parseInt(c[p+4]	+c[p+5],16)	/ 255.0
			);
		}
		return rtn;
	}

}
//////////////////////////////////////////////////////////////////////////////

class C_Shader{
	public	gl:any;
	public	program:any;
	public	uniformLoc:any;
	public	attribLoc:any;
	constructor(gl:any,vertShaderSrc:any,fragShaderSrc:any){
		this.program = C_ShaderUtil.createProgramFromText(gl,vertShaderSrc,fragShaderSrc,true);

		if(this.program != null){
			this.gl = gl;
			gl.useProgram(this.program);
			this.attribLoc = C_ShaderUtil.getStandardAttribLocations(gl,this.program);
			this.uniformLoc = C_ShaderUtil.getStandardUniformLocations(gl,this.program);
		}
		else{
			console.log("!! this.program == null")
		}

		//Note :: Extended shaders should deactivate shader when done calling super and setting up custom parts in the constructor.
	}

	//...................................................
	//Methods
	public activate(){ this.gl.useProgram(this.program); return this; }
	public 	deactivate(){ this.gl.useProgram(null); return this; }

	public setPerspective(matData:any):any{	this.gl.uniformMatrix4fv(this.uniformLoc.perspective, false, matData); return this; }
	public setModalMatrix(matData:any):any{	this.gl.uniformMatrix4fv(this.uniformLoc.modalMatrix, false, matData); return this; }
	public setCameraMatrix(matData:any):any{	this.gl.uniformMatrix4fv(this.uniformLoc.cameraMatrix, false, matData); return this; }
	//function helps clean up resources when shader is no longer needed.
	public dispose(){
		//unbind the program if its currently active
		if(this.gl.getParameter(this.gl.CURRENT_PROGRAM) === this.program) this.gl.useProgram(null);
		this.gl.deleteProgram(this.program);
	}

	//...................................................
	//RENDER RELATED METHODS

	//Setup custom properties
	public preRender(){} //abstract method, extended object may need need to do some things before rendering.

	//Handle rendering a modal
	public renderModal(modal:C_Modal):any{
		this.setModalMatrix(modal.transform.getViewMatrix()); //Set the transform, so the shader knows where the modal exists in 3d space
        this.gl.bindVertexArray(modal.mesh.vao); //Enable VAO, this will set all the predefined attributes for the shader

        // console.log("gl: " + gl);
        if (modal.mesh.noCulling) {
            this.gl.disable(this.gl.CULL_FACE);
        }

        if (modal.mesh.doBlending) {
            this.gl.enable(this.gl.BLEND);
        }
        if (modal.mesh.indexCount) {
            this.gl.drawElements(modal.mesh.drawMode, modal.mesh.indexCount, this.gl.UNSIGNED_SHORT, 0);
        } else {
            this.gl.drawArrays(modal.mesh.drawMode, 0, modal.mesh.vertexCount);
        }
        //Cleanup
        this.gl.bindVertexArray(null);
        if (modal.mesh.noCulling) this.gl.enable(this.gl.CULL_FACE);
        if (modal.mesh.doBlending) this.gl.disable(this.gl.BLEND);

        return this;
	}
	
}
	//////////////////////////////////////////////////////////////////////////////		
	class TestShader extends C_Shader{
		
		mainTexture: number[];

				constructor(gl:any,pMatrix:Float32Array){
					var vertSrc = gVertex_shader,
						fragSrc = gFragment_shader;
					super(gl,vertSrc,fragSrc);
			//custom uniforms
			this.uniformLoc.lightpos = gl.getUniformLocation(this.program,"uLightPos");
			this.uniformLoc.campos = gl.getUniformLocation(this.program,"uCamPos");
			this.uniformLoc.matNorm = gl.getUniformLocation(this.program,"uNormMatrix");

									//Standrd Uniforms
									this.setPerspective(pMatrix);
									this.mainTexture = []; //Store Our Texture ID
									gl.useProgram(null); //Done setting up shader
				}

				setTexture(texID:any){ this.mainTexture.push(texID); return this; }
				setLightPos(obj:any){ this.gl.uniform3fv(this.uniformLoc.lightpos, new Float32Array( obj.transform.position.getArray() )); return this; }
				setCameraPos(obj:any){ this.gl.uniform3fv(this.uniformLoc.campos, new Float32Array( obj.transform.position.getArray() )); return this; }

				//Override
				preRender(numberTexture:number = 0){
					//Setup Texture 
					//FS uniform sampler2D uMainTex
				

						this.gl.activeTexture(this.gl.TEXTURE0);
						this.gl.bindTexture(this.gl.TEXTURE_2D, this.mainTexture[numberTexture]);
						this.gl.uniform1i(this.uniformLoc.mainTexture[numberTexture],0); //Our predefined uniformLoc.mainTexture is uMainTex, Prev Lessons we made ShaderUtil.getStandardUniformLocations() function in Shaders.js to get its location.
					
				
					
					return this;
				}

				renderModal(modal:any){
					this.gl.uniformMatrix3fv(this.uniformLoc.matNorm, false, modal.transform.getNormalMatrix());
					super.renderModal(modal);
					return this;
				}
			}

			class Skymap{
				mUniNightTex(arg0: any, arg1: any): any {
					throw new Error("Method not implemented.");
				}
				mUniTime(arg0: any, arg1: any): any {
					throw new Error("Method not implemented.");
				}
				mUniDayTex(arg0: any, arg1: any): any {
					throw new Error("Method not implemented.");
				}
				mUniCamera(arg0: any, arg1: any, arg2: any): any {
					throw new Error("Method not implemented.");
				}
				mUniProj(arg0: any, arg1: any, arg2: any): any {
					throw new Error("Method not implemented.");
				}
				mesh: any;
				mShader(arg0: any): any {
					throw new Error("Method not implemented.");
				}
				mTime: number;
				mNightTex: number;
				mDayTex: number;
				gl: any;
				constructor(gl: any,w: number =20,h: number = 20,d: number = 20){
					this.gl = gl;
					this.mDayTex = -1;
					this.mNightTex = -1;
					this.mTime = 0.0;
					this.createMesh(w,h,d);
				}
			
				//==================================================================
				// Setters
				//==================================================================
				setTime(t:number):this{ this.mTime = t; return this; }
			
				setDayTex(...myArguments:any[]):this{
					if(myArguments.length == 6) this.mDayTex = gl.fLoadCubeMap("Skymap_Day",myArguments);
					 return this;
				}
			
				setDayTexByDom(...myArguments:any[]):this{
					if(myArguments.length != 6){ console.log("Day Texture needs to be 6 images"); return this; }
			
					var ary = [];
					for(var i=0; i < 6; i++) ary.push( document.getElementById(myArguments[i]) );
			
					this.mDayTex = gl.fLoadCubeMap("Skymap_Day",ary);
					return this;
				}
			
				setNightTex(ary:any[],...myarguments:any[]):this{
					if(myarguments.length == 6) this.mNightTex = gl.fLoadCubeMap("Skymap_Night",myarguments);
					 return this;
				}
			
				setNightTexByDom( ...myarguments:any[]):this{
					if(myarguments.length != 6){ console.log("Day Texture needs to be 6 images"); return this; }
			
					var ary = [];
					for(var i=0; i < 6; i++) ary.push( document.getElementById(myarguments[i]) );
			
					this.mNightTex = gl.fLoadCubeMap("Skymap_Night",ary);
					return this;
				}
				
				//==================================================================
				// Methods
				//==================================================================
				finalize(){ this.createShader(); return this; }
				render(camera:C_Camera){
					//Prepare Shader
					this.gl.useProgram(this.mShader);
					this.gl.bindVertexArray(this.mesh.vao);
			
					//Push Uniforms
					this.gl.uniformMatrix4fv(this.mUniProj, false, camera.projectionMatrix); 
					this.gl.uniformMatrix4fv(this.mUniCamera, false, camera.viewMatrix);
			
					//Setup Day Texture
					this.gl.activeTexture(this.gl.TEXTURE0);
					this.gl.bindTexture(this.gl.TEXTURE_CUBE_MAP, this.mDayTex);
					this.gl.uniform1i(this.mUniDayTex,0);
			
					//Setup Night Texture and Time value.
					if(this.mNightTex != -1){
						this.gl.uniform1f(this.mUniTime, this.mTime);
			
						this.gl.activeTexture(this.gl.TEXTURE1);
						this.gl.bindTexture(this.gl.TEXTURE_CUBE_MAP, this.mNightTex);
						this.gl.uniform1i(this.mUniNightTex,1);
					}
			
					//Draw Skymap
					this.gl.drawElements(this.mesh.drawMode, this.mesh.indexCount, this.gl.UNSIGNED_SHORT, 0); 
			
					//Cleanup
					this.gl.bindVertexArray(null);
					this.gl.useProgram(null);
				}
			
				//==================================================================
				// Shader and Mesh Generation.
				//==================================================================
				createShader(){
					//........................................
					var vShader = '#version 300 es\n'+
						'layout(location=0) in vec3 a_position;'+
						'uniform mat4 uPMatrix;'+
						'uniform mat4 uCameraMatrix;'+
						'out highp vec3 texCoord;'+
						'void main(void){'+
							'texCoord = a_position.xyz;'+
							'gl_Position = uPMatrix * uCameraMatrix * vec4(a_position.xyz, 1.0);'+
						'}';
			
					//........................................
					//Build Fragment Shader Based on if there is a Night Texture.
					var fShader = '#version 300 es\n'+
						'precision mediump float;'+
						'out vec4 finalColor;'+
						'in highp vec3 texCoord;'+
						'uniform samplerCube uDayTex;';
			
					if(this.mNightTex == -1)
							fShader += 'void main(void){ finalColor = texture(uDayTex, texCoord); }';
					else	fShader += 'uniform samplerCube uNightTex; uniform float uTime;'+
								'void main(void){ finalColor = mix( texture(uDayTex, texCoord), texture(uNightTex, texCoord), uTime ); }';	
			
					//........................................
					this.mShader	= C_ShaderUtil.createProgramFromText(this.gl,skyShader[0],skyShader[1],true);
					this.mUniProj	= this.gl.getUniformLocation(this.mShader,"uPMatrix");
					this.mUniCamera	= this.gl.getUniformLocation(this.mShader,"uCameraMatrix");
					this.mUniDayTex	= this.gl.getUniformLocation(this.mShader,"uDayTex");
					
					if(this.mNightTex != -1){
						this.mUniNightTex	= this.gl.getUniformLocation(this.mShader,"uNightTex");
						this.mUniTime		= this.gl.getUniformLocation(this.mShader,"uTime");
					}
				}
			
				createMesh(width:number,height:number,depth:number){ //,x,y,z
					var w = width*2.0, h = height*2.0, d = depth*2.0;
					//var x0 = x-w, x1 = x+w, y0 = y-h, y1 = y+h, z0 = z-d, z1 = z+d;
					var x0 = -w, x1 = w, y0 = -h, y1 = h, z0 = -d, z1 = d;
			
					var aVert = [
						x0, y1, z1, //0 Front
						x0, y0, z1, //1
						x1, y0, z1,	//2
						x1, y1, z1,	//3 
						x1, y1, z0,	//4 Back
						x1, y0, z0,	//5
						x0, y0, z0,	//6
						x0, y1, z0,	//7 
						x0, y1, z0,	//7 Left
						x0, y0, z0,	//6
						x0, y0, z1,	//1
						x0, y1, z1,	//0
						x0, y0, z1,	//1 Bottom
						x0, y0, z0,	//6
						x1, y0, z0,	//5
						x1, y0, z1,	//2
						x1, y1, z1,	//3 Right
						x1, y0, z1,	//2 
						x1, y0, z0,	//5
						x1, y1, z0,	//4
						x0, y1, z0, //7 Top
						x0, y1, z1, //0
						x1, y1, z1, //3
						x1, y1, z0  //4
					];
			
					//Build the index of each quad [0,1,2, 2,3,0]
					var aIndex = [];
					for(var i=0; i < aVert.length / 3; i+=2) aIndex.push((Math.floor(i/4)*4)+((i+2)%4), i+1, i); //Build in reverse order so the inside renders but not the outside
			
					//Create VAO
					this.mesh = this.gl.fCreateMeshVAO("SkymapCube",aIndex,aVert,null,null);
				}
			}			
// //////////////////////////////////////////////////////////////////////////////
// Old
// class C_SkymapShader extends C_Shader{
// 	texNight: any;
// 	texDay: any;
// 	constructor(gl:any,pMatrix:any,dayTex:any,nightTex:any){
// 		var vertSrc = skyShader[0],
// 			fragSrc = skyShader[1];
			
// 		super(gl,vertSrc,fragSrc);

// 		//Custom Uniforms
// 		this.uniformLoc.time = gl.getUniformLocation(this.program,"uTime");
// 		this.uniformLoc.dayTex = gl.getUniformLocation(this.program,"uDayTex");
// 		this.uniformLoc.nightTex = gl.getUniformLocation(this.program,"uNightTex");

// 		//Standrd Uniforms
// 		this.setPerspective(pMatrix);
// 		this.texDay = dayTex;
// 		this.texNight = nightTex;
// 		gl.useProgram(null); //Done setting up shader
// 	}

// 	setTime(t:any){ this.gl.uniform1f(this.uniformLoc.time,t); return this; }

// 	//Override
// 	preRender(){
// 		//Setup Texture
// 		this.gl.activeTexture(this.gl.TEXTURE0);
// 		this.gl.bindTexture(this.gl.TEXTURE_CUBE_MAP, this.texDay);
// 		this.gl.uniform1i(this.uniformLoc.dayTex,0);

// 		this.gl.activeTexture(this.gl.TEXTURE1);
// 		this.gl.bindTexture(this.gl.TEXTURE_CUBE_MAP, this.texNight);
// 		this.gl.uniform1i(this.uniformLoc.nightTex,1);
// 		return this;
// 	}
// }
//Not use
class C_GridAxisShader extends C_Shader{
	public	program:any;
	constructor(gl:any,pMatrix:any){
		var vertSrc = '#version 300 es\n' +
			'in vec3 a_position;' +
			'layout(location=4) in float a_color;' +
			'uniform mat4 uPMatrix;' +
			'uniform mat4 uMVMatrix;' +
			'uniform mat4 uCameraMatrix;' +
			'uniform vec3 uColor[4];' +
			'out lowp vec4 color;' +
			'void main(void){' +
				'color = vec4(uColor[ int(a_color) ],1.0);' +
				'gl_Position = uPMatrix * uCameraMatrix * uMVMatrix * vec4(a_position, 1.0);' +
			'}';
		var fragSrc = '#version 300 es\n' +
			'precision mediump float;' +
			'in vec4 color;' +
			'out vec4 finalColor;' +
			'void main(void){ finalColor = color; }';

		super(gl,vertSrc,fragSrc);
		//Standrd Uniforms
		this.setPerspective(pMatrix);

		//Custom Uniforms 
		var uColor	= gl.getUniformLocation(this.program,"uColor");
		gl.uniform3fv(uColor, new Float32Array([ 0.8,0.8,0.8,  1,0,0,  0,1,0,  0,0,1 ]));

		//Cleanup
		gl.useProgram(null);
	}
}


class C_ShaderUtil{
	// load Shader text
	public static domShaderSrc(elmID:string){
		var elm:any = document.getElementById(elmID);
		if(!elm || elm.text == ""){ console.log(elmID + " shader not found or no text."); return null; }
		
		return elm.text;
	}

	public static createShader(gl:any,src:string,type:any){
		var shader = gl.createShader(type);
		gl.shaderSource(shader,src);
		gl.compileShader(shader);

		//Get Error data if shader failed compiling
		if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS)){
			console.error("Error compiling shader : " + src, gl.getShaderInfoLog(shader));
			gl.deleteShader(shader);
			return null;
		}

		return shader;
	}

	public static createProgram(gl:any,vShader:any,fShader:any,doValidate:any){
		//Link shaders together
		var prog = gl.createProgram();
		gl.attachShader(prog,vShader);
		gl.attachShader(prog,fShader);


		//Force predefined locations for specific attributes. If the attibute isn't used in the shader its location will default to -1
		gl.bindAttribLocation(prog,ATTR_POSITION_LOC,ATTR_POSITION_NAME);
		gl.bindAttribLocation(prog,ATTR_NORMAL_LOC,ATTR_NORMAL_NAME);
		gl.bindAttribLocation(prog,ATTR_UV_LOC,ATTR_UV_NAME);
		gl.linkProgram(prog);

		//Check if successful
		if(!gl.getProgramParameter(prog, gl.LINK_STATUS)){
			console.error("Error creating shader program.",gl.getProgramInfoLog(prog));
			gl.deleteProgram(prog); return null;
		}

		//Only do this for additional debugging.
		if(doValidate){
			gl.validateProgram(prog);
			if(!gl.getProgramParameter(prog,gl.VALIDATE_STATUS)){
				console.error("Error validating program", gl.getProgramInfoLog(prog));
				gl.deleteProgram(prog); return null;
			}
		}
		
		//Can delete the shaders since the program has been made.
		gl.detachShader(prog,vShader); //TODO, detaching might cause issues on some browsers, Might only need to delete.
		gl.detachShader(prog,fShader);
		gl.deleteShader(fShader);
		gl.deleteShader(vShader);

		return prog;
	}

	public static domShaderProgram(gl:any,vectID:any,fragID:any,doValidate:any):any{
		var vShaderTxt	= C_ShaderUtil.domShaderSrc(vectID);								if(!vShaderTxt)	return null;
		var fShaderTxt	= C_ShaderUtil.domShaderSrc(fragID);								if(!fShaderTxt)	return null;
		var vShader		= C_ShaderUtil.createShader(gl,vShaderTxt,gl.VERTEX_SHADER);		if(!vShader)	return null;
		var fShader		= C_ShaderUtil.createShader(gl,fShaderTxt,gl.FRAGMENT_SHADER);	if(!fShader){	gl.deleteShader(vShader); return null; }
		
		return C_ShaderUtil.createProgram(gl,vShader,fShader,true);
	}


public static createProgramFromText(gl:any,vShaderTxt:any,fShaderTxt:any,doValidate:any){
		var vShader		= C_ShaderUtil.createShader(gl,vShaderTxt,gl.VERTEX_SHADER);		if(!vShader)	return null;
		var fShader		= C_ShaderUtil.createShader(gl,fShaderTxt,gl.FRAGMENT_SHADER);	if(!fShader){	gl.deleteShader(vShader); return null; }
		
		return C_ShaderUtil.createProgram(gl,vShader,fShader,true);
	}

			//Get the locations of standard Attributes that we will mostly be using. Location will = -1 if attribute is not found.
			public static getStandardAttribLocations(gl:any,program:any){
		return {
			position:	gl.getAttribLocation(program,ATTR_POSITION_NAME),
			norm:		gl.getAttribLocation(program,ATTR_NORMAL_NAME),
			uv:			gl.getAttribLocation(program,ATTR_UV_NAME)
		};
	}

	public static getStandardUniformLocations(gl:any,program:any){
		return {
			perspective:	gl.getUniformLocation(program,"uPMatrix"),
			modalMatrix:	gl.getUniformLocation(program,"uMVMatrix"),
			cameraMatrix:	gl.getUniformLocation(program,"uCameraMatrix"),
			mainTexture:	gl.getUniformLocation(program,"uMainTex")
		};
	}
}