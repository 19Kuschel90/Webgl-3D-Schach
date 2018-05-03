#version 300 es
		precision mediump float;
		uniform sampler2D uAltas;
		in highp vec2 vUV;
		out vec4 outColor;

		void main(void){ outColor = vec4(vUV.x,vUV.x,vUV.x,1.0f) ; }