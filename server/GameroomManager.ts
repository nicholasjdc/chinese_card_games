const crypton = require("node:crypto");

const randomId= (): string => crypton.randomBytes(8).toString("hex");

class Player {
    userID: string;
    sessionID: string;
    username: string;
    
    constructor(id= randomId(),sessionID, username=randomId() ){
      this.userID = id;
      this.sessionID = sessionID;
      this.username = username;
    }
    updatePlayer(data:{}) {
      if (data['userID']){
        this.userID=data['userID']
      }
      if(data['sessionID']){
        this.sessionID=data['sessionID']
      }
      if(data['username']){
        this.username=data['username']
      }
    }


}
class Gameroom {
    id: string;
    players: Map<string, Player>;
    rules:{};
    game_name: string;

    constructor(id=randomId(), players= new Map(), rules={}, game_name = "Hit Eighty") {
      this.id = id;
      this.players = players;
      this.rules=rules;
      this.game_name= game_name;
    }
    updateGameroom(data:{}) {
      if (data['id']){
        this.id=data['id']
      }
      if(data['players']){
        for (const [key, value] of Object.entries(data['players'])) {
          if(this.players.get(key)){
            this.players.get(key).updatePlayer(value)
          }else{
            let newPlayer = new Player(key['userID'], key['sessionID'], key['username'])
            this.players.set(key['userID'], newPlayer)
          }
        }

        this.players=data['sessionID']
      }
      if(data['game_name']){
        this.game_name=data['game_name']
      }
      if(data['rules']){
        this.rules=data['rules']
      }
    }
    updatePlayer(id:string, data:{}){
      this.players.get(id).updatePlayer(data)
    }
    updateGameName(newGN:string){
      this.game_name =newGN
    }
    updateRules(newRules:string){
      this.rules= newRules
    }
    getPlayer(id:string){
      return this.players.get(id)
    }

}

  
  export class GameroomManager{
    rooms:Map<string, Gameroom>;
    constructor() {
      this.rooms = new Map();
    }
  
    findRoom(id: string) {
      return this.rooms.get(id);
    }
    newRoom(id:string){
      const newGameroom = new Gameroom(id)
      this.rooms.set(id, newGameroom);

    }
    setRoom(id: string, room:Gameroom) {
      if (Object.keys(room).length <= 0){
        const newGameroom = new Gameroom(id)

      }else{
        this.rooms.set(id, room);
      }
    }
    updateGameRoom(id:string, data:{}){
      if(this.rooms.get(id)){
        console.log(this.rooms.get(id))
        this.rooms.get(id).updateGameroom(data)
      }else{


      }
    }
  
    findAllRooms() {
      return [...this.rooms.values()];
    }
  }
  
  module.exports = {
    GameroomManager
  };
  