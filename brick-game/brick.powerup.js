
export class PowerUp {
    constructor(x, y, type, images) {
        this.x = x;
        this.y = y;
        this.width = 20;
        this.height = 20;
        this.velocityY = 2;
        this.type = type;
        this.image = images[type];
    }
}

export function applyPowerUp(powerUp, player, balls, powerUpEffects) {
    if (powerUpEffects.timer) {
        clearTimeout(powerUpEffects.timer);
    }

    switch (powerUp.type) {
        case "long":
            player.width *= 2; // Increase paddle size
            break;
        case "slow":
            balls.forEach(ball => {
                ball.velocityX *= 0.5; // Slow down balls
                ball.velocityY *= 0.5;
            });
            break;
        case "triple":
            if (balls.length === 1) { // Ensure that the triple power-up only works if there is only one ball already
                let newBalls = [];
                for (let i = 0; i < 2; i++) {
                    let newBall = {
                        x: balls[0].x + balls[0].width * (i + 1),
                        y: balls[0].y,
                        width: 10,
                        height: 10,
                        velocityX: balls[0].velocityX * -1, // Add new balls with opposite direction
                        velocityY: balls[0].velocityY
                    };
                    newBalls.push(newBall);
                }
                balls.push(...newBalls);
            }
            break;
    }

    powerUpEffects.timer = setTimeout(() => {
        if (powerUp.type === "long") {
            player.width /= 2; // Reset paddle size
        } else if (powerUp.type === "slow") {
            balls.forEach(ball => {
                ball.velocityX *= 2; // Restore ball speed
                ball.velocityY *= 2;
            });
        }
        // No reset needed for triple balls as they remain
    }, 10000); // Power-up lasts for 10 seconds
}
