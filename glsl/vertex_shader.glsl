#version 300 es
		in vec3 a_position;
		in vec3 a_norm;
		in vec2 a_uv;

		uniform mat4 uPMatrix;
		uniform mat4 uMVMatrix;
		uniform mat4 uCameraMatrix;
		uniform mat3 uNormMatrix;
		uniform vec3 uCamPos;

		out vec3 vPos;
		out vec3 vNorm;
		out vec3 vCamPos;
		out highp vec2 vUV;
		
		void main(void){
			//Setup some fragment vars
			vec4 pos = uMVMatrix * vec4(a_position.xyz, 1.0);	//Need Position in World Space
			vPos = pos.xyz;
			vNorm =  uNormMatrix * a_norm;						//Need Norm Scaled/Rotated correctly //
			vUV = a_uv;
			vCamPos = (inverse(uCameraMatrix) * vec4(uCamPos,1.0)).xyz; //need to Move CameraPos into World Space for Specular Calculation.
			
			//Set Final Position
			gl_Position = uPMatrix * uCameraMatrix * pos; 
		}