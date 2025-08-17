import { WebSocketServer, WebSocket } from 'ws';
import { GameState, PaddleMovement } from './game.types';

/* 
    maybe have more balls
    Make in a nice way that is escalable 
*/

export class GameService {
    // === Properties ===
    private wss: WebSocketServer;
    private gameState: GameState;
    private clients: Set<WebSocket>; // store all connected clients
    private gameInterval: NodeJS.Timeout; // timer for the game loop
    private paused: boolean = false;

    // === Constructor ===
    constructor() {
        // Initialize the default game state
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

        // Set to hold all connected WebSocket clients
        this.clients = new Set<WebSocket>();
    }

    // === Initialize the GameService with WebSocketServer ===
    public initialize(wss: WebSocketServer): void {
        this.wss = wss;

        // Start the game loop at 60 FPS
        // probably don't need to do in a frequency, but only when receive input

        this.gameInterval = setInterval(this.gameLoop.bind(this), 1000 / 60);

        // Listen for new connections
        this.wss.on("connection", this.handleConnection.bind(this));
    }

    // === Handle new WebSocket connections ===
    private handleConnection(ws: WebSocket, req: any): void {
        console.log(`Client connected to ${req.url}`);
        this.clients.add(ws);

        // Handle messages from clients
        ws.on('message', (msg: Buffer) => {
            try {
                const data: PaddleMovement = JSON.parse(msg.toString());
                this.handleClientMessage(data, ws);
            } catch (e) {
                console.error('Invalid message received:', e);
            }
        });

        // Remove client on disconnect or error
        ws.on('close', () => this.clients.delete(ws));
        ws.on('error', () => this.clients.delete(ws));

        // Send initial game state
        ws.send(JSON.stringify({ message: 'Welcome to Pong WebSocket!', ...this.gameState }));
    }

    // === Broadcast a message to all clients ===
    private broadcast(data: any) {
        const stateStr = JSON.stringify(data);
        this.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(stateStr);
            }
        });
    }

    // === Handle messages from clients (paddle movement or pause/resume) ===
    private handleClientMessage(data: PaddleMovement, ws: WebSocket): void {
        // Paddle movement
        if (data.paddle === 1 && data.y !== undefined) this.gameState.paddle1Y = data.y;
        if (data.paddle === 2 && data.y !== undefined) this.gameState.paddle2Y = data.y;

        // Pause / Resume
        if (data.action === 'pause') {
            this.paused = true;
            this.broadcast({ message: 'Game Paused' });
        }
        if (data.action === 'resume') {
            this.paused = false;
            this.broadcast({ message: 'Game Resumed' });
        }
    }

    // === Main game loop (runs 60 times per second) ===
    private gameLoop(): void {
        if (this.paused) return; // skip updating if paused

        // Move the ball
        this.gameState.ballX += this.gameState.ballSpeedX;
        this.gameState.ballY += this.gameState.ballSpeedY;

        // Bounce off top and bottom walls
        if (this.gameState.ballY <= 0 || this.gameState.ballY >= 600) {
            this.gameState.ballSpeedY = -this.gameState.ballSpeedY;
        }

        // Paddle collision
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

        // Check for scoring and reset ball if necessary
        if (this.gameState.ballX < 0) {
            this.gameState.score2++;
            this.resetBall();
        }
        if (this.gameState.ballX > 800) {
            this.gameState.score1++;
            this.resetBall();
        }

        // Broadcast the updated game state
        this.broadcast(this.gameState);
    }

    // === Reset the ball to the center with random vertical direction ===
    private resetBall(): void {
        this.gameState.ballX = 400;
        this.gameState.ballY = 300;
        this.gameState.ballSpeedX = -this.gameState.ballSpeedX; // send to scorer
        this.gameState.ballSpeedY = Math.random() > 0.5 ? 5 : -5; // random vertical direction
    }

    // === Clean up the game service and close all clients ===
    public cleanup(): void {
        clearInterval(this.gameInterval);
        this.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) client.close();
        });
        this.clients.clear();
    }
}
