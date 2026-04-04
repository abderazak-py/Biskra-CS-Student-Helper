import { useState } from 'react'
import { Brain, Check, X, RotateCcw, Trophy, ArrowRight, Play } from 'lucide-react'
import { QUIZ_QUESTIONS, shuffleArray } from '../data/quiz'

export default function QuizPage() {
    const [gameState, setGameState] = useState('idle') // idle, playing, finished
    const [questions, setQuestions] = useState([])
    const [currentIndex, setCurrentIndex] = useState(0)
    const [selectedAnswer, setSelectedAnswer] = useState(null)
    const [showResult, setShowResult] = useState(false)
    const [score, setScore] = useState(0)
    const [answers, setAnswers] = useState([])

    const startQuiz = () => {
        const shuffled = shuffleArray(QUIZ_QUESTIONS).slice(0, 10)
        setQuestions(shuffled)
        setCurrentIndex(0)
        setScore(0)
        setAnswers([])
        setSelectedAnswer(null)
        setShowResult(false)
        setGameState('playing')
    }

    const handleAnswer = (index) => {
        if (showResult) return

        setSelectedAnswer(index)
        setShowResult(true)

        const isCorrect = index === questions[currentIndex].answer
        if (isCorrect) {
            setScore((prev) => prev + 1)
        }
        setAnswers((prev) => [...prev, { questionIndex: currentIndex, selected: index, isCorrect }])
    }

    const nextQuestion = () => {
        if (currentIndex < questions.length - 1) {
            setCurrentIndex((prev) => prev + 1)
            setSelectedAnswer(null)
            setShowResult(false)
        } else {
            setGameState('finished')
        }
    }

    const currentQuestion = questions[currentIndex]

    const getScoreMessage = () => {
        const percentage = (score / questions.length) * 100
        if (percentage >= 90) return { text: "Excellent! You're a CS genius!", emoji: '🏆' }
        if (percentage >= 70) return { text: 'Great job! Keep learning!', emoji: '🌟' }
        if (percentage >= 50) return { text: 'Good effort! Practice more!', emoji: '💪' }
        return { text: "Keep studying, you'll improve!", emoji: '📚' }
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-rose-100 dark:bg-rose-900/30">
                    <Brain className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                </div>
                <div>
                    <h1 className="text-lg font-semibold text-surface-900 dark:text-surface-100">CS Quiz</h1>
                    <p className="text-sm text-surface-500 dark:text-surface-400">
                        Test your computer science knowledge
                    </p>
                </div>
            </div>

            {/* Idle State */}
            {gameState === 'idle' && (
                <div className="card p-6 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center">
                        <Brain className="w-8 h-8 text-rose-600 dark:text-rose-400" />
                    </div>
                    <h2 className="text-xl font-semibold text-surface-900 dark:text-surface-100 mb-2">
                        Ready to test your knowledge?
                    </h2>
                    <p className="text-surface-500 dark:text-surface-400 text-sm mb-4">
                        10 random questions about computer science topics.
                    </p>
                    <div className="flex flex-wrap justify-center gap-2 mb-5">
                        <div className="px-3 py-1.5 rounded-lg bg-surface-100 dark:bg-surface-800 text-sm">
                            <span className="font-medium text-surface-900 dark:text-surface-100">10</span>
                            <span className="text-surface-500 dark:text-surface-400 ml-1">questions</span>
                        </div>
                        <div className="px-3 py-1.5 rounded-lg bg-surface-100 dark:bg-surface-800 text-sm">
                            <span className="font-medium text-surface-900 dark:text-surface-100">Multiple</span>
                            <span className="text-surface-500 dark:text-surface-400 ml-1">choice</span>
                        </div>
                    </div>
                    <button onClick={startQuiz} className="btn btn-primary">
                        <Play className="w-4 h-4" />
                        Start Quiz
                    </button>
                </div>
            )}

            {/* Playing State */}
            {gameState === 'playing' && currentQuestion && (
                <>
                    {/* Progress */}
                    <div className="card p-3">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs text-surface-500 dark:text-surface-400">
                                Question {currentIndex + 1} of {questions.length}
                            </span>
                            <span className="text-xs font-medium text-primary-600 dark:text-primary-400">
                                Score: {score}
                            </span>
                        </div>
                        <div className="h-1.5 bg-surface-200 dark:bg-surface-700 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-primary-600 dark:bg-primary-400 rounded-full transition-all duration-300"
                                style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                            />
                        </div>
                    </div>

                    {/* Question Card */}
                    <div className="card p-4">
                        {/* Category Badge */}
                        <div className="mb-3">
                            <span className="badge badge-primary text-2xs">{currentQuestion.cat}</span>
                        </div>

                        {/* Question */}
                        <h2 className="text-base font-semibold text-surface-900 dark:text-surface-100 mb-4">
                            {currentQuestion.q}
                        </h2>

                        {/* Options */}
                        <div className="space-y-2">
                            {currentQuestion.options.map((option, index) => {
                                const isSelected = selectedAnswer === index
                                const isCorrect = index === currentQuestion.answer
                                const showCorrect = showResult && isCorrect
                                const showWrong = showResult && isSelected && !isCorrect

                                return (
                                    <button
                                        key={index}
                                        onClick={() => handleAnswer(index)}
                                        disabled={showResult}
                                        className={`
                                            w-full p-3 rounded-lg text-left transition-all text-sm
                                            ${showCorrect
                                                ? 'bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700 text-green-700 dark:text-green-300'
                                                : showWrong
                                                    ? 'bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-300'
                                                    : isSelected
                                                        ? 'bg-primary-100 dark:bg-primary-900/30 border border-primary-300 dark:border-primary-700 text-primary-700 dark:text-primary-300'
                                                        : 'bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 text-surface-700 dark:text-surface-300 hover:border-surface-300 dark:hover:border-surface-600'
                                            }
                                        `}
                                    >
                                        <div className="flex items-center gap-2">
                                            <span
                                                className={`
                                                w-6 h-6 rounded flex items-center justify-center text-xs font-semibold
                                                ${showCorrect
                                                        ? 'bg-green-200 dark:bg-green-800/50 text-green-700 dark:text-green-300'
                                                        : showWrong
                                                            ? 'bg-red-200 dark:bg-red-800/50 text-red-700 dark:text-red-300'
                                                            : 'bg-surface-200 dark:bg-surface-700 text-surface-500 dark:text-surface-400'
                                                    }
                                            `}
                                            >
                                                {showCorrect ? (
                                                    <Check className="w-4 h-4" />
                                                ) : showWrong ? (
                                                    <X className="w-4 h-4" />
                                                ) : (
                                                    String.fromCharCode(65 + index)
                                                )}
                                            </span>
                                            <span>{option}</span>
                                        </div>
                                    </button>
                                )
                            })}
                        </div>

                        {/* Explanation */}
                        {showResult && (
                            <div className="mt-4 p-3 rounded-lg bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700">
                                <p className="text-xs text-surface-600 dark:text-surface-400">
                                    <span className="font-medium text-surface-900 dark:text-surface-100">
                                        Explanation:{' '}
                                    </span>
                                    {currentQuestion.exp}
                                </p>
                            </div>
                        )}

                        {/* Next Button */}
                        {showResult && (
                            <button onClick={nextQuestion} className="btn btn-primary w-full mt-4">
                                {currentIndex < questions.length - 1 ? (
                                    <>
                                        Next Question
                                        <ArrowRight className="w-4 h-4" />
                                    </>
                                ) : (
                                    <>
                                        See Results
                                        <Trophy className="w-4 h-4" />
                                    </>
                                )}
                            </button>
                        )}
                    </div>
                </>
            )}

            {/* Finished State */}
            {gameState === 'finished' && (
                <div className="card p-6 text-center">
                    <div className="text-5xl mb-3">{getScoreMessage().emoji}</div>
                    <h2 className="text-xl font-semibold text-surface-900 dark:text-surface-100 mb-1">
                        Quiz Complete!
                    </h2>
                    <p className="text-surface-500 dark:text-surface-400 text-sm mb-4">{getScoreMessage().text}</p>

                    <div className="inline-flex items-center gap-3 px-4 py-3 rounded-xl bg-surface-100 dark:bg-surface-800 mb-5">
                        <div className="text-center">
                            <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">{score}</p>
                            <p className="text-xs text-surface-500 dark:text-surface-400">Correct</p>
                        </div>
                        <div className="w-px h-8 bg-surface-300 dark:bg-surface-600" />
                        <div className="text-center">
                            <p className="text-2xl font-bold text-surface-900 dark:text-surface-100">
                                {questions.length}
                            </p>
                            <p className="text-xs text-surface-500 dark:text-surface-400">Total</p>
                        </div>
                        <div className="w-px h-8 bg-surface-300 dark:bg-surface-600" />
                        <div className="text-center">
                            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                                {Math.round((score / questions.length) * 100)}%
                            </p>
                            <p className="text-xs text-surface-500 dark:text-surface-400">Score</p>
                        </div>
                    </div>

                    <button onClick={startQuiz} className="btn btn-primary">
                        <RotateCcw className="w-4 h-4" />
                        Play Again
                    </button>
                </div>
            )}
        </div>
    )
}