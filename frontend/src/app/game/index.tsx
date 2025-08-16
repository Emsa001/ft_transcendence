import { LocalGame } from "@features/game/ui/LocalGame";
import React, { useState, useEffect, useRef, useNavigate } from "react";

interface GameProps {
    type?: "local" | "remote";
}

export default function Game({ type }: GameProps) {
    return (
        <div className="flex items-center justify-center h-full text-white">
            {type === "local" ? (
                <LocalGame />
            ) : (
                <div>
                    <h1 className="text-2xl font-bold">
                        Remote Game Mode Coming Soon!
                    </h1>
                    <p className="mt-4">Stay tuned for multiplayer features.</p>
                </div>
            )}
        </div>
    );
}

interface GameState {
  ballX: number;
  ballY: number;
  paddle1Y: number;
  paddle2Y: number;
  score1: number;
  score2: number;
  gameActive: boolean;
  player1Id: number | null;
  player2Id: number | null;
  gameId: number;
  maxScore: number;
}

interface GameConfig {
  width: number;
  height: number;
  paddleHeight: number;
  paddleWidth: number;
  ballSize: number;
}

const PONG_CONFIG: GameConfig = {
  width: 800,
  height: 600,
  paddleHeight: 100,
  paddleWidth: 15,
  ballSize: 10
};

export const RemoteGame = ({ gameId }: { gameId?: string }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const navigate = useNavigate();
  const [gameState, setGameState] = useState<GameState>({
    ballX: PONG_CONFIG.width / 2,
    ballY: PONG_CONFIG.height / 2,
    paddle1Y: PONG_CONFIG.height / 2 - PONG_CONFIG.paddleHeight / 2,
    paddle2Y: PONG_CONFIG.height / 2 - PONG_CONFIG.paddleHeight / 2,
    score1: 0,
    score2: 0,
    gameActive: false,
    player1Id: null,
    player2Id: null,
    gameId: gameId ? parseInt(gameId) : 0,
    maxScore: 5
  });

  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'blocked'>('connecting');
  const [playerNumber, setPlayerNumber] = useState<number | null>(null);
  const ws = useRef<WebSocket | null>(null);
  const animationFrameId = useRef<number>(0);

  // Draw game function
  const drawGame = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = '#444';
    ctx.lineWidth = 2;
    ctx.setLineDash([10, 10]);
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = '#fff';
    ctx.fillRect(10, gameState.paddle1Y, PONG_CONFIG.paddleWidth, PONG_CONFIG.paddleHeight);
    ctx.fillRect(canvas.width - PONG_CONFIG.paddleWidth - 10, gameState.paddle2Y, PONG_CONFIG.paddleWidth, PONG_CONFIG.paddleHeight);

    ctx.beginPath();
    ctx.arc(gameState.ballX, gameState.ballY, PONG_CONFIG.ballSize / 2, 0, Math.PI * 2);
    ctx.fill();

    ctx.font = '32px Arial';
    ctx.fillStyle = '#eee';
    ctx.textAlign = 'center';
    ctx.fillText(`${gameState.score1} - ${gameState.score2}`, canvas.width / 2, 40);

    ctx.font = '16px Arial';
    ctx.fillStyle = connectionStatus === 'connected' ? '#4CAF50' : '#F44336';
    ctx.fillText(
      connectionStatus === 'connected' ? 'Connected' :
      connectionStatus === 'blocked' ? 'Blocked by browser CSP' :
      'Disconnected',
      canvas.width / 2,
      80
    );

    if (playerNumber) {
      ctx.fillStyle = '#fff';
      ctx.font = '16px Arial';
      ctx.textAlign = playerNumber === 1 ? 'left' : 'right';
      ctx.fillText(`You: Player ${playerNumber}`, playerNumber === 1 ? 20 : canvas.width - 20, canvas.height - 20);
    }

    if (!gameState.gameActive &&
        (gameState.score1 >= gameState.maxScore || gameState.score2 >= gameState.maxScore)) {
      ctx.fillStyle = 'rgba(0,0,0,0.7)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#fff';
      ctx.font = '48px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(gameState.score1 >= gameState.maxScore ? 'Player 1 Wins!' : 'Player 2 Wins!', canvas.width / 2, canvas.height / 2 - 30);
      ctx.font = '24px Arial';
      ctx.fillText('Game Over', canvas.width / 2, canvas.height / 2 + 20);
    }
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!gameState.gameActive || !playerNumber || !ws.current) return;
      const paddleSpeed = 20;
      let newY;

      if (playerNumber === 1) {
        if (e.key === 'ArrowUp') {
          newY = Math.max(0, gameState.paddle1Y - paddleSpeed);
          ws.current.send(JSON.stringify({ paddle: 1, y: newY, gameId: gameState.gameId }));
        } else if (e.key === 'ArrowDown') {
          newY = Math.min(PONG_CONFIG.height - PONG_CONFIG.paddleHeight, gameState.paddle1Y + paddleSpeed);
          ws.current.send(JSON.stringify({ paddle: 1, y: newY, gameId: gameState.gameId }));
        }
      } else if (playerNumber === 2) {
        if (e.key.toLowerCase() === 'w') {
          newY = Math.max(0, gameState.paddle2Y - paddleSpeed);
          ws.current.send(JSON.stringify({ paddle: 2, y: newY, gameId: gameState.gameId }));
        } else if (e.key.toLowerCase() === 's') {
          newY = Math.min(PONG_CONFIG.height - PONG_CONFIG.paddleHeight, gameState.paddle2Y + paddleSpeed);
          ws.current.send(JSON.stringify({ paddle: 2, y: newY, gameId: gameState.gameId }));
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, playerNumber]);

  // WebSocket init
  useEffect(() => {
    let userId = localStorage.getItem('userId');
    if (!userId) {
      userId = Math.floor(Math.random() * 1000000).toString();
      localStorage.setItem('userId', userId);
    }

    const wsUrl = "ws://localhost:8000/ws";
    try {
      ws.current = new WebSocket(wsUrl);

      ws.current.onopen = () => {
        setConnectionStatus('connected');
        ws.current?.send(JSON.stringify({ joinGame: true, playerId: parseInt(userId!, 10), gameId: gameState.gameId }));
      };

      ws.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (!data.message) {
          setGameState(prev => ({ ...prev, ...data }));
          if (!playerNumber) {
            if (data.player1Id === parseInt(userId!, 10)) setPlayerNumber(1);
            else if (data.player2Id === parseInt(userId!, 10)) setPlayerNumber(2);
          }
        } else {
          console.log(data.message);
        }
      };

      ws.current.onclose = () => {
        if (connectionStatus !== 'blocked') setConnectionStatus('disconnected');
      };

      ws.current.onerror = (err) => {
        console.error("WebSocket error:", err);
        setConnectionStatus('blocked'); // mark as blocked by CSP
      };
    } catch (e) {
      console.error("WebSocket could not be created", e);
      setConnectionStatus('blocked');
    }

    const animate = () => {
      drawGame();
      animationFrameId.current = requestAnimationFrame(animate);
    };
    animationFrameId.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId.current);
      if (ws.current && ws.current.readyState === WebSocket.OPEN) ws.current.close();
    };
  }, []);

  return (
    <div className="flex flex-col items-center bg-gray-900 p-5 rounded-lg m-5 max-w-4xl mx-auto">
      <h1 className="text-white text-2xl mb-5">Pong Game {gameId ? `#${gameId}` : ''}</h1>

      <div className="relative">
        <canvas
          ref={canvasRef}
          width={PONG_CONFIG.width}
          height={PONG_CONFIG.height}
          className="bg-black block border border-gray-700"
        />

        <div className="absolute bottom-2 left-0 right-0 text-center text-gray-400 text-sm">
          {playerNumber === 1 ? 'Controls: ↑ ↓' :
           playerNumber === 2 ? 'Controls: W S' :
           connectionStatus === 'blocked' ? 'Connection blocked by browser CSP' :
           'Waiting for player assignment...'}
        </div>
      </div>
    </div>
  );
};
