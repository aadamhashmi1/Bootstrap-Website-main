export class Ball {
    constructor(x, y, width, height, velocityX, velocityY) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.velocityX = velocityX;
        this.velocityY = velocityY;
    }

    move() {
        this.x += this.velocityX;
        this.y += this.velocityY;

        // Reverse direction if hitting top or bottom
        if (this.y <= 0 || this.y + this.height >= 500) {
            this.velocityY *= -1;
        }

        // Reverse direction if hitting left or right
        if (this.x <= 0 || this.x + this.width >= 500) {
            this.velocityX *= -1;
        }
    }
}
