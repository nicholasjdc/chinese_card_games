export class Card {
    number: number;
    color: String;
    suit: String;
    id: String;
    constructor(number, color, suit, id){
        this.number = number
        this.color = color
        this.suit = suit
        this.id = id
    }
}

export class Deck{
    cards: Card[];
    constructor(cards){
        this.cards = cards
    }
}

export class Player{
    id: String;
    hand: Card[];
    gameData: {};
    constructor(id, hand, gameData){ //string, list of card objects, map
        this.id = id
        this.hand = hand
        this.gameData = gameData
    }
}
export class Team{
    id: String;
    players: Player[];
    constructor(id, players){ //string, list of Player objects
        this.id = id
        this.players = players
    }
}
function makeCard(number, color, suit){
    let id = number.toString() +color +suit
    let newCard = new Card(number, color, suit, id)
    return newCard
}

function makeDeck(availNumbers, availSuits, suitColorMap){ //list, list, map
    let currDeck = []
    for(let i =0 ; i<availNumbers.length; i++){
        for(let j =0; j <availSuits.length;j++){
            let suit = availSuits[j]
            currDeck.push(makeCard(availNumbers[i], suitColorMap[suit], suit))
        }
    }
    let newDeck = new Deck(currDeck)
    return newDeck
}
function modifyDeck(keyword, data, oldDeck){
    if(keyword == 'multiplyDeck'){
        let dupDeck = oldDeck.cards
        oldDeck.cards.push.apply(oldDeck.cards, dupDeck)
    }else if(keyword == 'addCards'){
        oldDeck.cards.push.apply(oldDeck.cards, data)
    }else if(keyword == 'removeCards'){
        for(let i = 0;i<data.length; i++){
            let searchId = data[i]
            let idx = oldDeck.cards.map(e => e.id).indexOf(searchId)
            oldDeck.cards.splice(idx,1)
        }
    }
}
function shallowEqual(object1, object2) {
    const keys1 = Object.keys(object1);
    const keys2 = Object.keys(object2);
  
    if (keys1.length !== keys2.length) {
      return false;
    }
  
    for (let key of keys1) {
      if (object1[key] !== object2[key]) {
        return false;
      }
    }
  
    return true;
}
function deal(startIdx, endIdx, deck, player){
    console.log(deck.cards.slice(startIdx, endIdx))
    player.hand.push(deck.cards.slice(startIdx, endIdx))
    deck.cards.splice(endIdx, (endIdx-startIdx))
}
function dealTop(deck, player){
    let topCard = deck.cards.pop()
    player.hand.push(topCard)
}
export{
    deal,
    dealTop,
    shallowEqual,
    modifyDeck,

}
let numbers = [2,3,4,5,6,7,8,9,10,11,12,13,14] //2 - Ace
let suitColorMap = {'d':'r','h':'r','c':'b','s':'b'} //red, black
let suits = ['d','h','c','s'] //diamond, heart, club, spade, small joker, big joker