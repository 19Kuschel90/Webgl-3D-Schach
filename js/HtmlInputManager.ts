class  C_InputManager {
  public atlasLink:string = "../image/c62bb9b27329447cb2b937fe6213889a.jpg";
  public startPos:C_Vector3 = new C_Vector3(8,15,-20);
  public canvasSizeW:number = 600;
  public canvasSizeH:number = 600;
  private isYourTure:boolean = true;
  private wasFisrtTure:boolean = false;
  constructor() {
  }
  update():void{
    this.startPos.x = Number((<HTMLInputElement>document.getElementById("SX")).value);
    this.startPos.y = Number((<HTMLInputElement>document.getElementById("SY")).value);
    this.startPos.z = Number((<HTMLInputElement>document.getElementById("SZ")).value);
    this.canvasSizeW =  Number((<HTMLInputElement>document.getElementById("canvasSizeW")).value)
    this.canvasSizeH =  Number((<HTMLInputElement>document.getElementById("canvasSizeH")).value)
  }
  
  public  move():void{
    gRuls.isMoveOK("B1",gFigure[10], "B3");
  }
  
  public setOptionsInHtml(ID:string, state:string):void
  {
    var x = document.createElement("OPTION");
    x.setAttribute("value", String(Number(ID) -1));
    var t = document.createTextNode(state + ID);
    x.appendChild(t);
    (<HTMLSelectElement>document.getElementById("PlayerSelect")).appendChild(x);
  }
  
  public CreateNewMoveOption(X: number, Y: number):void {
  var x = document.createElement("OPTION");
  x.setAttribute("value", String(String(X) + String(Y)));  
  var t = document.createTextNode(String(X) + String(Y));
  x.appendChild(t);
  (<HTMLSelectElement>document.getElementById("PlayerCanMove")).appendChild(x);
}

public removeOldMoveOptions():void {
  if (this.wasFisrtTure) {
    while ((<HTMLSelectElement>document.getElementById("PlayerCanMove")).firstChild) {
      (<Node>(<any>document.getElementById("PlayerCanMove")).removeChild((<HTMLSelectElement>document.getElementById("PlayerCanMove")).firstChild));
    }
  }
      this.wasFisrtTure = true;
  }
}

class C_ruls{
 private feld:string[][] = [
  ["","","","","","","",""],
  ["","","","","","","",""],
  ["","","","","","","",""],
  ["","","","","","","",""],
  ["","","","","","","",""],
  ["","","","","","","",""],
  ["","","","","","","",""],
  ["","","","","","","",""]];
  private WorkPos:number[] = []; // temp figure Pos
  private WorkPosTarget:number[] = []; // temp traget pos
  constructor() {
    this.feld;
    this.WorkPos;
  }
  /**
   * SetOnfeld
   */
  public SetOnfeld(state:string, ID:number, targetA:number,targetB:number ) {
    this.feld[targetA][targetB] = state + String(ID);
  }

  public getFeld():string[][]
  {
    return this.feld;
  }

  public isMoveOK(pos:string, figure:C_GameObject, target:string):boolean {
  // toodo Fals
    this.MoveOK([Number(this.toNumber(pos[0])), Number(pos[1])], figure,[Number( target[0]), Number(target[1])] );
    return true;
  }
public iCanMove(figure:C_GameObject) {
  
  if(figure.GetState() ==  "WB" || "BB")
  {
      this.iCanBauerMove(figure.GetFeldNumber(), figure.GetfristMove(),figure.GetState());
  }
}

  // A1 to array number [1][1]
  private SetWorkPos(pos:string):void
  {
    console.log(pos);
    this.WorkPos[0] = Number(<number>this.toNumber(pos[0]))-1;
    this.WorkPos[1] = Number(pos[1]);
  }

  private SetWorkToString(pos:Number[]):string
  {
    console.log(pos);
   var a = String(<String>this.toNumber((<number>pos[0])));
   var b = String(pos[1]);
   var temp = a + b;
   return  temp;
  }

  private iCanBauerMove(feldNumber:string, fristmove:boolean, site:string) {

    this.restOldSelect();
    this.SetWorkPos(feldNumber);
    if("WB" == site)
    {
      this.SetSelectFeld(this.WorkPos[0],this.WorkPos[1]-1 );
      if(fristmove == false){
        this.SetSelectFeld(this.WorkPos[0],this.WorkPos[1]-2 );
      }
    }else{ 
      this.SetSelectFeld(this.WorkPos[0],this.WorkPos[1]+1 );
      if(fristmove == false){
        this.SetSelectFeld(this.WorkPos[0],this.WorkPos[1]+2 );
      }
    }
  }
  
  private restOldSelect():void {
    for(var X = 0; X < this.feld.length;X++ )
   { 
     for(var Y = 0; Y < this.feld.length;Y++ )
     {
       if(this.feld[X][Y] == "X")
       {
         gCubes[X][Y].restColor();
         this.feld[X][Y] = "";
      }
    }
  }
  gInputManager.removeOldMoveOptions();
  }
  

  
  private SetSelectFeld(A:number,B:number):void {
    this.feld[A][B] = "X";
    gCubes[A][B].SetSelctionColor();
    gInputManager.CreateNewMoveOption(A,B);

  }


  private MoveOK(pos:number[],figure:C_GameObject, target:number[]) {
    console.log( pos[0]-1 );
    var temp = this.feld[pos[0]-1][pos[1]];
    
    this.feld[pos[0]-1][pos[1]] = "";
    this.feld[target[0]][target[1]] = temp;
    figure.setPosition( target[0], 1.0, -target[1]);
    gCubes[target[0]][target[1]].restColor();
    this.restOldSelect();
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