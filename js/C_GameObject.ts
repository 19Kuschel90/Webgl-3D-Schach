
class C_GameObject  extends C_Modal{
    private feldNumber:string = "";
    private myState:string = "";
    private ID:number = 0;
    private selctionColor = 1.0;
    private color = 0.0;
    private OrColor = 0.0;
    constructor(meshData:any,_myState:string = "feld") {
      super(meshData);
        this.feldNumber;
        this.ID;
        this.myState  = _myState;
        this.color;
        this.selctionColor;
        this.OrColor;
    }
    GetColor():number{
       return this.color;
    }

    setColor(color:number){
      this.OrColor = this.color;
      this.color = color;
    }

    restColor()
    {
      this.color = this.OrColor;
    }

    SetSelctionColor():void{
      this.setColor(this.selctionColor);
    }

    SetID(ID:number):void
    {
      this.ID = ID;
    }

    GetID():number{
      return this.ID;
    }

    // only for Feld
    public GetFeldcolor():number
    {
      return  ((<number>this.toNumber(this.feldNumber[0])) + Number(this.feldNumber[1])) % 2;
    }

    /**
     * GetFeldNumber
     */
    public GetFeldNumber():string {
      return this.feldNumber;
    }

    public SetFeld(X:number, Y:number):void
    {
      this.feldNumber = String((<string>this.toNumber(X)));
      this.feldNumber += String(Y);
      console.log(this.feldNumber);
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