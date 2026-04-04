import { useState } from 'react'
import { Moon, Sun, Star, Check, RotateCcw } from 'lucide-react'
import { ADKAR_MORNING, ADKAR_EVENING, ADKAR_GENERAL } from '../data/adkar'

const CATEGORIES = [
    { key: 'morning', label: 'Morning', icon: Sun, data: ADKAR_MORNING, bg: 'bg-amber-100 dark:bg-amber-900/30', color: 'text-amber-600 dark:text-amber-400' },
    { key: 'evening', label: 'Evening', icon: Moon, data: ADKAR_EVENING, bg: 'bg-indigo-100 dark:bg-indigo-900/30', color: 'text-indigo-600 dark:text-indigo-400' },
    { key: 'general', label: 'General', icon: Star, data: ADKAR_GENERAL, bg: 'bg-emerald-100 dark:bg-emerald-900/30', color: 'text-emerald-600 dark:text-emerald-400' },
]

function DikrCard({ dikr, index }) {
    const [count, setCount] = useState(0)
    const isComplete = count >= dikr.count

    const handleTap = () => {
        if (count < dikr.count) {
            setCount((prev) => prev + 1)
        }
    }

    const handleReset = (e) => {
        e.stopPropagation()
        setCount(0)
    }

    const progress = (count / dikr.count) * 100

    return (
        <div
            onClick={handleTap}
            className={`
                card p-4 cursor-pointer select-none transition-all
                ${isComplete ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700' : ''}
            `}
        >
            {/* Arabic Text */}
            <p
                className="text-lg leading-relaxed text-surface-900 dark:text-surface-100 text-right mb-3"
                dir="rtl"
                style={{ fontFamily: 'Amiri, serif' }}
            >
                {dikr.text}
            </p>

            {/* Progress and Counter */}
            <div className="flex items-center justify-between gap-3">
                {/* Counter */}
                <div className="flex items-center gap-2">
                    <div
                        className={`
                        flex items-center gap-2 px-3 py-1.5 rounded-lg
                        ${isComplete
                                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                                : 'bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-400'
                            }
                    `}
                    >
                        {isComplete ? (
                            <Check className="w-4 h-4" />
                        ) : (
                            <span className="text-xs font-medium">{dikr.count}×</span>
                        )}
                        <span className="font-bold">{count}</span>
                    </div>

                    {/* Reset button */}
                    {count > 0 && (
                        <button
                            onClick={handleReset}
                            className="p-1.5 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 text-surface-400 hover:text-surface-600 dark:hover:text-surface-200 transition-colors"
                        >
                            <RotateCcw className="w-3.5 h-3.5" />
                        </button>
                    )}
                </div>

                {/* Progress bar */}
                <div className="flex-1 h-1.5 bg-surface-200 dark:bg-surface-700 rounded-full overflow-hidden">
                    <div
                        className={`h-full rounded-full transition-all duration-300 ${isComplete ? 'bg-green-500' : 'bg-primary-500'}`}
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>
        </div>
    )
}

export default function AdkarPage() {
    const [category, setCategory] = useState('morning')
    const currentCategory = CATEGORIES.find((c) => c.key === category)

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-indigo-100 dark:bg-indigo-900/30">
                    <Moon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                    <h1 className="text-lg font-semibold text-surface-900 dark:text-surface-100">Adkar</h1>
                    <p className="text-sm text-surface-500 dark:text-surface-400">
                        Morning, evening & general supplications
                    </p>
                </div>
            </div>

            {/* Category Selector */}
            <div className="flex gap-2">
                {CATEGORIES.map((cat) => {
                    const Icon = cat.icon
                    return (
                        <button
                            key={cat.key}
                            onClick={() => setCategory(cat.key)}
                            className={`
                                flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg font-medium transition-all text-sm
                                ${category === cat.key
                                    ? 'bg-primary-100 dark:bg-primary-900/30 border border-primary-300 dark:border-primary-700 text-primary-700 dark:text-primary-300'
                                    : 'bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 text-surface-600 dark:text-surface-400 hover:border-surface-300 dark:hover:border-surface-600'
                                }
                            `}
                        >
                            <Icon className={`w-4 h-4 ${category === cat.key ? '' : cat.color}`} />
                            <span className="hidden sm:inline">{cat.label}</span>
                        </button>
                    )
                })}
            </div>

            {/* Adkar List */}
            <div className="space-y-2">
                {currentCategory.data.map((dikr, index) => (
                    <DikrCard key={index} dikr={dikr} index={index} />
                ))}
            </div>

            {/* Info */}
            <div className="card p-3 text-center">
                <p className="text-xs text-surface-500 dark:text-surface-400">
                    Tap on a card to count. Complete all repetitions for each dikr.
                </p>
            </div>
        </div>
    )
}