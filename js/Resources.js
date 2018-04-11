"use strict";
/* C_Resources.setup(gl,onReady).loadTexture("tex001","../shared/UV_Grid_Lrg.jpg").start(); */
var C_Resources = /** @class */ (function () {
    function C_Resources() {
    }
    //Setup resource object
    C_Resources.setup = function (gl, completeHandler) {
        C_Resources.gl = gl;
        C_Resources.onComplete = completeHandler;
        return this;
    };
    //Start the download queue
    C_Resources.start = function () {
        if (C_Resources.Queue.length > 0) {
            C_Resources.loadNextItem();
        }
    };
    //===================================================
    // // Loading
    // static loadTexture(name:any,src:any,...myarguments:any[]):any{
    // 	console.log("hallo");
    // 	console.log(myarguments);
    // 	for(var i=0; i < myarguments.length; i+=2){
    // 		C_Resources.Queue.push({type:"img",name:myarguments[i],src:myarguments[i+1]});
    // 	}
    // 	return this;
    // }
    //===================================================
    // Loading
    C_Resources.loadTexture = function (name, src) {
        for (var i = 0; i < arguments.length; i += 2) {
            C_Resources.Queue.push({ type: "img", name: arguments[i], src: arguments[i + 1] });
        }
        return this;
    };
    // too do
    C_Resources.loadVideoTexture = function (name, src) {
        var myarguments = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            myarguments[_i - 2] = arguments[_i];
        }
        console.log("too do");
        for (var i = 0; i < myarguments.length; i += 2) {
            C_Resources.Queue.push({ type: "vid", name: myarguments[i], src: myarguments[i + 1] });
        }
        return this;
    };
    //===================================================
    // Manage Queue
    C_Resources.loadNextItem = function () {
        //.......................................
        if (C_Resources.Queue.length == 0) {
            if (C_Resources.onComplete != null)
                C_Resources.onComplete();
            else
                console.log("Resource Download Queue Complete");
            return;
        }
        //.......................................
        var itm = C_Resources.Queue.pop();
        switch (itm.type) {
            case "img":
                var img = new Image();
                img.queueData = itm;
                img.onload = C_Resources.onDownloadSuccess;
                img.onabort = img.onerror = C_Resources.onDownloadError;
                img.src = itm.src;
                break;
            case "vid":
                var vid = document.createElement("video");
                vid.style.display = "none";
                document.body.appendChild(vid);
                //vid.addEventListener("canplaythrough", videoReady, true); //When enough video is available to start playing
                //vid.addEventListener("ended", videoComplete, true);			//WHen video is done.
                vid.queueData = itm;
                vid.addEventListener("loadeddata", C_Resources.onDownloadSuccess, false);
                vid.onabort = vid.onerror = C_Resources.onDownloadError;
                vid.autoplay = true;
                vid.loop = true;
                vid.src = itm.src;
                vid.load();
                vid.play();
                C_Resources.Videos[itm.name] = vid;
                break;
        }
    };
    //===================================================
    // tagName:any;
    // Event Handlers
    C_Resources.onDownloadSuccess = function () {
        console.log(this);
        //Its an image, lets load it up as a texture in gl.
        if (this instanceof Image || this.tagName == "VIDEO") {
            var dat = this.queueData;
            C_Resources.gl.fLoadTexture(dat.name, this);
        }
        C_Resources.loadNextItem();
    };
    C_Resources.onDownloadError = function () {
        console.log("Error getting ", this);
        C_Resources.loadNextItem();
    };
    C_Resources.onComplete = null;
    C_Resources.Queue = [];
    C_Resources.Images = [];
    C_Resources.Videos = [];
    return C_Resources;
}());
// var C_Resources.Queue = [];
// C_Resources.onComplete = null;
// C_Resources.gl = null;
// C_Resources.Images = [];
// C_Resources.Videos = [];
//# sourceMappingURL=Resources.js.map