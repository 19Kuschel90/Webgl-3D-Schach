/* C_Resources.setup(gl,onReady).loadTexture("tex001","../shared/UV_Grid_Lrg.jpg").start(); */


class C_Resources{
	static gl:any;
	static onComplete:any = null;
	static Queue:any = [];
	static Images:any = [];
	static Videos:any = [];
	static queueData:any;
	static tagName:any;
	//Setup resource object
	static setup(gl:any,completeHandler:any){
		C_Resources.gl = gl;
		C_Resources.onComplete = completeHandler;
		return this;
	}

	//Start the download queue
	static start(){
        if(C_Resources.Queue.length > 0) 
        {
            C_Resources.loadNextItem();
	}}

	//===================================================
	// Loading
	static loadTexture(name:any,src:any):any{
		for(var i=0; i < arguments.length; i+=2){
			C_Resources.Queue.push({type:"img",name:arguments[i],src:arguments[i+1]});
		}
		return this;
	}
	static loadVideoTexture(name:any,src:any):any{
		for(var i=0; i < arguments.length; i+=2){
			C_Resources.Queue.push({type:"vid",name:arguments[i],src:arguments[i+1]});
		}
		return this;
	}

	//===================================================
	// Manage Queue
	static loadNextItem():any{
		//.......................................
		if(C_Resources.Queue.length == 0){
			if(C_Resources.onComplete != null) C_Resources.onComplete();
			else console.log("Resource Download Queue Complete");
			return;
		}

		//.......................................
		var itm = C_Resources.Queue.pop();
		switch(itm.type){
			case "img":
				var img:any = new Image();
				img.queueData = itm;
				img.onload = C_Resources.onDownloadSuccess;
				img.onabort = img.onerror = C_Resources.onDownloadError;
				img.src = itm.src;
				break;
			case "vid":
				var vid:any = document.createElement("video");
				vid.style.display = "none";
				document.body.appendChild(vid);

    			//vid.addEventListener("canplaythrough", videoReady, true); //When enough video is available to start playing
    			//vid.addEventListener("ended", videoComplete, true);			//WHen video is done.

				vid.queueData = itm;
				vid.addEventListener("loadeddata",C_Resources.onDownloadSuccess,false);
				vid.onabort = vid.onerror = C_Resources.onDownloadError;
				vid.autoplay = true;
				vid.loop = true;
				vid.src = itm.src;
				vid.load();
				vid.play();

				C_Resources.Videos[itm.name] = vid;
				break;
		}
	}

	//===================================================
   // tagName:any;
	// Event Handlers
	static onDownloadSuccess(){
        console.log(this);
		//Its an image, lets load it up as a texture in gl.
		if( this instanceof Image || this.tagName == "VIDEO"){
			var dat:any = this.queueData;
			C_Resources.gl.fLoadTexture(dat.name,this);
		}
		C_Resources.loadNextItem();
	}

	static onDownloadError(){
		console.log("Error getting ",this);
		C_Resources.loadNextItem();
	}
}


// var C_Resources.Queue = [];
// C_Resources.onComplete = null;
// C_Resources.gl = null;

// C_Resources.Images = [];
// C_Resources.Videos = [];