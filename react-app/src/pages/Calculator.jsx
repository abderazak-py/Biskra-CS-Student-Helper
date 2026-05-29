import { useState, useMemo, useEffect } from 'react'
import { Calculator, RefreshCw, Award, AlertCircle } from 'lucide-react'
import { MODULES, SEMESTERS } from '../data/modules'
import useSEO from '../hooks/useSEO'

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

const getUnitLabel = (unitCode) => {
    if (!unitCode) return 'Other Unit'

    // Map of specific unit codes to friendly names
    const specMap = {
        // Semester 1
        'C00D0001S1': 'UE Découverte (C00D0001S1)',
        'C00F0001S1_1': 'UE Fondamentale 1 (C00F0001S1)',
        'C00M0001S1': 'UE Méthodologique (C00M0001S1)',
        'C00F0001S1_2': 'UE Fondamentale 2 (C00F0001S1)',
        'C00T0001S1': 'UE Transversale (C00T0001S1)',

        // Semester 2
        'C00M0001S2': 'UE Méthodologique (C00M0001S2)',
        'C00F0001S2_1': 'UE Fondamentale 1 (C00F0001S2)',
        'C00F0001S2_2': 'UE Fondamentale 2 (C00F0001S2)',
        'C00T0001S2': 'UE Transversale (C00T0001S2)',

        // Semester 3
        'C00F0001S3_1': 'UE Fondamentale 1 (C00F0001S3)',
        'C00F0001S3_2': 'UE Fondamentale 2 (C00F0001S3)',
        'C00M0001S3': 'UE Méthodologique (C00M0001S3)',
        'C00T0001S3': 'UE Transversale (C00T0001S3)',

        // Semester 4
        'C00F0001S4_1': 'UE Fondamentale 1 (C00F0001S4)',
        'C00F0001S4_2': 'UE Fondamentale 2 (C00F0001S4)',
        'C00T0001S4': 'UE Transversale (C00T0001S4)',
    }

    if (specMap[unitCode]) return specMap[unitCode]

    if (unitCode.startsWith('C00')) {
        const typeChar = unitCode.charAt(3) // 'F', 'M', 'D', 'T'
        let typeName = 'UE'
        switch (typeChar) {
            case 'F': typeName = 'UE Fondamentale'; break;
            case 'M': typeName = 'UE Méthodologique'; break;
            case 'D': typeName = 'UE Découverte'; break;
            case 'T': typeName = 'UE Transversale'; break;
        }
        return `${typeName} (${unitCode})`
    }
    const lmdMap = {
        'UEF1': 'UE Fondamentale 1',
        'UEF2': 'UE Fondamentale 2',
        'UEM': 'UE Méthodologique',
        'UEM1': 'UE Méthodologique 1',
        'UEM2': 'UE Méthodologique 2',
        'UED': 'UE Découverte',
        'UET': 'UE Transversale'
    }
    return lmdMap[unitCode] || unitCode
}

export default function CalculatorPage() {
    useSEO({
        title: 'Semester GPA Calculator',
        description: 'Calculate your semester GPA (Grade Point Average) for University of Biskra. Supports both LMD and State Engineer academic pathways.',
        canonicalPath: '/calculator'
    })

    const [system, setSystem] = useState(() => {
        const savedSystem = localStorage.getItem('calculator_system')
        if (savedSystem === 'lmd' || savedSystem === 'eng') return savedSystem
        return 'lmd'
    })

    const [semester, setSemester] = useState(() => {
        const savedSem = localStorage.getItem('calculator_semester')
        if (savedSem) {
            const isEngSem = savedSem.startsWith('eng_')
            const currentSystem = localStorage.getItem('calculator_system') || 'lmd'
            if (currentSystem === 'eng' && isEngSem) return savedSem
            if (currentSystem === 'lmd' && !isEngSem) return savedSem
        }
        const currentSystem = localStorage.getItem('calculator_system') || 'lmd'
        return currentSystem === 'eng' ? 'eng_s1' : 's1'
    })

    const [allGrades, setAllGrades] = useState(() => {
        const saved = localStorage.getItem(STORAGE_KEY)
        return saved ? JSON.parse(saved) : {}
    })

    const grades = allGrades[semester] || {}
    const modules = MODULES[semester] || []

    // Save to localStorage whenever system, semester or grades change
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(allGrades))
    }, [allGrades])

    useEffect(() => {
        localStorage.setItem('calculator_system', system)
    }, [system])

    useEffect(() => {
        localStorage.setItem('calculator_semester', semester)
    }, [semester])

    const handleSystemChange = (newSystem) => {
        setSystem(newSystem)
        setSemester(newSystem === 'eng' ? 'eng_s1' : 's1')
    }

    const handleGradeChange = (key, value) => {
        const numValue = value === '' ? null : parseFloat(value)
        const newGrades = { ...grades, [key]: numValue }
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

    // Group modules by unit and calculate unit metrics
    const unitsData = useMemo(() => {
        const groups = {}
        modules.forEach((module) => {
            const unitCode = module.unit || 'other'
            if (!groups[unitCode]) {
                groups[unitCode] = {
                    code: unitCode,
                    modules: [],
                    totalCoef: 0,
                    totalPoints: 0,
                    allFilled: true,
                    anyFilled: false,
                    totalCredits: 0,
                    earnedCredits: 0
                }
            }
            groups[unitCode].modules.push(module)

            const avg = getModuleAverage(module, grades)
            if (avg != null) {
                groups[unitCode].anyFilled = true
                groups[unitCode].totalCoef += module.coef

                const grade = getModuleGrade(module, avg)
                if (grade != null) {
                    groups[unitCode].totalPoints += grade * module.coef
                }
            } else {
                groups[unitCode].allFilled = false
            }

            if (module.credit !== undefined) {
                groups[unitCode].totalCredits += module.credit
                if (avg != null && avg >= 10) {
                    groups[unitCode].earnedCredits += module.credit
                }
            }
        })

        // Finalize averages and apply Unit-level compensation
        Object.keys(groups).forEach((code) => {
            const group = groups[code]
            if (group.allFilled && group.totalCoef > 0) {
                group.average = group.totalPoints / group.totalCoef
                if (group.average >= 10) {
                    group.earnedCredits = group.totalCredits
                }
            } else {
                group.average = null
            }
        })

        return groups
    }, [modules, grades])

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

        // Apply compensation rules for credits
        if (hasCredits) {
            if (allFilled && average != null && average >= 10) {
                // Semester compensation: overall average >= 10 wins all credits
                earnedCredits = totalCredits
            } else {
                // Sum up credits: either unit-compensated or individual module success
                Object.values(unitsData).forEach((unitGroup) => {
                    if (unitGroup.average != null && unitGroup.average >= 10) {
                        earnedCredits += unitGroup.totalCredits
                    } else {
                        unitGroup.modules.forEach((module) => {
                            const avg = getModuleAverage(module, grades)
                            if (avg != null && avg >= 10) {
                                earnedCredits += module.credit || 0
                            }
                        })
                    }
                })
            }
        }

        return { average, totalCoef, allFilled, hasCredits, totalCredits, earnedCredits }
    }, [modules, grades, unitsData])

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

    const systemSemesters = SEMESTERS.filter((sem) => sem.system === system)

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

            {/* Pathway Selector */}
            <div className="card p-1.5 bg-surface-100 dark:bg-surface-800/40 border border-surface-200 dark:border-surface-700/50 flex gap-2">
                <button
                    onClick={() => handleSystemChange('lmd')}
                    className={`flex-1 py-2.5 px-4 rounded-md font-medium text-sm transition-all duration-200 ${system === 'lmd'
                            ? 'bg-white dark:bg-surface-700 text-primary-600 dark:text-primary-400 shadow-sm border border-surface-200/50 dark:border-surface-600/50'
                            : 'text-surface-500 dark:text-surface-400 hover:text-surface-700 dark:hover:text-surface-300'
                        }`}
                >
                    LMD (Licence)
                </button>
                <button
                    onClick={() => handleSystemChange('eng')}
                    className={`flex-1 py-2.5 px-4 rounded-md font-medium text-sm transition-all duration-200 ${system === 'eng'
                            ? 'bg-white dark:bg-surface-700 text-primary-600 dark:text-primary-400 shadow-sm border border-surface-200/50 dark:border-surface-600/50'
                            : 'text-surface-500 dark:text-surface-400 hover:text-surface-700 dark:hover:text-surface-300'
                        }`}
                >
                    Engineer
                </button>
            </div>

            {/* Semester Selector */}
            <div className="card p-4">
                <label className="section-label mb-3 block">Select Semester</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                    {systemSemesters.map((sem) => (
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

            {/* Grade Inputs Grouped by Teaching Unit */}
            <div className="space-y-4">
                {Object.values(unitsData).map((unitGroup) => {
                    const unitLabel = getUnitLabel(unitGroup.code)
                    const unitAvgColor = getGradeColor(unitGroup.average)

                    // Find styling color matching the type of unit
                    let accentBorder = 'border-l-4 border-l-primary-500'
                    if (unitGroup.code.includes('M')) accentBorder = 'border-l-4 border-l-amber-500'
                    if (unitGroup.code.includes('D')) accentBorder = 'border-l-4 border-l-purple-500'
                    if (unitGroup.code.includes('T')) accentBorder = 'border-l-4 border-l-emerald-500'

                    return (
                        <div
                            key={unitGroup.code}
                            className={`card p-4 pl-5 sm:pl-6 space-y-4 hover:shadow-md transition-all duration-300 border border-surface-200/80 dark:border-surface-700/60 dark:bg-surface-800/40 relative overflow-hidden group ${accentBorder}`}
                        >
                            {/* Unit Header */}
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-2.5 border-b border-surface-200 dark:border-surface-700/60 gap-2">
                                <div>
                                    <h3 className="font-semibold text-surface-900 dark:text-surface-100 text-sm sm:text-base">
                                        {unitLabel}
                                    </h3>
                                    <div className="text-2xs sm:text-xs text-surface-400 dark:text-surface-500 mt-0.5">
                                        Total Coef: {unitGroup.modules.reduce((sum, m) => sum + m.coef, 0)}
                                        {unitGroup.totalCredits > 0 ? ` | Total Credits: ${unitGroup.totalCredits}` : ''}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 self-end sm:self-center">
                                    <span className="text-xs text-surface-500 dark:text-surface-400">Unit Avg:</span>
                                    <span className={`text-sm sm:text-base font-bold ${unitAvgColor}`}>
                                        {unitGroup.average != null ? unitGroup.average.toFixed(2) : '--.--'}
                                    </span>
                                    {unitGroup.average != null && (
                                        <span className={`badge ${unitGroup.average >= 10 ? 'badge-success' : 'badge-danger'} text-3xs px-2 py-0.5`}>
                                            {unitGroup.average >= 10 ? 'Passed' : 'Failed'}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Modules inside unit */}
                            <div className="space-y-3">
                                {unitGroup.modules.map((module) => {
                                    const examKey = `${module.key}_exam`
                                    const tdKey = `${module.key}_td`
                                    const tpKey = `${module.key}_tp`
                                    const avg = getModuleAverage(module, grades)
                                    const gradeColor = getGradeColor(avg)

                                    return (
                                        <div
                                            key={module.key}
                                            className="p-3 rounded-lg bg-surface-50 dark:bg-surface-800/30 border border-surface-200/60 dark:border-surface-700/40"
                                        >
                                            {/* Mobile Module Info */}
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
                                                {/* Desktop Module Info */}
                                                <div className="hidden sm:flex-shrink-0 sm:min-w-0 sm:flex-1 sm:flex sm:flex-col">
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

                                                {/* Inputs Row */}
                                                <div className="flex items-center justify-between gap-2 sm:gap-3 w-full sm:w-auto">
                                                    <div className="flex items-center gap-2 sm:gap-3">
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
                    )
                })}
            </div>

            {/* Result summary cards */}
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
                                    : "Acquire credits by scoring >= 10.00 in individual teaching units or modules."
                                }
                            </span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}