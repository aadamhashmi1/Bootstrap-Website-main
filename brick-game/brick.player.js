export class Player {
    constructor(x, y, width, height, velocityX) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.velocityX = velocityX;
        this.direction = 0; // -1 for left, 1 for right
    }

    move() {
        this.x += this.direction * this.velocityX;

        if (this.x < 0) {
            this.x = 0;
        } else if (this.x + this.width > 500) {
            this.x = 500 - this.width;
        }
    }

    reset(x, y) {
        this.x = x;
        this.y = y;
        this.velocityX = 5;
        this.direction = 0;
    }
}
