
class C_MoveBot{
    private MyObjectTransform:C_Transform;
   private TragetVec:C_Vector3;
   private isRun:boolean;
   private speed:number = 1;
    constructor( 
        ObjectTransform:C_Transform = new C_Transform()
        ,TragetVec:C_Vector3 = new C_Vector3(0,0,0)      
        ,imRun:boolean = false
        ,Speed:number = 1
    ) {
        this.MyObjectTransform = ObjectTransform;
        this.TragetVec = TragetVec;
        this.isRun = imRun;
        this.speed = Speed;
    }


    Update():void{
        console.log(this.MyObjectTransform.position.x);
        console.log(this.TragetVec.x);
        if(this.MyObjectTransform.position.x === this.TragetVec.x)
        {
            
        }else{
            if(this.MyObjectTransform.position.x < this.TragetVec.x)
            {
                this.MoveX(1);               
            }else{
                 this.MoveX(-1);
            }
        }
        if(this.MyObjectTransform.position.z === this.TragetVec.z)
        {

        }else{
            if(this.MyObjectTransform.position.z < this.TragetVec.z)
            {
                this.MoveZ(1);               
            }else{
                 this.MoveZ(-1);
            }
        }
    }


    // step * speed
    MoveZ(step:number){
        this.MyObjectTransform.position.z += step * this.speed;
    }

    // step * speed
    MoveX(step:number){
        this.MyObjectTransform.position.x += step * this.speed;
    }

    // step * speed
    MoveY(step:number){
        this.MyObjectTransform.position.y += step * this.speed;
    }
 
    ////////////////////////////////////////////
    GetSpeed():number{
         return this.speed;
    }

    SetSpeed(Speed:number){
        this.speed = Speed;
    }

//////////////////////////////////////////////////////
    GetMyObjectTransform():C_Transform{
        return this.MyObjectTransform;
    }
    SetMyObjectTransform(newTransform:C_Transform):void{
        this.MyObjectTransform = newTransform;
    }
    /////////////////////////////////////////////////////
    GetPosition():C_Vector3{
        return this.MyObjectTransform.position;
    }
    SetPosition(NewVector:C_Vector3):void{
        this.MyObjectTransform.position = NewVector;
    }
}