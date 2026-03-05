import React, { useState, useEffect, useRef } from 'react';
import { AppInfo, Player } from '../types';
import PlayerList from './PlayerList';
import { XCircle, HelpCircle, ArrowRight, Sparkles } from 'lucide-react';

interface GameBoardProps {
  currentApp: AppInfo;
  roundIndex: number;
  totalRounds: number;
  players: Player[];
  selectedPlayerId: string | null;
  onCorrectAnswer: (playerId: string, points: number) => void;
  onNextRound: () => void;
}

const GameBoard: React.FC<GameBoardProps> = ({
  currentApp,
  roundIndex,
  totalRounds,
  players,
  selectedPlayerId,
  onCorrectAnswer,
  onNextRound
}) => {
  const [hintStep, setHintStep] = useState(0);
  const [currentScore, setCurrentScore] = useState(5);
  const [shuffledIndices] = useState<number[]>(() => {
    const indices = Array.from({ length: 100 }, (_, i) => i);
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    return indices;
  });
  const [guess, setGuess] = useState("");
  const [feedback, setFeedback] = useState<"CORRECT" | "WRONG" | "TIMEOUT" | null>(null);
  const [wrongMessage, setWrongMessage] = useState(""); 
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isRoundOver, setIsRoundOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    if (!isRoundOver) {
      inputRef.current?.focus();
    }
  }, [hintStep, isRoundOver]);

  useEffect(() => {
    if (selectedPlayerId) setErrorMsg(null);
  }, [selectedPlayerId]);

  // hintStep * 4 를 통해 힌트 1번당 정확히 4칸씩 공개됩니다.
  const revealedCount = hintStep === 6 ? 100 : hintStep * 4;
  const currentlyRevealedIndices = shuffledIndices.slice(0, revealedCount);

  const handleNextStage = () => {
    if (isRoundOver) return;

    if (currentScore === 0 || hintStep >= 5) {
      setCurrentScore(0);
      setHintStep(6);
      setFeedback("TIMEOUT");
      setIsRoundOver(true);
      return;
    }

    const nextStep = hintStep + 1;
    setHintStep(nextStep);
    
    if (nextStep >= 2) {
      setCurrentScore(prev => Math.max(0, prev - 1));
    }
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (isRoundOver) return;
    
    if (!selectedPlayerId) {
      setErrorMsg("참가자 정보가 설정되지 않았습니다.");
      return;
    }
    
    if (!guess.trim()) return;

    const normalizedGuess = guess.toLowerCase().replace(/\s/g, '');
    const isCorrect = currentApp.names.some(name => 
      name.toLowerCase().replace(/\s/g, '') === normalizedGuess
    );

    if (isCorrect) {
      setErrorMsg(null);
      setFeedback("CORRECT");
      setIsRoundOver(true);
      setHintStep(6);
      onCorrectAnswer(selectedPlayerId, currentScore); 
    } else {
      // 오답 시 1점 감점 (최소 0점)
      setCurrentScore(prev => Math.max(0, prev - 1));
      setWrongMessage("다시 시도해보세요! (-1점)");

      setErrorMsg(null);
      setFeedback("WRONG");
      setTimeout(() => {
        if (!isRoundOver) setFeedback(null);
      }, 1500);
      setGuess("");
      setTimeout(() => {
        inputRef.current?.focus();
      }, 10);
    }
  };

  const LogoComponent = currentApp.component;
  const isLastPuzzle = roundIndex + 1 === totalRounds;

  let hintBtnText = "";
  if (isRoundOver) {
    hintBtnText = "게임 종료";
  } else if (currentScore === 0) {
    hintBtnText = "정답 보기";
  } else if (hintStep === 0) {
    hintBtnText = "다음 힌트 보기";
  } else {
    hintBtnText = `다음 힌트 보기 (${currentScore}점)`;
  }

  return (
    <div className="flex flex-col md:flex-row h-full max-w-6xl mx-auto p-4 gap-6 items-start">
      <div className="w-full md:w-1/3 lg:w-1/4 h-auto md:h-[600px] shrink-0">
        <PlayerList 
          players={players} 
          selectedPlayerId={selectedPlayerId} 
          interactive={false}
        />
      </div>

      <div className="w-full md:flex-1 flex flex-col items-center bg-white rounded-3xl shadow-xl border border-slate-100 p-6 relative overflow-hidden">
        
        <div className="w-full flex justify-between items-center mb-6 bg-slate-50 p-4 rounded-2xl border-2 border-slate-100">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 text-white font-black px-4 py-2 rounded-xl text-xl">
              라운드 {roundIndex + 1}/{totalRounds}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-bold hidden sm:block">현재 획득 가능 점수:</span>
            <div className={`font-black px-5 py-2 rounded-xl text-2xl flex items-center gap-1 shadow-sm transition-colors ${
              feedback === "WRONG" ? "bg-red-400 text-white animate-wiggle" : "bg-yellow-400 text-yellow-900"
            }`}>
              <Sparkles size={20} />
              {currentScore}점
            </div>
          </div>
        </div>

        <div className="relative w-72 h-72 sm:w-80 sm:h-80 md:w-96 md:h-96 rounded-2xl overflow-hidden shadow-2xl border-8 border-slate-800 bg-slate-200 shrink-0">
          <div className="absolute inset-0 p-8 flex items-center justify-center">
            <LogoComponent />
          </div>

          <div className="absolute inset-0 grid grid-cols-10 grid-rows-10">
            {Array.from({ length: 100 }).map((_, i) => (
              <div 
                key={i} 
                className={`bg-slate-800 ${
                  currentlyRevealedIndices.includes(i) 
                    ? 'opacity-0 transition-opacity duration-500 ease-in-out' 
                    : 'opacity-100 transition-none'
                }`} 
              />
            ))}
          </div>

          {hintStep === 0 && !isRoundOver && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="bg-black/60 text-white px-6 py-3 rounded-2xl backdrop-blur-sm animate-pulse font-bold text-lg border border-white/20">
                힌트 버튼을 눌러 게임을 시작하세요!
              </div>
            </div>
          )}

          {feedback === "CORRECT" && (
             <div className="absolute inset-0 bg-green-500/90 flex flex-col items-center justify-center animate-pop-in backdrop-blur-sm z-20">
               <div className="text-white font-black text-[150px] leading-none mb-2 animate-bounce drop-shadow-2xl">O</div>
               <span className="text-white text-3xl font-black drop-shadow-md">정답!</span>
               <span className="text-green-100 font-bold text-2xl mt-2">{currentApp.names[0]}</span>
             </div>
          )}
          {feedback === "WRONG" && (
             <div className="absolute inset-0 bg-red-500/80 flex flex-col items-center justify-center animate-pop-in backdrop-blur-sm z-20">
               <XCircle size={80} className="text-white mb-2 animate-wiggle" />
               <span className="text-white text-3xl font-black drop-shadow-md mb-2">틀렸습니다!</span>
               <span className="text-red-200 font-bold text-lg bg-black/30 px-4 py-1 rounded-full">{wrongMessage}</span>
             </div>
          )}
          {feedback === "TIMEOUT" && (
             <div className="absolute inset-0 bg-slate-800/95 flex flex-col items-center justify-center animate-pop-in backdrop-blur-sm z-20">
               <span className="text-white text-2xl font-bold mb-3 drop-shadow-md">정답 공개!</span>
               <span className="text-amber-400 font-black text-5xl bg-black/50 px-8 py-4 rounded-3xl border-2 border-amber-400/30">{currentApp.names[0]}</span>
             </div>
          )}
        </div>

        <div className="w-full w-72 sm:w-80 md:w-96 mt-6 flex flex-col gap-3">
          {errorMsg && (
            <div className="text-red-500 font-bold text-center bg-red-50 py-2 rounded-lg border border-red-200 animate-bounce">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex w-full">
            <input
              ref={inputRef}
              type="text"
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
              placeholder="앱 이름을 입력하고 엔터를 누르세요"
              disabled={isRoundOver}
              lang="ko"
              spellCheck={false}
              autoComplete="off"
              style={{ imeMode: 'active' } as React.CSSProperties}
              className="flex-1 px-4 py-4 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors text-xl text-center font-bold disabled:opacity-50"
            />
            <button type="submit" className="hidden">제출</button>
          </form>

          <div className="flex gap-2">
            <button
              onClick={handleNextStage}
              disabled={isRoundOver || hintStep >= 6}
              className="flex-1 py-3 bg-amber-500 text-white rounded-xl font-bold hover:bg-amber-600 transition-colors disabled:bg-slate-300 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <HelpCircle size={20} />
              {hintBtnText}
            </button>
            <button
              onClick={onNextRound}
              className={`py-3 px-8 rounded-xl font-bold transition-all flex items-center justify-center gap-2 whitespace-nowrap ${
                isRoundOver 
                  ? 'bg-indigo-600 text-white shadow-lg hover:bg-indigo-700 animate-pulse' 
                  : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
              }`}
              title={isLastPuzzle ? "최종 결과를 확인합니다" : "다음 문제로 이동합니다"}
            >
              {isLastPuzzle ? "결과 보기" : "다음 문제"}
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameBoard;