import { useState, useEffect, useMemo } from 'react'
import { CheckSquare, Plus, Trash2, X, Flame, Target } from 'lucide-react'

const STORAGE_KEY = 'habitTrackerData'
const COLORS = ['#0f766e', '#16a34a', '#ca8a04', '#dc2626', '#7c3aed', '#db2777', '#ea580c']

function getToday() {
    return new Date().toISOString().split('T')[0]
}

function loadData() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY)
        return raw ? JSON.parse(raw) : { habits: [], completions: {} }
    } catch {
        return { habits: [], completions: {} }
    }
}

function saveData(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

function getStreak(habitId, habits, completions) {
    const habit = habits.find((h) => h.id === habitId)
    if (!habit) return 0

    let streak = 0
    let currentDate = new Date()

    while (true) {
        const dateStr = currentDate.toISOString().split('T')[0]
        const completed = completions[dateStr]?.[habitId] || 0

        if (completed >= habit.goal) {
            streak++
            currentDate.setDate(currentDate.getDate() - 1)
        } else if (dateStr === getToday()) {
            currentDate.setDate(currentDate.getDate() - 1)
        } else {
            break
        }

        if (streak > 365) break
    }

    return streak
}

function ContributionGraph({ habit, completions }) {
    const days = useMemo(() => {
        const result = []
        const today = new Date()
        for (let i = 60; i >= 0; i--) {
            const date = new Date(today)
            date.setDate(today.getDate() - i)
            result.push(date)
        }
        return result
    }, [])

    return (
        <div className="mt-3">
            <div className="flex gap-[2px] flex-wrap">
                {days.map((date) => {
                    const dateStr = date.toISOString().split('T')[0]
                    const count = completions[dateStr]?.[habit.id] || 0
                    const level = Math.min(Math.floor((count / habit.goal) * 3), 3)

                    const colors = [
                        'bg-surface-200 dark:bg-surface-700',
                        'bg-primary-200 dark:bg-primary-800',
                        'bg-primary-400 dark:bg-primary-600',
                        'bg-primary-600 dark:bg-primary-400',
                    ]

                    return (
                        <div
                            key={dateStr}
                            className={`w-2.5 h-2.5 rounded-sm ${colors[level]} transition-colors`}
                            title={`${dateStr}: ${count}/${habit.goal}`}
                        />
                    )
                })}
            </div>
        </div>
    )
}

export default function HabitsPage() {
    const [data, setData] = useState({ habits: [], completions: {} })
    const [showForm, setShowForm] = useState(false)
    const [form, setForm] = useState({ name: '', goal: 1, category: '' })

    useEffect(() => {
        setData(loadData())
    }, [])

    useEffect(() => {
        saveData(data)
    }, [data])

    const addHabit = () => {
        if (!form.name.trim()) return

        const newHabit = {
            id: Date.now().toString(),
            name: form.name.trim(),
            goal: form.goal || 1,
            category: form.category.trim() || 'General',
            createdAt: new Date().toISOString(),
            color: COLORS[Math.floor(Math.random() * COLORS.length)],
        }

        setData((prev) => ({
            ...prev,
            habits: [...prev.habits, newHabit],
        }))

        setForm({ name: '', goal: 1, category: '' })
        setShowForm(false)
    }

    const deleteHabit = (id) => {
        if (!confirm('Delete this habit?')) return

        setData((prev) => {
            const newCompletions = { ...prev.completions }
            Object.keys(newCompletions).forEach((date) => {
                delete newCompletions[date]?.[id]
            })
            return {
                habits: prev.habits.filter((h) => h.id !== id),
                completions: newCompletions,
            }
        })
    }

    const toggleCompletion = (id) => {
        const today = getToday()

        setData((prev) => {
            const newCompletions = { ...prev.completions }
            if (!newCompletions[today]) newCompletions[today] = {}
            if (!newCompletions[today][id]) newCompletions[today][id] = 0

            const habit = prev.habits.find((h) => h.id === id)
            newCompletions[today][id]++

            if (newCompletions[today][id] > habit.goal) {
                newCompletions[today][id] = 0
            }

            return { ...prev, completions: newCompletions }
        })
    }

    const today = getToday()

    // Group habits by category
    const grouped = useMemo(() => {
        const groups = {}
        data.habits.forEach((h) => {
            const cat = h.category || 'General'
            if (!groups[cat]) groups[cat] = []
            groups[cat].push(h)
        })
        return groups
    }, [data.habits])

    // Stats
    const stats = useMemo(() => {
        let completed = 0
        let maxStreak = 0

        data.habits.forEach((h) => {
            const count = data.completions[today]?.[h.id] || 0
            if (count >= h.goal) completed++

            const streak = getStreak(h.id, data.habits, data.completions)
            if (streak > maxStreak) maxStreak = streak
        })

        return { total: data.habits.length, completed, maxStreak }
    }, [data, today])

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-lg bg-violet-100 dark:bg-violet-900/30">
                        <CheckSquare className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                    </div>
                    <div>
                        <h1 className="text-lg font-semibold text-surface-900 dark:text-surface-100">
                            Habit Tracker
                        </h1>
                        <p className="text-sm text-surface-500 dark:text-surface-400">
                            Track daily habits with streaks
                        </p>
                    </div>
                </div>
                <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
                    <Plus className="w-4 h-4" />
                    Add Habit
                </button>
            </div>

            {/* Add Habit Form */}
            {showForm && (
                <div className="card p-4">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="font-medium text-surface-900 dark:text-surface-100 text-sm">New Habit</h3>
                        <button
                            onClick={() => setShowForm(false)}
                            className="text-surface-400 hover:text-surface-600 dark:hover:text-surface-200"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div>
                            <label className="block text-xs text-surface-500 dark:text-surface-400 mb-1">
                                Habit Name
                            </label>
                            <input
                                type="text"
                                value={form.name}
                                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                                placeholder="e.g., Morning Exercise"
                                className="input"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-surface-500 dark:text-surface-400 mb-1">
                                Daily Goal
                            </label>
                            <input
                                type="number"
                                min="1"
                                value={form.goal}
                                onChange={(e) => setForm((f) => ({ ...f, goal: parseInt(e.target.value) || 1 }))}
                                className="input"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-surface-500 dark:text-surface-400 mb-1">
                                Category
                            </label>
                            <input
                                type="text"
                                value={form.category}
                                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                                placeholder="e.g., Health, Study"
                                className="input"
                            />
                        </div>
                    </div>
                    <div className="flex gap-2 mt-3">
                        <button onClick={addHabit} className="btn btn-primary">
                            Save Habit
                        </button>
                        <button onClick={() => setShowForm(false)} className="btn btn-secondary">
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2">
                <div className="card p-3 text-center">
                    <Target className="w-4 h-4 text-surface-400 mx-auto mb-1" />
                    <div className="text-xl font-bold text-surface-900 dark:text-surface-100">{stats.total}</div>
                    <div className="text-xs text-surface-500 dark:text-surface-400">Total Habits</div>
                </div>
                <div className="card p-3 text-center">
                    <CheckSquare className="w-4 h-4 text-green-600 dark:text-green-400 mx-auto mb-1" />
                    <div className="text-xl font-bold text-surface-900 dark:text-surface-100">{stats.completed}</div>
                    <div className="text-xs text-surface-500 dark:text-surface-400">Done Today</div>
                </div>
                <div className="card p-3 text-center">
                    <Flame className="w-4 h-4 text-amber-600 dark:text-amber-400 mx-auto mb-1" />
                    <div className="text-xl font-bold text-surface-900 dark:text-surface-100">{stats.maxStreak}</div>
                    <div className="text-xs text-surface-500 dark:text-surface-400">Best Streak</div>
                </div>
            </div>

            {/* Habits List */}
            {data.habits.length === 0 ? (
                <div className="card p-8 text-center">
                    <CheckSquare className="w-10 h-10 text-surface-300 dark:text-surface-600 mx-auto mb-3" />
                    <p className="text-surface-500 dark:text-surface-400 text-sm">
                        No habits yet. Click "Add Habit" to start tracking!
                    </p>
                </div>
            ) : (
                Object.entries(grouped).map(([category, habits]) => (
                    <div key={category}>
                        <h3 className="section-label mb-2 px-1">{category}</h3>
                        <div className="space-y-2">
                            {habits.map((habit) => {
                                const completed = data.completions[today]?.[habit.id] || 0
                                const isComplete = completed >= habit.goal
                                const progress = Math.min((completed / habit.goal) * 100, 100)
                                const streak = getStreak(habit.id, data.habits, data.completions)

                                return (
                                    <div key={habit.id} className={`card p-4 ${isComplete ? 'opacity-75' : ''}`}>
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                <div
                                                    className="w-2.5 h-2.5 rounded-full"
                                                    style={{ backgroundColor: habit.color }}
                                                />
                                                <span className="font-medium text-surface-900 dark:text-surface-100 text-sm">
                                                    {habit.name}
                                                </span>
                                                {streak > 0 && (
                                                    <span className="badge bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-2xs flex items-center gap-1">
                                                        <Flame className="w-3 h-3" /> {streak} day{streak > 1 ? 's' : ''}
                                                    </span>
                                                )}
                                            </div>
                                            <button
                                                onClick={() => deleteHabit(habit.id)}
                                                className="p-1.5 text-surface-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>

                                        {/* Progress */}
                                        <div className="flex items-center justify-between text-xs mb-1.5">
                                            <span className="text-surface-500 dark:text-surface-400">
                                                Progress: {completed} / {habit.goal}
                                            </span>
                                            <span
                                                className={
                                                    isComplete
                                                        ? 'text-green-600 dark:text-green-400'
                                                        : 'text-primary-600 dark:text-primary-400'
                                                }
                                            >
                                                {Math.round(progress)}%
                                            </span>
                                        </div>
                                        <div className="h-1.5 bg-surface-200 dark:bg-surface-700 rounded-full overflow-hidden">
                                            <div
                                                className="h-full transition-all duration-300 rounded-full"
                                                style={{
                                                    width: `${progress}%`,
                                                    backgroundColor: isComplete ? '#16a34a' : habit.color,
                                                }}
                                            />
                                        </div>

                                        {/* Contribution Graph */}
                                        <ContributionGraph habit={habit} completions={data.completions} />

                                        {/* Action Button */}
                                        <button
                                            onClick={() => toggleCompletion(habit.id)}
                                            className={`w-full mt-3 py-2 rounded-lg font-medium text-sm transition-all ${isComplete
                                                    ? 'bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700 text-green-700 dark:text-green-300'
                                                    : 'bg-primary-100 dark:bg-primary-900/30 border border-primary-300 dark:border-primary-700 text-primary-700 dark:text-primary-300 hover:bg-primary-200 dark:hover:bg-primary-900/50'
                                                }`}
                                        >
                                            {isComplete ? '✓ Completed' : '+ Mark Progress'}
                                        </button>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                ))
            )}
        </div>
    )
}