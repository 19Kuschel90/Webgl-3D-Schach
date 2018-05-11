#version 300 es
// FS Sky
		precision mediump float;
		
		uniform float uTime;
		in highp vec3 texCoord;
		uniform samplerCube uDayTex;
		uniform samplerCube uNightTex;
		
		out vec4 finalColor;
		void main(void){
			// finalColor = mix( texture(uDayTex, texCoord), texture(uNightTex, texCoord), abs(sin(uTime * 0.0005)) );
			 finalColor =
			//   vec4(0.0,1.0,0.3,1.0);
			//   vec4(texture(uNightTex * texCoord),0.0);
			 mix( texture(uNightTex, texCoord), texture(uDayTex, texCoord), abs(sin(uTime * 0.0002)) );
		}