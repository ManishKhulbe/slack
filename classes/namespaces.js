class Namespace{
    constructor(id , nsTitle , img , endPoint){
        this.id = id,
        this.img = img,
        this.nsTitle = nsTitle,
        this.endPoint = endPoint
        this.rooms = []
    }

    addRoom(roomObj){
        this.rooms.push(roomObj)
    }
}

module.exports = Namespace