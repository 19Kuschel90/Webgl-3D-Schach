#version 300 es
		in vec4 a_position;
		in vec3 a_norm;
		in vec2 a_uv;

		uniform mat4 uPMatrix;
		uniform mat4 uMVMatrix;
		uniform mat4 uCameraMatrix;
		uniform vec2[6] uFaces;
		out highp vec2 vUV;

		const float size = 1.0/16.0;
		
		void main(void){
			int f = int(a_position.w);
			float u = uFaces[f].x * size + a_uv.x * size;
			float v = uFaces[f].y * size + a_uv.y * size;
			vUV = vec2(u,v);

			gl_Position = uPMatrix * uCameraMatrix * uMVMatrix * vec4(a_position.xyz, 1.0); 
		}