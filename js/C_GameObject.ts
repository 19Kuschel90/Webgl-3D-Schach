
class C_GameObject  extends C_Modal{
    private feldNumber:string = "";
    private myState:string = "";
    private ID:number = 0;
    private selctionColor = 0.5;
    private color = 0.0;
    private OrColor = 0.0;
    private wasFristMove:boolean = false;
    constructor(meshData:any,_myState:string = "feld") {
      super(meshData);
        this.feldNumber;
        this.ID;
        this.myState  = _myState;
        this.color;
        this.selctionColor;
        this.OrColor;
        this.wasFristMove;
    }

    SetfristMove()
    {
      this.wasFristMove = true;
    }
    GetfristMove():boolean
    {
      return this.wasFristMove;
    }
    public GetColor():number{
       return this.color;
    }

    public  setColor(color:number){
      this.OrColor = this.color;
      this.color = color;
    }

    public  restColor()
    {
      this.color = this.OrColor;
    }

    public   SetSelctionColor():void{
      this.setColor(this.selctionColor);
    }

    SetID(ID:number):void
    {
      this.ID = ID;
    }

    public  GetID():number{
      return this.ID;
    }


    /**
     * GetFeldNumber
     */
    public GetFeldNumber():string {
      return this.feldNumber;
    }

    public SetFeld(X:number, Y:number):void
    {
      this.feldNumber = String(this.toNumber(X));
      this.feldNumber += String(Y);
      this.color =  ((<number>this.toNumber(this.feldNumber[0])) + Number(this.feldNumber[1])) % 2;

    }

    public SetState(state:string):void
    {
      this.myState  = state;
    }
    public GetState():string
    {
        return this.myState;
    }
   
   private  toNumber(char:string | number):number | string{
     if(typeof char === 'string')
     {
       switch(char)
       {
         case "A":
         return 1;
         case "B":
         return 2;
         case "C":
         return 3;
         case "D":
         return 4;
         case "E":
         return 5;
         case "F":
         return 6;
         case "G":
         return 7;
         case "H":
         return 8;
        }
        return -666;
      }else{
      switch(char)
       {
         case 1:
         return "A";
         case 2:
         return "B";
         case 3:
         return "C";
         case 4:
         return "D";
         case 5:
         return "E";
         case 6:
         return "F";
         case 7:
         return "G";
         case 8:
         return "H";
        }
      }
      return -666;// only by error
  }
  
}