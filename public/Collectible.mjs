const collectibleRadius = 3;

class Collectible {
  constructor({x, y, value, id}) {
    this.x = x;
    this.y = y;
    this.value = value;
    this.id = id;
    this.r = collectibleRadius;
    //this.move = this.move.bind(this);
  }
  /*
  moveCollectible(){
    this.x = Math.floor(Math.random() * 640 - collectibleWidth);
    this.y = Math.floor(Math.random() * 480 - collectibleHeight);
    this.value = Math.floor(Math.random() * 5);
  }
  */
  
  static get collectibleRadius(){
    return collectibleRadius;
  }

  draw(ctx){
    ctx.fillStyle = "orange";
    ctx.beginPath();
    ctx.arc(this.x + this.r, this.y + this.r, this.r, 0, 2 * Math.PI);
    ctx.fill();
  }

}

/*
  Note: Attempt to export this for use
  in server.js
*/
try {
  module.exports = Collectible;
} catch(e) {}

export default Collectible;
