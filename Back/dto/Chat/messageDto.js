class MessageDto {
  constructor({ IDMESSAGE, SENDERID, RECEIVERID, IMAGEURL, TIMESTAP, MESSAGETEXT }) {
    this.id = IDMESSAGE;
    this.senderId = SENDERID;
    this.receiverId = RECEIVERID;
    this.imageUrl = IMAGEURL;
    this.timestamp = TIMESTAP;
    this.messageText = MESSAGETEXT;
  }
}

module.exports = MessageDto; 