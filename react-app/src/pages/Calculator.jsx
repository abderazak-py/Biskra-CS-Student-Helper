import { useState, useMemo, useEffect } from 'react'
import { Calculator, RefreshCw, Award, AlertCircle } from 'lucide-react'
import { MODULES, SEMESTERS } from '../data/modules'

const STORAGE_KEY = 'calculator_grades'

function getModuleAverage(module, grades) {
    if (module.single) {
        return grades[`${module.key}_exam`] ?? null
    }
    if (module.tpOnly) {
        const exam = grades[`${module.key}_exam`]
        const tp = grades[`${module.key}_tp`]
        if (exam == null || tp == null) return null
        return exam * 0.6 + tp * 0.4
    }
    if (module.hasTP) {
        const exam = grades[`${module.key}_exam`]
        const td = grades[`${module.key}_td`]
        const tp = grades[`${module.key}_tp`]
        if (exam == null || td == null || tp == null) return null
        return exam * 0.6 + td * 0.2 + tp * 0.2
    }
    // Regular modules: Exam + TD
    const exam = grades[`${module.key}_exam`]
    const td = grades[`${module.key}_td`]
    if (exam == null || td == null) return null
    return exam * 0.6 + td * 0.4
}

function getModuleGrade(module, avg) {
    if (avg == null) return null
    if (module.optional) {
        return avg >= 10 ? avg : 0
    }
    return avg
}

export default function CalculatorPage() {
    const [semester, setSemester] = useState(() => {
        const saved = localStorage.getItem(STORAGE_KEY)
        return saved ? Object.keys(JSON.parse(saved))[0] || 's1' : 's1'
    })
    const [allGrades, setAllGrades] = useState(() => {
        const saved = localStorage.getItem(STORAGE_KEY)
        return saved ? JSON.parse(saved) : {}
    })

    const grades = allGrades[semester] || {}

    const modules = MODULES[semester] || []

    // Save to localStorage whenever semester or grades change
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(allGrades))
    }, [allGrades])

    const handleGradeChange = (key, value) => {
        const numValue = value === '' ? null : parseFloat(value)
        const newGrades = { ...grades, [key]: numValue }
        // Update state for current semester grades
        setAllGrades((prev) => ({
            ...prev,
            [semester]: newGrades,
        }))
    }

    const resetGrades = () => {
        setAllGrades((prev) => ({
            ...prev,
            [semester]: {},
        }))
    }

    const result = useMemo(() => {
        let totalCoef = 0
        let totalPoints = 0
        let allFilled = true
        let totalCredits = 0
        let earnedCredits = 0
        const hasCredits = modules.some((m) => m.credit !== undefined)

        if (hasCredits) {
            totalCredits = modules.reduce((sum, m) => sum + (m.credit || 0), 0)
        }

        modules.forEach((module) => {
            const avg = getModuleAverage(module, grades)
            
            if (hasCredits && avg != null && avg >= 10) {
                earnedCredits += module.credit || 0
            }

            if (avg == null) {
                allFilled = false
                return
            }
            const grade = getModuleGrade(module, avg)
            if (grade == null) {
                allFilled = false
                return
            }
            totalCoef += module.coef
            totalPoints += grade * module.coef
        })

        const average = (allFilled && totalCoef > 0) ? totalPoints / totalCoef : null

        // Apply LMD compensation rule: if overall average >= 10, all credits are earned
        if (hasCredits && allFilled && average != null && average >= 10) {
            earnedCredits = totalCredits
        }

        return { average, totalCoef, allFilled, hasCredits, totalCredits, earnedCredits }
    }, [modules, grades])

    const getGradeColor = (avg) => {
        if (avg == null) return 'text-surface-400'
        if (avg >= 16) return 'text-green-600 dark:text-green-400'
        if (avg >= 12) return 'text-primary-600 dark:text-primary-400'
        if (avg >= 10) return 'text-amber-600 dark:text-amber-400'
        return 'text-red-600 dark:text-red-400'
    }

    const getGradeStatus = (avg) => {
        if (avg == null) return null
        if (avg >= 10) return { text: 'Passed', color: 'badge-success' }
        return { text: 'Failed', color: 'badge-danger' }
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-lg bg-primary-100 dark:bg-primary-900/30">
                        <Calculator className="w-5 h-5 text-primary-700 dark:text-primary-400" />
                    </div>
                    <div>
                        <h1 className="text-lg font-semibold text-surface-900 dark:text-surface-100">
                            Semester Calculator
                        </h1>
                        <p className="text-sm text-surface-500 dark:text-surface-400">
                            Enter your grades to calculate your average
                        </p>
                    </div>
                </div>

                <button onClick={resetGrades} className="btn btn-ghost self-start sm:self-center">
                    <RefreshCw className="w-4 h-4" />
                    Reset
                </button>
            </div>

            {/* Semester Selector */}
            <div className="card p-4">
                <label className="section-label mb-3 block">Select Semester</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                    {SEMESTERS.map((sem) => (
                        <button
                            key={sem.key}
                            onClick={() => setSemester(sem.key)}
                            className={`
                                p-2.5 rounded-lg text-center transition-all text-sm
                                ${semester === sem.key
                                    ? 'bg-primary-100 dark:bg-primary-900/30 border border-primary-300 dark:border-primary-700 text-primary-700 dark:text-primary-300'
                                    : 'bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 text-surface-600 dark:text-surface-400 hover:border-surface-300 dark:hover:border-surface-600'
                                }
                            `}
                        >
                            <div className="font-medium">{sem.label}</div>
                            <div className="text-xs opacity-70">{sem.description}</div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Grade Inputs */}
            <div className="card p-4">
                <h2 className="section-label mb-4">Enter Your Grades</h2>
                <div className="space-y-3">
                    {modules.map((module) => {
                        const examKey = `${module.key}_exam`
                        const tdKey = `${module.key}_td`
                        const tpKey = `${module.key}_tp`
                        const avg = getModuleAverage(module, grades)
                        const gradeColor = getGradeColor(avg)

                        return (
                            <div
                                key={module.key}
                                className="p-3 rounded-lg bg-surface-50 dark:bg-surface-800/50 border border-surface-200 dark:border-surface-700"
                            >
                                {/* Mobile: Module name left, coef right */}
                                <div className="flex justify-between items-center sm:hidden mb-3">
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium text-surface-900 dark:text-surface-100 text-sm truncate">
                                            {module.name}
                                        </span>
                                        {module.optional && (
                                            <span className="badge badge-primary text-2xs">Optional</span>
                                        )}
                                    </div>
                                    <span className="text-xs text-surface-400 dark:text-surface-500">
                                        Coef: {module.coef} {module.credit !== undefined ? `| Credit: ${module.credit}` : ''}
                                    </span>
                                </div>

                                <div className="sm:flex sm:flex-row sm:items-center sm:gap-3">
                                    {/* Desktop: Module name and coef */}
                                    <div className="hidden sm:flex-shrink-0 sm:min-w-0 sm:max-w-[120px] sm:max-w-none sm:flex-1 sm:flex sm:flex-col">
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium text-surface-900 dark:text-surface-100 text-sm truncate">
                                                {module.name}
                                            </span>
                                            {module.optional && (
                                                <span className="badge badge-primary text-2xs">Optional</span>
                                            )}
                                        </div>
                                        <span className="text-xs text-surface-400 dark:text-surface-500">
                                            Coef: {module.coef} {module.credit !== undefined ? `| Credit: ${module.credit}` : ''}
                                        </span>
                                    </div>

                                    {/* Grade inputs row: inputs left, average right */}
                                    <div className="flex items-center justify-between gap-2 sm:gap-3 w-full sm:w-auto">
                                        {/* Inputs container - left side */}
                                        <div className="flex items-center gap-2 sm:gap-3">
                                            {/* Exam input - shown for all except single modules (which still use exam key) */}
                                            {!module.single && (
                                                <div className="flex flex-col">
                                                    <label className="text-xs text-surface-400 dark:text-surface-500 mb-1">
                                                        Exam
                                                    </label>
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        max="20"
                                                        step="0.25"
                                                        value={grades[examKey] ?? ''}
                                                        onChange={(e) => handleGradeChange(examKey, e.target.value)}
                                                        className="input w-16 sm:w-20 text-center text-sm py-2"
                                                        placeholder="0-20"
                                                    />
                                                </div>
                                            )}

                                            {/* TD input - shown for regular modules and hasTP modules */}
                                            {!module.single && !module.tpOnly && (
                                                <div className="flex flex-col">
                                                    <label className="text-xs text-surface-400 dark:text-surface-500 mb-1">
                                                        TD
                                                    </label>
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        max="20"
                                                        step="0.25"
                                                        value={grades[tdKey] ?? ''}
                                                        onChange={(e) => handleGradeChange(tdKey, e.target.value)}
                                                        className="input w-16 sm:w-20 text-center text-sm py-2"
                                                        placeholder="0-20"
                                                    />
                                                </div>
                                            )}

                                            {/* TP input - shown for hasTP and tpOnly modules */}
                                            {(module.hasTP || module.tpOnly) && (
                                                <div className="flex flex-col">
                                                    <label className="text-xs text-surface-400 dark:text-surface-500 mb-1">
                                                        TP
                                                    </label>
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        max="20"
                                                        step="0.25"
                                                        value={grades[tpKey] ?? ''}
                                                        onChange={(e) => handleGradeChange(tpKey, e.target.value)}
                                                        className="input w-16 sm:w-20 text-center text-sm py-2"
                                                        placeholder="0-20"
                                                    />
                                                </div>
                                            )}

                                            {/* Single module input */}
                                            {module.single && (
                                                <div className="flex flex-col">
                                                    <label className="text-xs text-surface-400 dark:text-surface-500 mb-1">
                                                        Grade
                                                    </label>
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        max="20"
                                                        step="0.25"
                                                        value={grades[examKey] ?? ''}
                                                        onChange={(e) => handleGradeChange(examKey, e.target.value)}
                                                        className="input w-16 sm:w-20 text-center text-sm py-2"
                                                        placeholder="0-20"
                                                    />
                                                </div>
                                            )}
                                        </div>

                                        {/* Module average - right side */}
                                        <div className="flex flex-col items-center min-w-[64px]">
                                            <label className="text-xs text-surface-400 dark:text-surface-500 mb-1">
                                                Avg
                                            </label>
                                            <span className={`text-base font-semibold ${gradeColor}`}>
                                                {avg != null ? avg.toFixed(2) : '-'}
                                            </span>
                                            {module.credit !== undefined && avg != null && (
                                                <span className={`text-2xs mt-0.5 font-medium ${avg >= 10 ? 'text-green-600 dark:text-green-400' : 'text-surface-400 dark:text-surface-500'}`}>
                                                    {avg >= 10 ? `+${module.credit} Cr` : '0 Cr'}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Result */}
            <div className={result.hasCredits ? "grid grid-cols-1 md:grid-cols-2 gap-4" : ""}>
                {/* Average Card */}
                <div className="card p-4 flex flex-col justify-between">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 w-full">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-lg bg-primary-100 dark:bg-primary-900/30">
                                <Award className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                            </div>
                            <div>
                                <p className="text-xs text-surface-500 dark:text-surface-400 uppercase tracking-wide">
                                    Semester Average
                                </p>
                                <p className={`text-3xl font-bold ${getGradeColor(result.average)}`}>
                                    {result.average != null ? result.average.toFixed(2) : '--.--'}
                                </p>
                            </div>
                        </div>

                        {result.average != null && (
                            <div className="flex items-center gap-3">
                                {getGradeStatus(result.average) && (
                                    <span
                                        className={`badge ${getGradeStatus(result.average).color} text-sm px-3 py-1.5`}
                                    >
                                        {getGradeStatus(result.average).text}
                                    </span>
                                )}
                            </div>
                        )}
                    </div>

                    {!result.allFilled && result.average == null && (
                        <div className="mt-4 flex items-center gap-2 text-sm text-surface-400 dark:text-surface-500">
                            <AlertCircle className="w-4 h-4" />
                            Enter your grades to calculate the average
                        </div>
                    )}
                </div>

                {/* Credit Score Card */}
                {result.hasCredits && (
                    <div className="card p-4 flex flex-col justify-between">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 w-full">
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
                                    <Award className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                                </div>
                                <div>
                                    <p className="text-xs text-surface-500 dark:text-surface-400 uppercase tracking-wide">
                                        Credit Score
                                    </p>
                                    <p className={`text-3xl font-bold ${result.earnedCredits === result.totalCredits && result.totalCredits > 0 ? 'text-green-600 dark:text-green-400' : 'text-amber-600 dark:text-amber-400'}`}>
                                        {result.earnedCredits} / {result.totalCredits}
                                    </p>
                                </div>
                            </div>

                            {result.average != null && (
                                <div className="flex items-center gap-3">
                                    {result.average >= 10 ? (
                                        <span className="badge badge-success text-sm px-3 py-1.5">
                                            Fully Acquired
                                        </span>
                                    ) : result.earnedCredits > 0 ? (
                                        <span className="badge badge-warning text-sm px-3 py-1.5">
                                            Partially Acquired
                                        </span>
                                    ) : (
                                        <span className="badge badge-danger text-sm px-3 py-1.5">
                                            None Acquired
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="mt-4 flex items-start gap-2 text-xs text-surface-400 dark:text-surface-500">
                            <AlertCircle className="w-4 h-4 flex-shrink-0" />
                            <span>
                                {result.average != null && result.average >= 10 
                                    ? "Passed by compensation: All 30 credits acquired."
                                    : "Acquire credits by scoring >= 10.00 in individual modules."
                                }
                            </span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}