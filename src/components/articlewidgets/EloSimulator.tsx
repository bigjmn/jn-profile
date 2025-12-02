'use client'
import React, { useState, useEffect, useRef, useCallback } from 'react';

interface Piece {
  trueRating: number;
  shownRating: number;
}

interface Position {
  row: number;
  col: number;
}

interface MatchPair {
  piece1: Position;
  piece2: Position;
}

type Board = (Piece | null)[][];

const EloSimulator: React.FC = () => {
  const [setupBoard, setSetupBoard] = useState<Board>(() => 
    Array(8).fill(null).map(() => Array(8).fill(null))
  );
  const [simulationBoard, setSimulationBoard] = useState<Board>(() => 
    Array(8).fill(null).map(() => Array(8).fill(null))
  );
  
  const [selectedRating, setSelectedRating] = useState<number>(1400);
  const [isSimulationRunning, setIsSimulationRunning] = useState<boolean>(false);
  const [matchCount, setMatchCount] = useState<number>(0);
  const [simulationSpeed, setSimulationSpeed] = useState<number>(500);
  const [kFactor, setKFactor] = useState<number>(32);
  const showHighlights = false;
  const fastMode = true;
  const usesMeanStart = true;
  const [highlightedCells, setHighlightedCells] = useState<string[]>([]);

  const simulationIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const availableRatings: number[] = [500, 800, 1100, 1400, 1700, 2000, 2300];
  
  const ratingColors: Record<number, string> = {
    500: '#0000ff',   // Blue
    800: '#0066ff',   // Light Blue
    1100: '#00ccff',  // Cyan
    1400: '#00ff00',  // Green
    1700: '#ffff00',  // Yellow
    2000: '#ff6600',  // Orange
    2300: '#ff0000'   // Red
  };

  const getRatingColor = useCallback((rating: number): string => {
    if (rating <= availableRatings[0]) return ratingColors[availableRatings[0]];
    if (rating >= availableRatings[availableRatings.length - 1]) return ratingColors[availableRatings[availableRatings.length - 1]];
    
    for (let i = 0; i < availableRatings.length - 1; i++) {
      if (rating >= availableRatings[i] && rating <= availableRatings[i + 1]) {
        const ratio = (rating - availableRatings[i]) / (availableRatings[i + 1] - availableRatings[i]);
        return interpolateColor(ratingColors[availableRatings[i]], ratingColors[availableRatings[i + 1]], ratio);
      }
    }
    
    return ratingColors[1400];
  }, [availableRatings, ratingColors]);

  const interpolateColor = (color1: string, color2: string, ratio: number): string => {
    const hex1 = color1.replace('#', '');
    const hex2 = color2.replace('#', '');
    
    const r1 = parseInt(hex1.substr(0, 2), 16);
    const g1 = parseInt(hex1.substr(2, 2), 16);
    const b1 = parseInt(hex1.substr(4, 2), 16);
    
    const r2 = parseInt(hex2.substr(0, 2), 16);
    const g2 = parseInt(hex2.substr(2, 2), 16);
    const b2 = parseInt(hex2.substr(4, 2), 16);
    
    const r = Math.round(r1 + (r2 - r1) * ratio);
    const g = Math.round(g1 + (g2 - g1) * ratio);
    const b = Math.round(b1 + (b2 - b1) * ratio);
    
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  };

  const calculateMeanRating = useCallback((): number => {
    let totalRating = 0;
    let pieceCount = 0;
    
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        if (setupBoard[row][col]) {
          totalRating += setupBoard[row][col]!.trueRating;
          pieceCount++;
        }
      }
    }
    
    return pieceCount > 0 ? Math.round(totalRating / pieceCount) : 1400;
  }, [setupBoard]);

  const handleCellClick = (row: number, col: number): void => {
    console.log('=== Cell clicked ===', row, col, 'isSimulationRunning:', isSimulationRunning);
    console.log('Current cell value:', setupBoard[row][col]);
    if (isSimulationRunning) return;
    
    setSetupBoard(prev => {
      console.log('Previous board state at', row, col, ':', prev[row][col]);
      const newBoard = prev.map(boardRow => [...boardRow]); // Deep copy
      if (newBoard[row][col]) {
        console.log('REMOVING piece at', row, col);
        newBoard[row][col] = null;
      } else {
        console.log('ADDING piece at', row, col, 'with rating:', selectedRating);
        newBoard[row][col] = {
          trueRating: selectedRating,
          shownRating: selectedRating
        };
      }
      console.log('New board state at', row, col, ':', newBoard[row][col]);
      console.log('=== End cell click ===');
      return newBoard;
    });
  };

  const copySetupToSimulation = useCallback((): void => {
    const startingRating = usesMeanStart ? calculateMeanRating() : 1400;
    
    setSimulationBoard(prev => {
      const newBoard = [...prev];
      for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
          if (setupBoard[row][col]) {
            newBoard[row][col] = {
              trueRating: setupBoard[row][col]!.trueRating,
              shownRating: startingRating
            };
          } else {
            newBoard[row][col] = null;
          }
        }
      }
      return newBoard;
    });
  }, [setupBoard, usesMeanStart, calculateMeanRating]);

  const findValidPairs = useCallback((): MatchPair[] => {
    const pairs: MatchPair[] = [];
    
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        if (!simulationBoard[row][col]) continue;
        
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            if (dr === 0 && dc === 0) continue;
            
            const newRow = row + dr;
            const newCol = col + dc;
            
            if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
              if (simulationBoard[newRow][newCol]) {
                const pair: MatchPair = {
                  piece1: { row, col },
                  piece2: { row: newRow, col: newCol }
                };
                
                const pairExists = pairs.some(p => 
                  (p.piece1.row === pair.piece2.row && p.piece1.col === pair.piece2.col &&
                   p.piece2.row === pair.piece1.row && p.piece2.col === pair.piece1.col)
                );
                
                if (!pairExists) {
                  pairs.push(pair);
                }
              }
            }
          }
        }
      }
    }
    
    return pairs;
  }, [simulationBoard]);

  const playMatch = useCallback((piece1Pos: Position, piece2Pos: Position): void => {
    setSimulationBoard(prev => {
      const newBoard = [...prev];
      const piece1 = newBoard[piece1Pos.row][piece1Pos.col]!;
      const piece2 = newBoard[piece2Pos.row][piece2Pos.col]!;
      
      const expectedScore1 = 1 / (1 + Math.pow(10, (piece2.trueRating - piece1.trueRating) / 400));
      const actualScore1 = Math.random() < expectedScore1 ? 1 : 0;
      const actualScore2 = 1 - actualScore1;
      
      const newRating1 = piece1.shownRating + kFactor * (actualScore1 - (1 / (1 + Math.pow(10, (piece2.shownRating - piece1.shownRating) / 400))));
      const newRating2 = piece2.shownRating + kFactor * (actualScore2 - (1 / (1 + Math.pow(10, (piece1.shownRating - piece2.shownRating) / 400))));
      
      piece1.shownRating = Math.round(newRating1);
      piece2.shownRating = Math.round(newRating2);
      
      return newBoard;
    });

    if (showHighlights) {
      setHighlightedCells([
        `${piece1Pos.row}-${piece1Pos.col}`,
        `${piece2Pos.row}-${piece2Pos.col}`
      ]);
      setTimeout(() => setHighlightedCells([]), 500);
    }
  }, [kFactor, showHighlights]);

  const runSimulationStep = useCallback((): void => {
    const validPairs = findValidPairs();
    
    if (validPairs.length === 0) {
      setIsSimulationRunning(false);
      alert('No more valid matches possible!');
      return;
    }
    
    const randomPair = validPairs[Math.floor(Math.random() * validPairs.length)];
    playMatch(randomPair.piece1, randomPair.piece2);
    
    setMatchCount(prev => prev + 1);
  }, [findValidPairs, playMatch]);

  useEffect(() => {
    if (isSimulationRunning) {
      const delay = fastMode ? 0 : simulationSpeed;
      simulationIntervalRef.current = setTimeout(runSimulationStep, delay);
    }
    
    return () => {
      if (simulationIntervalRef.current) {
        clearTimeout(simulationIntervalRef.current);
      }
    };
  }, [isSimulationRunning, runSimulationStep, fastMode, simulationSpeed]);

  const startSimulation = (): void => {
    if (isSimulationRunning) return;
    
    copySetupToSimulation();
    setIsSimulationRunning(true);
    setMatchCount(0);
  };

  const pauseSimulation = (): void => {
    setIsSimulationRunning(false);
    if (simulationIntervalRef.current) {
      clearTimeout(simulationIntervalRef.current);
      simulationIntervalRef.current = null;
    }
  };

  const resetSimulation = (): void => {
    pauseSimulation();
    setMatchCount(0);
    setSimulationBoard(Array(8).fill(null).map(() => Array(8).fill(null)));
  };

  const clearBoard = (): void => {
    pauseSimulation();
    setSetupBoard(Array(8).fill(null).map(() => Array(8).fill(null)));
    setSimulationBoard(Array(8).fill(null).map(() => Array(8).fill(null)));
    setMatchCount(0);
  };

  const renderBoard = (board: Board, boardType: 'setup' | 'simulation') => {
    return (
      <div 
        className="grid grid-cols-8 gap-0.5 bg-gray-800 p-2 rounded-lg shadow-lg mx-auto max-w-sm aspect-square"
      >
        {board.map((row, rowIndex) => 
          row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={`
                bg-gray-100 border border-gray-300 flex items-center justify-center relative min-h-9 aspect-square
                ${boardType === 'setup' && !cell ? 'cursor-pointer hover:bg-blue-100' : ''}
                ${boardType === 'setup' && cell ? 'cursor-pointer hover:bg-red-100' : ''}
                ${boardType === 'simulation' ? 'cursor-default' : ''}
                ${highlightedCells.includes(`${rowIndex}-${colIndex}`) ? 'bg-orange-500 animate-pulse' : ''}
              `}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (boardType === 'setup') {
                  handleCellClick(rowIndex, colIndex);
                }
              }}
            >
              {cell && (
                <div
                  className="w-4/5 h-4/5 rounded-full border-2 border-gray-800 transition-colors duration-300 pointer-events-none min-w-5 min-h-5"
                  style={{ 
                    backgroundColor: getRatingColor(
                      boardType === 'setup' ? cell.trueRating : cell.shownRating
                    )
                  }}
                  title={`Rating: ${boardType === 'setup' ? cell.trueRating : cell.shownRating}`}
                />
              )}
            </div>
          ))
        )}
      </div>
    );
  };

  return (
    <div className="max-w-full mx-auto font-sans bg-gray-100 p-2.5 rounded-lg">{/* elo-simulation */}

      <h1 className="text-center mb-5 text-gray-800 text-lg md:text-2xl font-bold">Elo Rating Grid Simulation</h1>
      
      <div className="flex gap-4 items-center justify-center mb-5 p-4 bg-white rounded-lg shadow-sm flex-wrap">{/* elo-controls */}
        <div className="flex items-center flex-wrap gap-1">
          <label className="font-bold text-sm md:text-base whitespace-nowrap">Select Rating:</label>
          <select 
            value={selectedRating} 
            onChange={(e) => setSelectedRating(parseInt(e.target.value))}
            disabled={isSimulationRunning}
            className="p-2 border border-gray-300 rounded text-sm md:text-base min-w-20 bg-white disabled:bg-gray-200 disabled:cursor-not-allowed enabled:hover:border-blue-400"
          >
            {availableRatings.map(rating => (
              <option key={rating} value={rating}>{rating}</option>
            ))}
          </select>
        </div>
        
        <div className="flex gap-2 flex-wrap">{/* simulation-controls */}
          <button 
            className="px-3 py-2 border-none rounded cursor-pointer text-xs md:text-sm transition-colors whitespace-nowrap min-h-10 bg-green-500 text-white hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
            onClick={startSimulation}
            disabled={isSimulationRunning}
          >
            Start
          </button>
          <button 
            className="px-3 py-2 border-none rounded cursor-pointer text-xs md:text-sm transition-colors whitespace-nowrap min-h-10 bg-orange-500 text-white hover:bg-orange-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
            onClick={pauseSimulation}
            disabled={!isSimulationRunning}
          >
            Pause
          </button>
          <button 
            className="px-3 py-2 border-none rounded cursor-pointer text-xs md:text-sm transition-colors whitespace-nowrap min-h-10 bg-red-500 text-white hover:bg-red-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
            onClick={resetSimulation}
            disabled={isSimulationRunning}
          >
            Reset
          </button>
          <button 
            className="px-3 py-2 border-none rounded cursor-pointer text-xs md:text-sm transition-colors whitespace-nowrap min-h-10 bg-red-500 text-white hover:bg-red-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
            onClick={clearBoard}
            disabled={isSimulationRunning}
          >
            Clear
          </button>
        </div>
        
        <div className="flex items-center gap-4 flex-wrap justify-center mt-4 pt-4 border-t border-gray-300">{/* advanced-controls */}
          <div className="flex items-center gap-1 flex-wrap justify-center">
            <span className="font-bold whitespace-nowrap text-xs md:text-sm">K-Factor: </span>
            <input 
              type="range" 
              min="8" 
              max="64" 
              step="8"
              value={kFactor}
              onChange={(e) => setKFactor(parseInt(e.target.value))}
              className="w-20 md:w-32"
            />
            <span className="text-xs md:text-sm">{kFactor}</span>
          </div>
        </div>
      </div>

      <div className="flex gap-5 justify-center mb-5 flex-wrap">
        <div className="text-center flex-1 min-w-72 max-w-md">
          <h3 className="mb-4 text-gray-800 text-base md:text-lg font-semibold">Setup Board (True Ratings)</h3>
          {renderBoard(setupBoard, 'setup')}
        </div>
        
        <div className="text-center flex-1 min-w-72 max-w-md">
          <h3 className="mb-4 text-gray-800 text-base md:text-lg font-semibold">Simulation Board (Shown Ratings)</h3>
          {renderBoard(simulationBoard, 'simulation')}
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
        <h4 className="mb-4 text-center text-gray-800 text-base md:text-lg font-semibold">Rating Color Legend:</h4>
        <div className="flex gap-4 justify-center flex-wrap">
          {availableRatings.map(rating => (
            <div key={rating} className="flex items-center gap-1">
              <div 
                className="w-4 h-4 rounded-full border border-gray-800 flex-shrink-0"
                style={{ backgroundColor: ratingColors[rating] }}
              />
              <span className="text-sm md:text-base font-bold">{rating}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm text-center">
        <p className="my-1 text-sm md:text-base text-gray-800">Matches: <span className="font-bold text-green-500">{matchCount}</span></p>
      </div>
    </div>
  );
};

export default EloSimulator;