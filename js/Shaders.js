"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var C_ShaderBuilder = /** @class */ (function () {
    function C_ShaderBuilder(gl, vertShader, fragShader) {
        //If the text is small, then its most likely DOM names (very hack) else its actual Source.
        //TODO, Maybe check for new line instead of length, Dom names will never have new lines but source will.
        if (vertShader.length < 20)
            this.program = C_ShaderUtil.domShaderProgram(gl, vertShader, fragShader, true);
        else
            this.program = C_ShaderUtil.createProgramFromText(gl, vertShader, fragShader, true);
        if (this.program != null) {
            this.gl = gl;
            gl.useProgram(this.program);
            this.mUniformList = []; //List of Uniforms that have been loaded in. Key=UNIFORM_NAME {loc,type}
            this.mTextureList = []; //List of texture uniforms, Indexed {loc,tex}
            this.noCulling = false; //If true disables culling
            this.doBlending = false; //If true, allows alpha to work.
        }
    }
    //---------------------------------------------------
    // Methods For Shader Prep.
    //---------------------------------------------------
    //Takes in unlimited arguments. Its grouped by two so for example (UniformName,UniformType): "uColors","3fv"
    C_ShaderBuilder.prototype.prepareUniforms = function () {
        // console.log(this.mUniformList);
        // console.log("prepareUniforms: " +myargument);
        var myargument = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            myargument[_i] = arguments[_i];
        }
        if (myargument.length % 2 != 0) {
            console.log("prepareUniforms needs arguments to be in pairs.");
            return this;
        }
        var loc = 0;
        for (var i = 0; i < myargument.length; i += 2) {
            loc = gl.getUniformLocation(this.program, myargument[i]);
            if (loc != null)
                this.mUniformList[myargument[i]] = { loc: loc, type: myargument[i + 1] };
        }
        return this;
    };
    //Takes in unlimited arguments. Its grouped by two so for example (UniformName,CacheTextureName): "uMask01","tex001";
    C_ShaderBuilder.prototype.prepareTextures = function () {
        // console.log("prepareTextures: " +myargument);
        var myargument = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            myargument[_i] = arguments[_i];
        }
        if (myargument.length % 2 != 0) {
            console.log("prepareTextures needs arguments to be in pairs.");
            return this;
        }
        var loc = 0, tex = "";
        for (var i = 0; i < myargument.length; i += 2) {
            tex = this.gl.mTextureCache[myargument[i + 1]];
            if (tex === undefined) {
                console.log("Texture not found in cache " + myargument[i + 1]);
                continue;
            }
            loc = gl.getUniformLocation(this.program, myargument[i]);
            if (loc != null)
                this.mTextureList.push({ loc: loc, tex: tex });
        }
        return this;
    };
    //---------------------------------------------------
    // Setters Getters
    //---------------------------------------------------
    //Uses a 2 item group argument array. Uniform_Name, Uniform_Value;
    C_ShaderBuilder.prototype.setUniforms = function () {
        var myargument = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            myargument[_i] = arguments[_i];
        }
        // console.log("setUniforms: " +myargument);
        if (myargument.length % 2 != 0) {
            console.log("setUniforms needs myargument to be in pairs.");
            return this;
        }
        var name;
        for (var i = 0; i < myargument.length; i += 2) {
            name = myargument[i];
            if (this.mUniformList[name] === undefined) {
                console.log("uniform not found " + name);
                return this;
            }
            else {
            }
            switch (this.mUniformList[name].type) {
                case "fv":
                    this.gl.uniform1f(this.mUniformList[name].loc, myargument[i + 1]);
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
    };
    //---------------------------------------------------
    // Methods
    //---------------------------------------------------
    C_ShaderBuilder.prototype.activate = function () { this.gl.useProgram(this.program); return this; };
    C_ShaderBuilder.prototype.deactivate = function () { this.gl.useProgram(null); return this; };
    //function helps clean up resources when shader is no longer needed.
    C_ShaderBuilder.prototype.dispose = function () {
        //unbind the program if its currently active
        if (this.gl.getParameter(this.gl.CURRENT_PROGRAM) === this.program)
            this.gl.useProgram(null);
        this.gl.deleteProgram(this.program);
    };
    C_ShaderBuilder.prototype.preRender = function () {
        this.gl.useProgram(this.program); //Save a function call and just activate this shader program on preRender
        //If passing in arguments, then lets push that to setUniforms for handling. Make less line needed in the main program by having preRender handle Uniforms
        if (arguments.length > 0)
            this.setUniforms.apply(this, arguments);
        //..........................................
        //Prepare textures that might be loaded up.
        //TODO, After done rendering need to deactivate the texture slots
        if (this.mTextureList.length > 0) {
            var texSlot;
            for (var i = 0; i < this.mTextureList.length; i++) {
                texSlot = this.gl["TEXTURE" + i];
                this.gl.activeTexture(texSlot);
                this.gl.bindTexture(this.gl.TEXTURE_2D, this.mTextureList[i].tex);
                this.gl.uniform1i(this.mTextureList[i].loc, i);
            }
        }
        return this;
    };
    //Handle rendering a modal
    C_ShaderBuilder.prototype.renderModel = function (model, doShaderClose) {
        if (doShaderClose === void 0) { doShaderClose = false; }
        this.setUniforms("uMVMatrix", model.transform.getViewMatrix());
        // console.log(model.mesh.vao);
        this.gl.bindVertexArray(model.mesh.vao);
        if (model.mesh.noCulling || this.noCulling) {
            this.gl.disable(this.gl.CULL_FACE);
        }
        else {
        }
        if (model.mesh.doBlending || this.doBlending) {
            this.gl.enable(this.gl.BLEND);
        }
        else {
        }
        if (model.mesh.indexCount) {
            this.gl.drawElements(model.mesh.drawMode, model.mesh.indexCount, gl.UNSIGNED_SHORT, 0);
        }
        else {
            this.gl.drawArrays(model.mesh.drawMode, 0, model.mesh.vertexCount);
        }
        //Cleanup
        this.gl.bindVertexArray(null);
        if (model.mesh.noCulling || this.noCulling)
            this.gl.enable(this.gl.CULL_FACE);
        if (model.mesh.doBlending || this.doBlending)
            this.gl.disable(this.gl.BLEND);
        if (doShaderClose) {
            this.gl.useProgram(null);
        }
        else {
            // console.log(doShaderClose);
            // console.log("renderModel doShaderClose | 1142018190842");
        }
        return this;
    };
    return C_ShaderBuilder;
}());
//////////////////////////////////////////////////////////////////////////////
var C_Shader = /** @class */ (function () {
    function C_Shader(gl, vertShaderSrc, fragShaderSrc) {
        this.program = C_ShaderUtil.createProgramFromText(gl, vertShaderSrc, fragShaderSrc, true);
        if (this.program != null) {
            this.gl = gl;
            gl.useProgram(this.program);
            this.attribLoc = C_ShaderUtil.getStandardAttribLocations(gl, this.program);
            this.uniformLoc = C_ShaderUtil.getStandardUniformLocations(gl, this.program);
        }
        //Note :: Extended shaders should deactivate shader when done calling super and setting up custom parts in the constructor.
    }
    //...................................................
    //Methods
    C_Shader.prototype.activate = function () { this.gl.useProgram(this.program); return this; };
    C_Shader.prototype.deactivate = function () { this.gl.useProgram(null); return this; };
    C_Shader.prototype.setPerspective = function (matData) { this.gl.uniformMatrix4fv(this.uniformLoc.perspective, false, matData); return this; };
    C_Shader.prototype.setModalMatrix = function (matData) { this.gl.uniformMatrix4fv(this.uniformLoc.modalMatrix, false, matData); return this; };
    C_Shader.prototype.setCameraMatrix = function (matData) { this.gl.uniformMatrix4fv(this.uniformLoc.cameraMatrix, false, matData); return this; };
    //function helps clean up resources when shader is no longer needed.
    C_Shader.prototype.dispose = function () {
        //unbind the program if its currently active
        if (this.gl.getParameter(this.gl.CURRENT_PROGRAM) === this.program)
            this.gl.useProgram(null);
        this.gl.deleteProgram(this.program);
    };
    //...................................................
    //RENDER RELATED METHODS
    //Setup custom properties
    C_Shader.prototype.preRender = function () { }; //abstract method, extended object may need need to do some things before rendering.
    //Handle rendering a modal
    C_Shader.prototype.renderModal = function (modal) {
        // console.log(modal);
        this.setModalMatrix(modal.transform.getViewMatrix()); //Set the transform, so the shader knows where the modal exists in 3d space
        this.gl.bindVertexArray(modal.mesh.vao); //Enable VAO, this will set all the predefined attributes for the shader
        if (modal.mesh.indexCount)
            this.gl.drawElements(modal.mesh.drawMode, modal.mesh.indexLength, gl.UNSIGNED_SHORT, 0);
        else
            this.gl.drawArrays(modal.mesh.drawMode, 0, modal.mesh.vertexCount);
        this.gl.bindVertexArray(null);
        return this;
    };
    return C_Shader;
}());
//////////////////////////////////////////////////////////////////////////////
var C_TestShader = /** @class */ (function (_super) {
    __extends(C_TestShader, _super);
    function C_TestShader(gl, aryColor, vertSrc, fragSrc) {
        var _this = _super.call(this, gl, vertSrc, fragSrc) || this;
        //Our shader uses custom uniforms 
        var uColor = gl.getUniformLocation(_this.program, "uColor");
        gl.uniform3fv(uColor, aryColor);
        gl.useProgram(null); //Done setting up shader
        return _this;
    }
    return C_TestShader;
}(C_Shader));
//////////////////////////////////////////////////////////////////////////////
//Not use
var C_GridAxisShader = /** @class */ (function (_super) {
    __extends(C_GridAxisShader, _super);
    function C_GridAxisShader(gl, pMatrix) {
        var _this = this;
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
        _this = _super.call(this, gl, vertSrc, fragSrc) || this;
        //Standrd Uniforms
        _this.setPerspective(pMatrix);
        //Custom Uniforms 
        var uColor = gl.getUniformLocation(_this.program, "uColor");
        gl.uniform3fv(uColor, new Float32Array([0.8, 0.8, 0.8, 1, 0, 0, 0, 1, 0, 0, 0, 1]));
        //Cleanup
        gl.useProgram(null);
        return _this;
    }
    return C_GridAxisShader;
}(C_Shader));
var C_ShaderUtil = /** @class */ (function () {
    function C_ShaderUtil() {
    }
    // load Shader text
    C_ShaderUtil.domShaderSrc = function (elmID) {
        var elm = document.getElementById(elmID);
        if (!elm || elm.text == "") {
            console.log(elmID + " shader not found or no text.");
            return null;
        }
        return elm.text;
    };
    C_ShaderUtil.createShader = function (gl, src, type) {
        var shader = gl.createShader(type);
        gl.shaderSource(shader, src);
        gl.compileShader(shader);
        //Get Error data if shader failed compiling
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.error("Error compiling shader : " + src, gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
            return null;
        }
        return shader;
    };
    C_ShaderUtil.createProgram = function (gl, vShader, fShader, doValidate) {
        //Link shaders together
        var prog = gl.createProgram();
        gl.attachShader(prog, vShader);
        gl.attachShader(prog, fShader);
        //Force predefined locations for specific attributes. If the attibute isn't used in the shader its location will default to -1
        gl.bindAttribLocation(prog, ATTR_POSITION_LOC, ATTR_POSITION_NAME);
        gl.bindAttribLocation(prog, ATTR_NORMAL_LOC, ATTR_NORMAL_NAME);
        gl.bindAttribLocation(prog, ATTR_UV_LOC, ATTR_UV_NAME);
        gl.linkProgram(prog);
        //Check if successful
        if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
            console.error("Error creating shader program.", gl.getProgramInfoLog(prog));
            gl.deleteProgram(prog);
            return null;
        }
        //Only do this for additional debugging.
        if (doValidate) {
            gl.validateProgram(prog);
            if (!gl.getProgramParameter(prog, gl.VALIDATE_STATUS)) {
                console.error("Error validating program", gl.getProgramInfoLog(prog));
                gl.deleteProgram(prog);
                return null;
            }
        }
        //Can delete the shaders since the program has been made.
        gl.detachShader(prog, vShader); //TODO, detaching might cause issues on some browsers, Might only need to delete.
        gl.detachShader(prog, fShader);
        gl.deleteShader(fShader);
        gl.deleteShader(vShader);
        return prog;
    };
    C_ShaderUtil.domShaderProgram = function (gl, vectID, fragID, doValidate) {
        var vShaderTxt = C_ShaderUtil.domShaderSrc(vectID);
        if (!vShaderTxt)
            return null;
        var fShaderTxt = C_ShaderUtil.domShaderSrc(fragID);
        if (!fShaderTxt)
            return null;
        var vShader = C_ShaderUtil.createShader(gl, vShaderTxt, gl.VERTEX_SHADER);
        if (!vShader)
            return null;
        var fShader = C_ShaderUtil.createShader(gl, fShaderTxt, gl.FRAGMENT_SHADER);
        if (!fShader) {
            gl.deleteShader(vShader);
            return null;
        }
        return C_ShaderUtil.createProgram(gl, vShader, fShader, true);
    };
    C_ShaderUtil.createProgramFromText = function (gl, vShaderTxt, fShaderTxt, doValidate) {
        var vShader = C_ShaderUtil.createShader(gl, vShaderTxt, gl.VERTEX_SHADER);
        if (!vShader)
            return null;
        var fShader = C_ShaderUtil.createShader(gl, fShaderTxt, gl.FRAGMENT_SHADER);
        if (!fShader) {
            gl.deleteShader(vShader);
            return null;
        }
        return C_ShaderUtil.createProgram(gl, vShader, fShader, true);
    };
    //Get the locations of standard Attributes that we will mostly be using. Location will = -1 if attribute is not found.
    C_ShaderUtil.getStandardAttribLocations = function (gl, program) {
        return {
            position: gl.getAttribLocation(program, ATTR_POSITION_NAME),
            norm: gl.getAttribLocation(program, ATTR_NORMAL_NAME),
            uv: gl.getAttribLocation(program, ATTR_UV_NAME)
        };
    };
    C_ShaderUtil.getStandardUniformLocations = function (gl, program) {
        return {
            perspective: gl.getUniformLocation(program, "uPMatrix"),
            modalMatrix: gl.getUniformLocation(program, "uMVMatrix"),
            cameraMatrix: gl.getUniformLocation(program, "uCameraMatrix"),
            mainTexture: gl.getUniformLocation(program, "uMainTex")
        };
    };
    return C_ShaderUtil;
}());
//# sourceMappingURL=Shaders.js.map