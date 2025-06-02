import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import Balance from './components/Balance';
import Header from './components/Header';
import Message from './components/Message';
import CoinContainer from './components/CoinContainer';
import GameLog from './components/GameLog';
import Settings from './components/Settings';
import { getPotentialWeightedCoins } from './utils/coinEliminator';
import { determineOptimalWeighResult } from './utils/worstCaseStrategy';
import { WeighResult } from './types';

// Weight constant - how much heavier the weighted coin is
const WEIGHT_VALUE = 1;

type GameMode = 'random' | 'worst';
type WeightMode = 'heavy' | 'light' | 'either';

function App() {
  const [coins, setCoins] = useState<number[]>(Array.from({ length: 12 }, (_, i) => i + 1));
  const [weightedCoinIndex, setWeightedCoinIndex] = useState<number | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const [message, setMessage] = useState("Click on coins to add them to the scale!");
  const [gameMode, setGameMode] = useState<GameMode>(
    () => {
      // Try to load saved game mode from localStorage
      const savedMode = localStorage.getItem('coinGameMode');
      // Return the saved mode if it's valid, otherwise default to 'random'
      return (savedMode === 'random' || savedMode === 'worst') ? savedMode : 'random';
    }
  );
  const [weightMode, setWeightMode] = useState<WeightMode>(
    () => {
      // Try to load saved weight mode from localStorage
      const savedWeightMode = localStorage.getItem('coinGameWeightMode') as WeightMode;
      // Return the saved mode if it's valid, otherwise default to 'heavy'
      return (savedWeightMode === 'heavy' || savedWeightMode === 'light' || savedWeightMode === 'either') 
        ? savedWeightMode 
        : 'heavy';
    }
  );
  const [possibleWeightedCoins, setPossibleWeightedCoins] = useState<number[]>([]);
  const [weighHistory, setWeighHistory] = useState<WeighResult[]>([]);
  
  // Scale-related states
  const [selectedSide, setSelectedSide] = useState<'left' | 'right' | null>(null);
  const [leftCoins, setLeftCoins] = useState<number[]>([]);
  const [rightCoins, setRightCoins] = useState<number[]>([]);
  const [scaleTipped, setScaleTipped] = useState<'left' | 'right' | null>(null);
  const [isWeighing, setIsWeighing] = useState<boolean>(false);
  const [turns, setTurns] = useState<number>(0);
  
  // Settings panel state
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  
  // Game log state
  const [isLogVisible, setIsLogVisible] = useState<boolean>(
    localStorage.getItem('coinGameLogVisible') === 'true'
  );
  
  // Hint mode state
  const [isHintModeActive, setIsHintModeActive] = useState<boolean>(
    localStorage.getItem('coinGameHintMode') === 'true'
  );
  
  // Initialize game based on mode
  useEffect(() => {
    try {
      // Try to load saved weigh history from localStorage
      const savedHistoryJson = localStorage.getItem('coinGameHistory');
      console.log('Saved history:', savedHistoryJson);
      // Return the parsed history if it exists, otherwise empty array
      const savedHistory = savedHistoryJson ? JSON.parse(savedHistoryJson) : [];
      console.log('Parsed history:', savedHistory);

      // Lookup the last game mode
      const savedGameMode = localStorage.getItem('coinGameMode') as GameMode;

      // If we have a saved history, restore the game state
      if (savedHistory.length > 0) {
        try {
          // Restore the weigh history
          setWeighHistory(savedHistory);
          setTurns(savedHistory.length);

          // Load the most recent weigh result
          const lastWeigh = savedHistory[savedHistory.length - 1];

          console.log('Last weigh:', lastWeigh);

          // Restore possible weighted coins
          if (lastWeigh.remainingCandidates) {
            setPossibleWeightedCoins(lastWeigh.remainingCandidates);
            
            // If we're down to one coin in worst mode, set it as the weighted coin
            if (savedGameMode === 'worst' && lastWeigh.remainingCandidates.length === 1) {
              setWeightedCoinIndex(lastWeigh.remainingCandidates[0]);
            }
            
            // For random mode, select a weighted coin from the remaining candidates
            if (savedGameMode === 'random') {
              const candidates = lastWeigh.remainingCandidates;
              const randomIndex = candidates[Math.floor(Math.random() * candidates.length)];
              setWeightedCoinIndex(randomIndex);
              console.log("Restored weighted coin is:", randomIndex + 1);
            }
          }
          
          // Always select left side when restoring a game
          setSelectedSide('left');
          
          // Set appropriate message
          setMessage("Game restored from previous session. Left side selected.");
        } catch (error) {
          console.error("Error restoring game state:", error);
          resetGame(savedGameMode);
        }
      } else {
        resetGame(savedGameMode);
      }
    } catch (error) {
      console.error("Error loading weigh history from localStorage:", error);
      resetGame(gameMode);
    }
  }, []);
  
  // Keyboard handler for toggling log visibility and hint mode
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key.toLowerCase() === 'l') {
      setIsLogVisible(prevVisible => {
        const newVisible = !prevVisible;
        localStorage.setItem('coinGameLogVisible', String(newVisible));
        return newVisible;
      });
    }
    else if (event.key.toLowerCase() === 'h') {
      setIsHintModeActive(prevActive => {
        const newActive = !prevActive;
        localStorage.setItem('coinGameHintMode', String(newActive));
        return newActive;
      });
    }
  }, []);
  
  // Add and remove keyboard event listener
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);
  
  // Function to handle game mode changes
  const handleGameModeChange = (mode: GameMode) => {
    // Save to localStorage
    localStorage.setItem('coinGameMode', mode);
    // Update state
    setGameMode(mode);
    resetGame(mode);
  };

  const handleCoinClick = (index: number) => {
    if (gameOver) return;
    
    const coinNumber = index + 1;
    console.log(`Clicked coin ${coinNumber}`);
    
    // Check if the coin is on either side of the balance
    const isOnLeftSide = leftCoins.includes(index);
    const isOnRightSide = rightCoins.includes(index);
    
    // If the coin is already on a balance side, remove it
    if (isOnLeftSide) {
      setLeftCoins(leftCoins.filter(coinIndex => coinIndex !== index));
      setMessage(`Removed coin #${coinNumber} from the left side.`);
      return;
    }
    
    if (isOnRightSide) {
      setRightCoins(rightCoins.filter(coinIndex => coinIndex !== index));
      setMessage(`Removed coin #${coinNumber} from the right side.`);
      return;
    }
    
    // If we get here, the coin is not on any side
    // We need a selected side to add it to
    if (selectedSide === null) {
      setMessage("Please select a side of the scale first!");
      return;
    }
    
    // Add to the selected side
    if (selectedSide === 'left') {
      setLeftCoins([...leftCoins, index]);
      setMessage(`Added coin #${coinNumber} to the left side.`);
    } else {
      setRightCoins([...rightCoins, index]);
      setMessage(`Added coin #${coinNumber} to the right side.`);
    }
  };

  const handleSelectSide = (side: 'left' | 'right') => {
    setSelectedSide(side);
    setMessage(`Selected ${side} side. Click coins to add them.`);
  };

  // This function has been integrated into the handleWeigh function

  const handleWeigh = () => {
    // Don't reset scaleTipped immediately to allow for proper animation
    // It will be updated based on the weighing result
    
    console.log('[handleWeight] Weighted coin index:', weightedCoinIndex);

    // Increment turn counter
    setTurns(turns + 1);
    
    let result: 'left' | 'right' | 'equal';
    
    if (gameMode === 'random') {
      // Ensure we have a weighted coin in random mode                                               
      /*if (weightedCoinIndex === null) {                                                              
        console.warn("No weighted coin detected in random mode. Selecting a new one...");            
        
        // First check if we have remaining candidates from history
        let candidates: number[] = [];
        if (weighHistory.length > 0) {
          const lastWeigh = weighHistory[weighHistory.length - 1];
          if (lastWeigh.remainingCandidates && lastWeigh.remainingCandidates.length > 0) {
            candidates = lastWeigh.remainingCandidates;
          }
        }
        
        // If no candidates from history, use all coins
        if (candidates.length === 0) {
          candidates = Array.from({ length: coins.length }, (_, i) => i);
        }
        
        // Pick a random coin from candidates
        const randomIndex = candidates[Math.floor(Math.random() * candidates.length)];
        setWeightedCoinIndex(randomIndex);                                                           
        console.log("New weighted coin is:", randomIndex + 1);                                       
      }*/                                                                                         

      // Random mode - use the pre-selected weighted coin
      // Calculate weight of each side
      const leftWeight = leftCoins.includes(weightedCoinIndex!) ? 
                         leftCoins.length + WEIGHT_VALUE : leftCoins.length;
      const rightWeight = rightCoins.includes(weightedCoinIndex!) ? 
                          rightCoins.length + WEIGHT_VALUE : rightCoins.length;

      if (leftWeight > rightWeight) {
        setScaleTipped('left');
        setMessage("The left side is heavier!");
        result = 'left';
      } else if (rightWeight > leftWeight) {
        setScaleTipped('right');
        setMessage("The right side is heavier!");
        result = 'right';
      } else {
        // Both sides weigh the same
        setScaleTipped(null);
        setIsWeighing(true);
        setMessage("Both sides weigh the same!");
        result = 'equal';
        
        // Reset wobble animation after it completes
        setTimeout(() => {
          setIsWeighing(false);
        }, 1500); // Match the animation duration
      }
    } else {
      // Worst mode - use the optimal strategy to determine result
      result = determineOptimalWeighResult(
        leftCoins,
        rightCoins,
        possibleWeightedCoins.length === 0 ? Array.from({ length: coins.length }, (_, i) => i) : possibleWeightedCoins,
        weighHistory,
        coins.length
      );
      
      // Set the appropriate UI feedback based on the result
      if (result === 'left') {
        setScaleTipped('left');
        setMessage("The left side is heavier!");
      } else if (result === 'right') {
        setScaleTipped('right');
        setMessage("The right side is heavier!");
      } else {
        // Equal
        setScaleTipped(null);
        setIsWeighing(true);
        setMessage("Both sides weigh the same!");
        
        // Reset wobble animation after it completes
        setTimeout(() => {
          setIsWeighing(false);
        }, 1500); // Match the animation duration
      }
    }
    
    // Calculate remaining potential weighted coins based on this result
    // This is useful for both game modes for hint mode
    let remainingCandidates: number[];
    
    // Special cases
    if (possibleWeightedCoins.length === 1) {
      // If we already identified the weighted coin in worst mode, keep it
      remainingCandidates = [...possibleWeightedCoins];
    } else {
      // Otherwise, calculate based on weighing history
      const simulatedHistory = [
        ...weighHistory,
        { leftCoins: [...leftCoins], rightCoins: [...rightCoins], result }
      ];
      remainingCandidates = getPotentialWeightedCoins(simulatedHistory, coins.length);
      
      // Protection: Make sure we don't eliminate all coins
      if (remainingCandidates.length === 0) {
        console.warn("Would have eliminated all coins - keeping previous possibilities");
        remainingCandidates = [...possibleWeightedCoins];
      }
    }
    
    // Store the weigh result in history along with remaining candidates
    const weighResult: WeighResult = {
      leftCoins: [...leftCoins],
      rightCoins: [...rightCoins],
      result,
      remainingCandidates: remainingCandidates
    };
    
    const updatedHistory = [...weighHistory, weighResult];
    setWeighHistory(updatedHistory);
    
    // Save to localStorage
    try {
      localStorage.setItem('coinGameHistory', JSON.stringify(updatedHistory));
    } catch (error) {
      console.error("Error saving weigh history to localStorage:", error);
    }
    
    // Update possible weighted coins based on the calculated candidates
    setPossibleWeightedCoins(remainingCandidates);
    
    // If we're down to just one possible coin in worst mode, set it as the weighted coin
    if (remainingCandidates.length === 1 && gameMode === 'worst') {
      setWeightedCoinIndex(remainingCandidates[0]);
    }
  };

  const resetGame = (newMode: GameMode) => {
    console.log('Resetting game');

    setLeftCoins([]);
    setRightCoins([]);
    setScaleTipped(null);
    setGameOver(false);
    setTurns(0);
    setWeighHistory([]);
    
    // Clear weigh history from localStorage
    localStorage.removeItem('coinGameHistory');
    
    // Initialize all coins as potential weighted coins for both modes
    // This is used for hint mode
    setPossibleWeightedCoins(Array.from({ length: coins.length }, (_, i) => i));
    
    // Always select left side on reset
    setSelectedSide('left');
    
    if (newMode === 'random') {
      // In random mode, pick a weighted coin right away
      const randomIndex = Math.floor(Math.random() * 12);
      setWeightedCoinIndex(randomIndex);
      console.log("New weighted coin is:", randomIndex + 1);
      setMessage("Click coins to add to the left side.");
    } else {
      // In worst mode, don't pick a weighted coin yet
      setWeightedCoinIndex(null);
      setMessage("Worst case mode. Adding coins to left side.");
    }
  };

  // Determine if a coin should be dim (on the scale or eliminated as possibility)
  const isCoinDim = (index: number) => {
    // Dim if it's on the scale
    if (leftCoins.includes(index) || rightCoins.includes(index)) {
      return true;
    }
    
    return false;
  };
  
  // Reset scale when all coins are removed
  useEffect(() => {
    if (leftCoins.length === 0 && rightCoins.length === 0) {
      setScaleTipped(null);
      setIsWeighing(false);
    }
  }, [leftCoins, rightCoins]);

  // Determine if a coin is the weighted one and has been found
  const isWeightedAndFound = (index: number) => {
    return gameOver && index === weightedCoinIndex;
  };
  
  // Determine if a coin should be silver
  const isCoinSilver = (index: number) => {
    // Only show silver coins if hint mode is active
    if (!isHintModeActive) {
      return false;
    }
    
    // First weighing - all coins are potential candidates
    if (weighHistory.length === 0) {
      return true; // All coins start as silver in hint mode
    }
    
    // For both game modes, show all potential weighted coins as silver
    // Use the cached remainingCandidates from the last weighing if available
    const lastWeighing = weighHistory[weighHistory.length - 1];
    if (lastWeighing && lastWeighing.remainingCandidates) {
      return lastWeighing.remainingCandidates.includes(index);
    }
    
    // Fallback to possibleWeightedCoins if we have them
    if (possibleWeightedCoins.length > 0) {
      return possibleWeightedCoins.includes(index);
    }
    
    // Last resort: recalculate (shouldn't be needed)
    const potentialWeighted = getPotentialWeightedCoins(weighHistory, coins.length);
    return potentialWeighted.includes(index);
  };

  // Function to handle the user's guess
  const handleGuess = (index: number) => {
    if (index === weightedCoinIndex) {
      setGameOver(true);
      setMessage(`Correct! Coin #${index + 1} was the weighted one.`);
    } else {
      setMessage(`Incorrect! Coin #${index + 1} is not the weighted one.`);
    }
  };

  return (
    <div className="App">
        <Header 
          onOpenSettings={() => setIsSettingsOpen(true)}
          turns={turns}
          resetGame={() => resetGame(gameMode)}
        />
        
        <CoinContainer 
          coins={coins}
          isCoinDim={isCoinDim}
          isWeightedAndFound={isWeightedAndFound}
          isCoinSilver={isCoinSilver}
          onCoinClick={handleCoinClick}
          onClearCoins={() => {
            setLeftCoins([]);
            setRightCoins([]);
            setMessage("Cleared all coins from the scale!");
          }}
        />
        
        <Balance 
          selectedSide={selectedSide} // Pass down the selected side
          onSelectSide={handleSelectSide} 
          onWeigh={handleWeigh}
          leftCoins={leftCoins}
          rightCoins={rightCoins}
          tipped={scaleTipped}
          isWeighing={isWeighing}
          onCoinClick={(side, index) => {
            handleCoinClick(index);
          }}
        />
        
        <Message message={message} />
        
        <GameLog 
          weighHistory={weighHistory}
          isVisible={isLogVisible}
        />
        
        <div className="keyboardHints">
          <div>Press 'L' to {isLogVisible ? 'hide' : 'show'} game log</div>
          <div>Press 'H' to {isHintModeActive ? 'disable' : 'enable'} hint mode</div>
        </div>

        {isSettingsOpen && <Settings 
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          gameMode={gameMode} 
          setGameMode={handleGameModeChange}
          isHintModeActive={isHintModeActive}
          setIsHintModeActive={setIsHintModeActive}
          isLogVisible={isLogVisible}
          setIsLogVisible={setIsLogVisible}
          weightMode={weightMode}
          setWeightMode={setWeightMode}
        />}
    </div>
  );
}

export default App;
