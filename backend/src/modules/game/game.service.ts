import { WebSocketServer, WebSocket } from 'ws';
import { GameState, PaddleMovement } from './game.types';

export class GameService {
    private wss: WebSocketServer;
    private gameState: GameState;
    private clients: Set<WebSocket>;
    private gameInterval: NodeJS.Timeout;

    constructor() {
        this.gameState = {
            ballX: 400,
            ballY: 300,
            ballSpeedX: 5,
            ballSpeedY: 5,
            paddle1Y: 250,
            paddle2Y: 250,
            score1: 0,
            score2: 0,
        };
        this.clients = new Set<WebSocket>();
    }

    public initialize(wss: WebSocketServer): void {
        this.wss = wss;

        this.gameInterval = setInterval(this.gameLoop.bind(this), 1000 / 60);

        this.wss.on("connection", this.handleConnection.bind(this));
    }

    private handleConnection(ws: WebSocket, req: any): void {
        console.log(`Client connected to ${req.url}`);
        this.clients.add(ws);

        ws.on('message', (msg: Buffer) => {
            try {
                const data: PaddleMovement = JSON.parse(msg.toString());
                this.handlePaddleMovement(data, ws);
            } catch (e) {
                console.error('Invalid message received:', e);
            }
        });

        ws.on('close', () => {
            console.log(`Client disconnected from ${req.url}`);
            this.clients.delete(ws);
        });

        ws.on('error', (error) => {
            console.error(`WebSocket error on ${req.url}:`, error);
            this.clients.delete(ws);
        });

        ws.send(JSON.stringify({ message: 'Welcome to Pong WebSocket!', ...this.gameState }));
    }

    private handlePaddleMovement(data: PaddleMovement, ws: WebSocket): void {
        if (data.paddle === 1) this.gameState.paddle1Y = data.y;
        if (data.paddle === 2) this.gameState.paddle2Y = data.y;
    }

    private gameLoop(): void {
        // Update ball position
        this.gameState.ballX += this.gameState.ballSpeedX;
        this.gameState.ballY += this.gameState.ballSpeedY;

        // Bounce off top and bottom walls
        if (this.gameState.ballY <= 0 || this.gameState.ballY >= 600) {
            this.gameState.ballSpeedY = -this.gameState.ballSpeedY;
        }

        // paddle collision
        if (
            this.gameState.ballX <= 20 &&
            this.gameState.ballY >= this.gameState.paddle1Y &&
            this.gameState.ballY <= this.gameState.paddle1Y + 100
        ) {
            this.gameState.ballSpeedX = -this.gameState.ballSpeedX;
        }

        if (
            this.gameState.ballX >= 780 &&
            this.gameState.ballY >= this.gameState.paddle2Y &&
            this.gameState.ballY <= this.gameState.paddle2Y + 100
        ) {
            this.gameState.ballSpeedX = -this.gameState.ballSpeedX;
        }

        // Score update and reset ball if out of bounds
        if (this.gameState.ballX < 0) {
            this.gameState.score2++;
            this.resetBall();
        }

        if (this.gameState.ballX > 800) {
            this.gameState.score1++;
            this.resetBall();
        }

        // Broadcast game state to all connected clients
        const stateStr = JSON.stringify(this.gameState);
        this.clients.forEach(client => {
            if (client.readyState === 1) { // Use 1 for WebSocket.OPEN
                try {
                    client.send(stateStr);
                } catch (error) {
                    console.error('Error sending message to client:', error);
                    this.clients.delete(client);
                }
            }
        });
    }

    private resetBall(): void {
        this.gameState.ballX = 400;
        this.gameState.ballY = 300;
        this.gameState.ballSpeedX = -this.gameState.ballSpeedX;
        this.gameState.ballSpeedY = Math.random() > 0.5 ? 5 : -5;
    }

    public cleanup(): void {
        clearInterval(this.gameInterval);
        this.clients.forEach(client => {
            if (client.readyState === 1) {
                client.close();
            }
        });
        this.clients.clear();
    }
}
