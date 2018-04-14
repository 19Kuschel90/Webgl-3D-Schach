
class C_MoveBot{
   private TragetVec:C_Vector3;
   private MyObjectTransform:C_Transform;
   private isRun:boolean;
    constructor( 
        ObjectTransform:C_Transform = new C_Transform()
        ,TragetVec:C_Vector3 = new C_Vector3(0,0,0)      
        ,imRun:boolean = false
) {
        this.TragetVec = new C_Vector3(0,0,0);
        this.MyObjectTransform = ObjectTransform;
        this.isRun = imRun;
    }


    Update():void{

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