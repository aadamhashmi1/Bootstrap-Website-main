export class Block {
    constructor(x, y, width, height, breakable, imageSrc) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.break = breakable;
        this.image = new Image();
        this.image.src = imageSrc;
    }
}
