
class C_Feld {
    private feldNumber:string = "";
    constructor() {
        this.feldNumber;
    }

    // only for Feld
    public GetFeldcolor():number
    {
      return  ((<number>this.toNumber(this.feldNumber[0])) + Number(this.feldNumber[1])) % 2;
    }

    public SetFeld(X:number, Y:number):void
    {
      this.feldNumber = String((<string>this.toNumber(X)));
      this.feldNumber += String(Y);
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
        return -1;
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
      return -1;// only by error
  }
  
}