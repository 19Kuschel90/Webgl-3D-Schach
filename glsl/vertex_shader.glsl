#version 300 es
		in vec4 a_position;
		in vec3 a_norm;
		in vec2 a_uv;

		uniform mat4 uPMatrix;
		uniform mat4 uMVMatrix;
		uniform mat4 uCameraMatrix;
		uniform float ublackWite;
		out highp vec2 vUV;

		
		void main(void){

			vUV = vec2(ublackWite,1.0f);

			gl_Position = uPMatrix * uCameraMatrix * uMVMatrix * vec4(a_position.xyz, 1.0); 
		}