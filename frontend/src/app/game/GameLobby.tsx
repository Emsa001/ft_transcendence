// src/app/game/GameLobby.tsx
// import { useState, useEffect } from '../../hooks';
// import { useNavigate } from '../../hooks/useNavigate';

import React, { useState, useEffect, useNavigate } from "react";

export const GameLobby = () => {
  const [games, setGames] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [creatingGame, setCreatingGame] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      // navigate('/login');
      return;
    }

    const fetchGames = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/game/available', {
          credentials: 'include'
        });
        const data = await response.json();
        setGames(data);
      } catch (error) {
        console.error('Error fetching games:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGames();

    // Poll for new games
    const interval = setInterval(fetchGames, 5000);
    return () => clearInterval(interval);
  }, [navigate]);

  const createGame = async () => {
    const userId = localStorage.getItem('userId');
    if (!userId) return;

    setCreatingGame(true);
    try {
      const response = await fetch('http://localhost:8000/api/game/create', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        const game = await response.json();
        navigate(`/game/${game.id}`);
      }
    } catch (error) {
      console.error('Error creating game:', error);
    } finally {
      setCreatingGame(false);
    }
  };

  const joinGame = async (gameId: number) => {
    const userId = localStorage.getItem('userId');
    if (!userId) return;

    try {
      const response = await fetch(`http://localhost:8000/api/game/${gameId}/join`, {
        method: 'POST',
        credentials: 'include'
      });

      if (response.ok) {
        navigate(`/game/${gameId}`);
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Failed to join game');
      }
    } catch (error) {
      console.error('Error joining game:', error);
      alert('Failed to join game');
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-gray-900 p-5 rounded-lg m-5">
      <h2 className="text-white text-xl mb-5">Game Lobby</h2>

      <button
        onClick={createGame}
        disabled={creatingGame}
        className="px-4 py-2 bg-green-600 text-white rounded mb-5 disabled:bg-gray-500"
      >
        {creatingGame ? 'Creating...' : 'Create New Game'}
      </button>

      <h3 className="text-white mb-3">Available Games</h3>

      {loading ? (
        <div className="text-gray-400">Loading games...</div>
      ) : games.length === 0 ? (
        <div className="text-gray-400">No available games</div>
      ) : (
        <ul className="space-y-2">
          {games.map(game => (
            <li key={game.id} className="p-3 bg-gray-800 rounded flex justify-between items-center">
              <div>
                <div className="font-bold text-white">Game #{game.id}</div>
                <div className="text-gray-400 text-sm">
                  Created by: {game.player1?.username || 'Unknown'}
                </div>
              </div>
              <button
                onClick={() => joinGame(game.id)}
                className="px-3 py-1 bg-blue-600 text-white rounded text-sm"
              >
                Join Game
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
