class Abstract_game_Engine
{
    constructor(game_type)
    {
        // if(this.constructor===Parent)
        // {
        //     throw new Error("can't instantiate abstract class!");
        // }
        // this.type='parent';
    }
    Drawer(){console.log("We are in Abstract Drawer!");}
    Controller(){console.log("We are in Abstract Controller!");}
    PlayerSwitch(){}
    ChangeState(){//player switch
        //move
        //drawer
    }
}