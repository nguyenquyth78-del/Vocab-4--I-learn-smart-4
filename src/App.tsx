/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, 
  Gamepad2, 
  Mic2, 
  Search, 
  ChevronLeft, 
  Volume2, 
  Sparkles,
  Trophy,
  Cloud,
  TreePine,
  Bird,
  RotateCcw
} from 'lucide-react';
import { VOCABULARY_DATA } from './data/vocabulary';
import { VocabularyWord, WordCategory } from './types';
import { getWordExplanation, getQuizFeedback } from './services/geminiService';

// --- Components ---

const AIBuddy = ({ message, isExplaining }: { message: string, isExplaining?: boolean }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white rounded-2xl p-4 shadow-lg border-2 border-pink-100 flex items-start gap-3 relative"
  >
    <div className="bg-pink-100 p-2 rounded-full">
      <Sparkles className="w-5 h-5 text-pink-500" />
    </div>
    <div className="flex-1">
      <p className="text-sm font-medium text-slate-600 mb-1">Smart Buddy says:</p>
      <p className="text-sm text-slate-800 italic">
        {isExplaining ? "Thinking..." : message}
      </p>
    </div>
    <div className="absolute -bottom-2 left-6 w-4 h-4 bg-white border-b-2 border-r-2 border-pink-100 rotate-45" />
  </motion.div>
);

const Card = ({ children, onClick, bg = "bg-white" }: { children: React.ReactNode, onClick?: () => void, bg?: string }) => (
  <motion.button
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={`${bg} rounded-3xl p-6 shadow-sm border-2 border-slate-50 flex flex-col items-center justify-center gap-4 w-full transition-all hover:shadow-md cursor-pointer`}
  >
    {children}
  </motion.button>
);

// --- Main App Logic ---

type Screen = 'home' | 'unit-list' | 'quiz-type' | 'quiz' | 'pronunciation';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [selectedUnit, setSelectedUnit] = useState<number | null>(null);
  const [selectedQuizType, setSelectedQuizType] = useState<'meaning' | 'spelling' | 'listening' | 'scrambled' | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [aiMessage, setAiMessage] = useState("Hi! Ready to learn some cool English words today?");
  const [explanation, setExplanation] = useState<string | null>(null);
  const [isExplaining, setIsExplaining] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const units = [1, 2, 3, 4, 5]; // Simplified for now

  const filteredWords = VOCABULARY_DATA.filter(w => 
    (selectedUnit ? w.unit_id === selectedUnit : true) &&
    (w.word.toLowerCase().includes(searchQuery.toLowerCase()) || 
     w.meaning_vi.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleSpeak = (word: string) => {
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);
  };

  const handleExplain = async (word: VocabularyWord) => {
    setIsExplaining(true);
    setExplanation(null);
    const exp = await getWordExplanation(word.word, word.meaning_vi);
    setExplanation(exp || null);
    setIsExplaining(false);
  };

  const startQuiz = (type: 'meaning' | 'spelling' | 'listening' | 'scrambled') => {
    setSelectedQuizType(type);
    setCurrentQuestionIndex(0);
    setScore(0);
    setCurrentScreen('quiz');
  };

  // --- Screens ---

  const renderHome = () => (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-[#003366] tracking-tight">Smart Start 4</h1>
        <p className="text-slate-500 font-medium">Hello, little explorer! 🌟</p>
      </header>

      <AIBuddy message={aiMessage} />

      <div className="grid grid-cols-2 gap-4">
        <Card onClick={() => setCurrentScreen('unit-list')} bg="bg-blue-50">
          <BookOpen className="w-10 h-10 text-[#003366]" />
          <span className="font-bold text-[#003366]">Vocabulary</span>
        </Card>
        <Card onClick={() => setCurrentScreen('quiz-type')} bg="bg-pink-50">
          <Gamepad2 className="w-10 h-10 text-[#FF69B4]" />
          <span className="font-bold text-[#FF69B4]">Games</span>
        </Card>
        <Card onClick={() => setCurrentScreen('pronunciation')} bg="bg-emerald-50">
          <Mic2 className="w-10 h-10 text-emerald-600" />
          <span className="font-bold text-emerald-600">Speech</span>
        </Card>
        <Card bg="bg-orange-50">
          <Trophy className="w-10 h-10 text-orange-500" />
          <span className="font-bold text-orange-500">Milestones</span>
        </Card>
      </div>

      <div className="flex items-center gap-4 text-slate-400 mt-4 opacity-50">
        <Cloud className="animate-bounce" />
        <TreePine />
        <Bird />
      </div>
    </div>
  );

  const renderUnitList = () => (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <button onClick={() => setCurrentScreen('home')} className="p-2 bg-white rounded-xl shadow-sm border border-slate-100">
          <ChevronLeft className="text-[#003366]" />
        </button>
        <h2 className="text-2xl font-bold text-[#003366]">Units</h2>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
        <input 
          type="text" 
          placeholder="Find a word..." 
          className="w-full bg-white border-2 border-slate-100 rounded-2xl py-4 pl-12 pr-4 focus:border-pink-300 outline-none transition-all"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 overflow-y-auto max-h-[60vh] pr-2 custom-scrollbar">
        {VOCABULARY_DATA
          .filter(v => v.word.toLowerCase().includes(searchQuery.toLowerCase()))
          .map(word => (
          <motion.div 
            key={word.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white p-5 rounded-3xl border-2 border-slate-50 shadow-sm flex items-center justify-between group"
          >
            <div>
              <h3 className="text-xl font-bold text-[#003366]">{word.word}</h3>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{word.part_of_speech}</p>
              <p className="text-sm font-mono text-pink-500 mb-1">{word.ipa}</p>
              <p className="text-slate-600 font-medium">{word.meaning_vi}</p>
              <p className="text-xs text-blue-500 italic mt-1 line-clamp-1">{word.example}</p>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => handleSpeak(word.word)}
                className="p-3 bg-blue-50 text-[#003366] rounded-2xl hover:bg-[#003366] hover:text-white transition-colors"
              >
                <Volume2 className="w-5 h-5" />
              </button>
              <button 
                onClick={() => handleExplain(word)}
                className="p-3 bg-pink-50 text-[#FF69B4] rounded-2xl hover:bg-[#FF69B4] hover:text-white transition-colors"
              >
                <Sparkles className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {explanation && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm flex items-center justify-center p-6"
            onClick={() => setExplanation(null)}
          >
            <div className="bg-white rounded-[40px] p-8 max-w-md w-full shadow-2xl border-4 border-pink-100" onClick={e => e.stopPropagation()}>
               <div className="flex justify-between items-start mb-4">
                 <h2 className="text-2xl font-black text-[#003366]">Smart Note 📚</h2>
                 <button onClick={() => setExplanation(null)} className="text-slate-400 hover:text-slate-600">×</button>
               </div>
               <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{explanation}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  const renderQuizType = () => (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <button onClick={() => setCurrentScreen('home')} className="p-2 bg-white rounded-xl shadow-sm border border-slate-100">
          <ChevronLeft className="text-[#003366]" />
        </button>
        <h2 className="text-2xl font-bold text-[#003366]">Choose a Game</h2>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <button onClick={() => startQuiz('meaning')} className="bg-white p-6 rounded-[32px] border-4 border-blue-100 flex items-center gap-6 hover:border-[#003366] transition-all group">
          <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center text-3xl">🔤</div>
          <div className="text-left">
            <h3 className="text-xl font-bold text-[#003366]">Meaning Master</h3>
            <p className="text-slate-500">Pick the right translation!</p>
          </div>
        </button>

        <button onClick={() => startQuiz('spelling')} className="bg-white p-6 rounded-[32px] border-4 border-pink-100 flex items-center gap-6 hover:border-[#FF69B4] transition-all group">
          <div className="w-16 h-16 bg-pink-100 rounded-2xl flex items-center justify-center text-3xl">✏️</div>
          <div className="text-left">
            <h3 className="text-xl font-bold text-[#003366]">Spelling Bee</h3>
            <p className="text-slate-500">Fill in the missing letters.</p>
          </div>
        </button>

        <button onClick={() => startQuiz('listening')} className="bg-white p-6 rounded-[32px] border-4 border-emerald-100 flex items-center gap-6 hover:border-emerald-500 transition-all group">
          <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center text-3xl">🎧</div>
          <div className="text-left">
            <h3 className="text-xl font-bold text-[#003366]">Listen Up!</h3>
            <p className="text-slate-500">Hear the word, find it!</p>
          </div>
        </button>

        <button onClick={() => startQuiz('scrambled')} className="bg-white p-6 rounded-[32px] border-4 border-orange-100 flex items-center gap-6 hover:border-orange-500 transition-all group">
          <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center text-3xl">🌀</div>
          <div className="text-left">
            <h3 className="text-xl font-bold text-[#003366]">Word Jumble</h3>
            <p className="text-slate-500">Unscramble the letters.</p>
          </div>
        </button>
      </div>
    </div>
  );

  const renderQuizRunner = () => {
    const words = [...VOCABULARY_DATA].sort(() => Math.random() - 0.5).slice(0, 5);
    const currentWord = words[currentQuestionIndex] || words[0];
    
    // Simple quiz state logic internal to screen would be better for performance but for this prototype:
    if (currentQuestionIndex >= 5) {
      return (
        <div className="flex flex-col items-center justify-center gap-8 py-12">
          <div className="w-32 h-32 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg">
             <Trophy className="w-16 h-16 text-white" />
          </div>
          <div className="text-center">
            <h2 className="text-4xl font-black text-[#003366] mb-2">Awesome!</h2>
            <p className="text-xl text-slate-500 font-medium">You got {score}/5 correct!</p>
          </div>
          <button 
            onClick={() => setCurrentScreen('home')}
            className="bg-[#003366] text-white px-10 py-4 rounded-full font-bold shadow-xl active:scale-95 transition-all"
          >
            Back to Home
          </button>
        </div>
      );
    }

    const checkAnswer = (answer: string) => {
      if (answer.toLowerCase() === (selectedQuizType === 'meaning' ? currentWord.meaning_vi.toLowerCase() : currentWord.word.toLowerCase())) {
        setScore(score + 1);
        setAiMessage(getQuizFeedback(true, 1));
      } else {
        setAiMessage(getQuizFeedback(false, 2));
      }
      setTimeout(() => setCurrentQuestionIndex(currentQuestionIndex + 1), 1000);
    };

    // Calculate distractors more safely
    const distractors = VOCABULARY_DATA
      .filter(w => w.id !== currentWord.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
    const choices = [currentWord, ...distractors].sort(() => Math.random() - 0.5);

    return (
      <div className="flex flex-col gap-8">
        <div className="flex justify-between items-center">
           <span className="text-[#003366] font-bold">Question {currentQuestionIndex + 1}/5</span>
           <div className="w-32 h-3 bg-slate-100 rounded-full overflow-hidden">
             <motion.div 
               className="h-full bg-pink-400" 
               initial={{ width: 0 }}
               animate={{ width: `${((currentQuestionIndex + 1) / 5) * 100}%` }}
             />
           </div>
        </div>

        <div className="bg-white p-10 rounded-[40px] border-4 border-blue-50 shadow-sm flex flex-col items-center gap-6">
          {selectedQuizType === 'listening' ? (
            <button onClick={() => handleSpeak(currentWord.word)} className="w-24 h-24 bg-blue-100 text-[#003366] rounded-full flex items-center justify-center hover:bg-[#003366] hover:text-white transition-all shadow-md">
              <Volume2 className="w-10 h-10" />
            </button>
          ) : (
            <h2 className="text-4xl font-black text-[#003366]">{currentWord.word}</h2>
          )}
          <p className="text-slate-400 font-medium font-mono">{selectedQuizType === 'meaning' ? 'What does this mean?' : 'Listen carefully!'}</p>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {choices.map((choice, i) => (
              <button 
                key={i}
                onClick={() => checkAnswer(selectedQuizType === 'meaning' ? choice.meaning_vi : choice.word)}
                className="bg-white p-5 rounded-2xl border-2 border-slate-100 font-bold text-slate-700 hover:border-pink-400 hover:text-pink-600 transition-all active:bg-pink-50"
              >
                {selectedQuizType === 'meaning' ? choice.meaning_vi : choice.word}
              </button>
          ))}
        </div>
      </div>
    );
  };

  const renderPronunciation = () => (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <button onClick={() => setCurrentScreen('home')} className="p-2 bg-white rounded-xl shadow-sm border border-slate-100">
          <ChevronLeft className="text-[#003366]" />
        </button>
        <h2 className="text-2xl font-bold text-[#003366]">How to say?</h2>
      </div>

      <div className="bg-white p-8 rounded-[40px] border-4 border-emerald-50">
        <h3 className="text-xl font-bold text-[#003366] mb-4">Pronouncing '-s' and '-es'</h3>
        <div className="space-y-4">
          <div className="p-4 bg-emerald-50 rounded-2xl">
            <p className="font-bold text-emerald-800">/s/ Sound</p>
            <p className="text-sm text-emerald-600 italic">Example: cats, books, maps</p>
          </div>
          <div className="p-4 bg-blue-50 rounded-2xl">
            <p className="font-bold text-blue-800">/z/ Sound</p>
            <p className="text-sm text-blue-600 italic">Example: dogs, pens, birds</p>
          </div>
          <div className="p-4 bg-pink-50 rounded-2xl">
            <p className="font-bold text-pink-800">/ɪz/ Sound</p>
            <p className="text-sm text-pink-600 italic">Example: boxes, watches, buses</p>
          </div>
        </div>
      </div>

      <button className="bg-emerald-600 text-white p-6 rounded-[32px] font-bold shadow-xl flex items-center justify-center gap-2">
        <Gamepad2 className="w-5 h-5" />
        Practice /s/ /z/ /ɪz/
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans p-4 md:p-8 flex justify-center">
      <div className="max-w-md w-full flex flex-col gap-6 relative">
        <motion.div 
          key={currentScreen}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="flex-1"
        >
          {currentScreen === 'home' && renderHome()}
          {currentScreen === 'unit-list' && renderUnitList()}
          {currentScreen === 'quiz-type' && renderQuizType()}
          {currentScreen === 'quiz' && renderQuizRunner()}
          {currentScreen === 'pronunciation' && renderPronunciation()}
        </motion.div>
        
        {/* Decorative elements */}
        {currentScreen === 'home' && (
          <div className="fixed bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-emerald-50 to-transparent -z-10 pointer-events-none" />
        )}
      </div>
    </div>
  );
}
