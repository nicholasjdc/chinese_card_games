export class Room {
    roomName: String;
    players: [];
    host: String;
    gametype: String;

    constructor(roomName: String, players: [], host: String, gametype: String){
        this.roomName = roomName
        this.players = players
        this.host = host
        this.gametype = gametype
    }
}