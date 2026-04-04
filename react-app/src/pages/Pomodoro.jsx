import { useState, useEffect, useRef } from 'react'
import { Timer, Play, Pause, RotateCcw, Target } from 'lucide-react'

const PRESETS = {
    pomodoro: { minutes: 25, label: 'Focus' },
    shortBreak: { minutes: 5, label: 'Short Break' },
    longBreak: { minutes: 15, label: 'Long Break' },
}

export default function PomodoroPage() {
    const [mode, setMode] = useState('pomodoro')
    const [timeLeft, setTimeLeft] = useState(PRESETS.pomodoro.minutes * 60)
    const [isRunning, setIsRunning] = useState(false)
    const [sessions, setSessions] = useState(0)
    const intervalRef = useRef(null)

    const currentPreset = PRESETS[mode]
    const totalTime = currentPreset.minutes * 60
    const progress = ((totalTime - timeLeft) / totalTime) * 100

    useEffect(() => {
        if (isRunning && timeLeft > 0) {
            intervalRef.current = setInterval(() => {
                setTimeLeft((prev) => prev - 1)
            }, 1000)
        } else if (timeLeft === 0) {
            handleComplete()
        }

        return () => clearInterval(intervalRef.current)
    }, [isRunning, timeLeft])

    const handleComplete = () => {
        setIsRunning(false)
        if (mode === 'pomodoro') {
            setSessions((prev) => prev + 1)
        }
        try {
            const audio = new Audio(
                'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2teleQMCZ6/c5JlhAxKC0OW8iEIAKJDY6q53JwA7n+TqnlwNAE2o6OOLRgAAXK/r4HkxAA=='
            )
            audio.play().catch(() => { })
        } catch (e) { }
    }

    const toggleTimer = () => {
        setIsRunning((prev) => !prev)
    }

    const resetTimer = () => {
        setIsRunning(false)
        setTimeLeft(currentPreset.minutes * 60)
    }

    const changeMode = (newMode) => {
        setIsRunning(false)
        setMode(newMode)
        setTimeLeft(PRESETS[newMode].minutes * 60)
    }

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-amber-100 dark:bg-amber-900/30">
                    <Timer className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                    <h1 className="text-lg font-semibold text-surface-900 dark:text-surface-100">
                        Pomodoro Timer
                    </h1>
                    <p className="text-sm text-surface-500 dark:text-surface-400">
                        Focus sessions for studying
                    </p>
                </div>
            </div>

            {/* Mode Selector */}
            <div className="flex gap-2">
                {Object.entries(PRESETS).map(([key, preset]) => (
                    <button
                        key={key}
                        onClick={() => changeMode(key)}
                        className={`
                            flex-1 py-2.5 px-4 rounded-lg font-medium transition-all text-sm
                            ${mode === key
                                ? 'bg-primary-100 dark:bg-primary-900/30 border border-primary-300 dark:border-primary-700 text-primary-700 dark:text-primary-300'
                                : 'bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 text-surface-600 dark:text-surface-400 hover:border-surface-300 dark:hover:border-surface-600'
                            }
                        `}
                    >
                        {preset.label}
                    </button>
                ))}
            </div>

            {/* Timer Display */}
            <div className="card p-8">
                <div className="relative flex items-center justify-center">
                    {/* Progress Ring */}
                    <svg className="w-56 h-56 transform -rotate-90">
                        {/* Background circle */}
                        <circle
                            cx="112"
                            cy="112"
                            r="104"
                            fill="none"
                            stroke="currentColor"
                            className="text-surface-200 dark:text-surface-700"
                            strokeWidth="6"
                        />
                        {/* Progress circle */}
                        <circle
                            cx="112"
                            cy="112"
                            r="104"
                            fill="none"
                            stroke="currentColor"
                            className="text-primary-600 dark:text-primary-400"
                            strokeWidth="6"
                            strokeLinecap="round"
                            strokeDasharray={2 * Math.PI * 104}
                            strokeDashoffset={2 * Math.PI * 104 * (1 - progress / 100)}
                            style={{ transition: 'stroke-dashoffset 0.5s ease' }}
                        />
                    </svg>

                    {/* Time Display */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-5xl font-bold text-surface-900 dark:text-surface-100 font-mono tracking-tight">
                            {formatTime(timeLeft)}
                        </span>
                        <span className="text-surface-500 dark:text-surface-400 mt-1 text-sm">
                            {currentPreset.label}
                        </span>
                    </div>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-center gap-4 mt-6">
                    <button
                        onClick={resetTimer}
                        className="p-3 rounded-lg bg-surface-100 dark:bg-surface-800 hover:bg-surface-200 dark:hover:bg-surface-700 transition-colors"
                    >
                        <RotateCcw className="w-5 h-5 text-surface-500 dark:text-surface-400" />
                    </button>

                    <button
                        onClick={toggleTimer}
                        className={`
                            p-5 rounded-xl transition-all
                            ${isRunning
                                ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                                : 'bg-primary-700 text-white hover:bg-primary-800'
                            }
                        `}
                    >
                        {isRunning ? (
                            <Pause className="w-6 h-6" />
                        ) : (
                            <Play className="w-6 h-6" fill="currentColor" />
                        )}
                    </button>

                    <div className="p-3 rounded-lg bg-surface-100 dark:bg-surface-800">
                        <div className="text-center">
                            <span className="text-xl font-bold text-surface-900 dark:text-surface-100">
                                {sessions}
                            </span>
                            <p className="text-xs text-surface-500 dark:text-surface-400">Sessions</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tips */}
            <div className="card p-4">
                <h3 className="section-label mb-3 flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    How it works
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                    <div className="p-3 rounded-lg bg-surface-50 dark:bg-surface-800/50">
                        <div className="flex items-center gap-2 mb-1">
                            <div className="w-5 h-5 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-xs font-bold text-primary-700 dark:text-primary-400">
                                1
                            </div>
                            <span className="font-medium text-surface-900 dark:text-surface-100">Focus</span>
                        </div>
                        <p className="text-surface-500 dark:text-surface-400 text-xs">
                            Work for 25 minutes on a single task
                        </p>
                    </div>
                    <div className="p-3 rounded-lg bg-surface-50 dark:bg-surface-800/50">
                        <div className="flex items-center gap-2 mb-1">
                            <div className="w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-xs font-bold text-green-700 dark:text-green-400">
                                2
                            </div>
                            <span className="font-medium text-surface-900 dark:text-surface-100">Break</span>
                        </div>
                        <p className="text-surface-500 dark:text-surface-400 text-xs">
                            Take a 5 minute short break
                        </p>
                    </div>
                    <div className="p-3 rounded-lg bg-surface-50 dark:bg-surface-800/50">
                        <div className="flex items-center gap-2 mb-1">
                            <div className="w-5 h-5 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-xs font-bold text-amber-700 dark:text-amber-400">
                                3
                            </div>
                            <span className="font-medium text-surface-900 dark:text-surface-100">Repeat</span>
                        </div>
                        <p className="text-surface-500 dark:text-surface-400 text-xs">
                            After 4 sessions, take a 15 min break
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}