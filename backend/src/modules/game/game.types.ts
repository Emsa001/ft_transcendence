
export interface GameState {
    ballX: number;
    ballY: number;
    ballSpeedX: number;
    ballSpeedY: number;
    paddle1Y: number;
    paddle2Y: number;
    score1: number;
    score2: number;
}

export interface PaddleMovement {
    paddle: number;
    y: number;
}
