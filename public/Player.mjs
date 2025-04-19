const avatarWidth = 10;
const avatarHeight = 10;

class Player {
  constructor({x, y, score, id}) {
    this.x = x;
    this.y = y;
    this.score = score;
    this.id = id;
    this.movePlayer = this.movePlayer.bind(this);
    this.collision = this.collision.bind(this);
    this.calculateRank = this.calculateRank.bind(this);
    this.w = avatarWidth;
    this.h = avatarHeight;
  }

  static get avatarWidth(){
    return avatarWidth;
  }

  static get avatarHeight(){
    return avatarHeight;
  }

  movePlayer(dir, speed) {
    switch(dir){
      case "up":
        if(this.y - speed >= 0)
          this.y -= speed;
        break;
      case "down":
        if(this.y + speed <= 480)
          this.y += speed;
        break;
      case "right":
        if(this.x + speed <= 640)
          this.x += speed;
        break;
      case "left":
        if(this.x - speed >= 0)
          this.x -= speed;
    }
  }

  collision(item) {
    
    if(this.x - item.x <= 2 * item.r && item.x - this.x <= this.w && item.y - this.y <= this.h && this.y - item.y <= 2 * item.r){
      this.score += item.value;
      //item.moveCollectible();
      return true;
    }
    
    return false;
  }

  calculateRank(arr) {
      const sortedArr = arr.sort((a, b) => b.score - a.score);
      const pos = sortedArr.findIndex(a => a.id == this.id) + 1;
      return `Rank: ${pos}/${arr.length}`;
  }

  avatar(ctx, active = false){
    if(active)
      ctx.fillStyle = "blue";
    else
      ctx.fillStyle = "grey";

    ctx.fillRect(this.x, this.y, this.w, this.h);
  }

}

export default Player;
