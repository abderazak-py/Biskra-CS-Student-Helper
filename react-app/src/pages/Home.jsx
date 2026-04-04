import { Link } from 'react-router-dom'
import {
    Calculator,
    BookOpen,
    Timer,
    Moon,
    Brain,
    CheckSquare,
    Users,
    ChevronRight,
    Calendar,
    GraduationCap,
} from 'lucide-react'

// Primary action - most used tool
const primaryAction = {
    to: '/calculator',
    icon: Calculator,
    title: 'Calculate Your Average',
    description: 'Enter your module grades to see your semester average. Supports both LMD and classic systems.',
}

// Secondary tools - frequently used
const secondaryTools = [
    {
        to: '/resources',
        icon: BookOpen,
        title: 'Resources',
        description: 'Courses, tutorials & docs',
    },
    {
        to: '/pomodoro',
        icon: Timer,
        title: 'Pomodoro',
        description: 'Focus timer for studying',
    },
    {
        to: '/teachers',
        icon: Users,
        title: 'Teachers',
        description: 'Contact info & office hours',
    },
]

// Tertiary tools - useful but less frequent
const otherTools = [
    { to: '/habits', icon: CheckSquare, title: 'Habits', description: 'Track daily study habits' },
    { to: '/quiz', icon: Brain, title: 'Quiz', description: 'Test your CS knowledge' },
    { to: '/adkar', icon: Moon, title: 'Adkar', description: 'Morning & evening supplications' },
]

// Current semester info (could be dynamic)
const currentSemester = {
    season: 'Spring',
    year: '2026',
    week: 'Midterms',
}

export default function Home() {
    return (
        <div className="max-w-4xl mx-auto space-y-8">
            {/* Header - Simple, direct */}
            <header className="pt-4">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-surface-900 dark:text-surface-100">
                            CS Student Helper
                        </h1>
                        <p className="text-surface-500 dark:text-surface-400 mt-1">
                            University of Biskra
                        </p>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-surface-500 dark:text-surface-400">
                        <Calendar className="w-4 h-4" />
                        <span>{currentSemester.season} {currentSemester.year} • {currentSemester.week}</span>
                    </div>
                </div>
            </header>

            {/* Primary Action - Calculator */}
            <section>
                <Link
                    to={primaryAction.to}
                    className="card-interactive block p-6 group"
                >
                    <div className="flex items-start gap-4">
                        <div className="p-3 rounded-lg bg-primary-100 dark:bg-primary-900/30">
                            <primaryAction.icon className="w-6 h-6 text-primary-700 dark:text-primary-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-surface-900 dark:text-surface-100 group-hover:text-primary-700 dark:group-hover:text-primary-400 transition-colors">
                                    {primaryAction.title}
                                </h2>
                                <ChevronRight className="w-5 h-5 text-surface-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors" />
                            </div>
                            <p className="text-surface-500 dark:text-surface-400 mt-1 text-sm">
                                {primaryAction.description}
                            </p>
                        </div>
                    </div>
                </Link>
            </section>

            {/* Secondary Tools */}
            <section>
                <h3 className="section-label mb-3">Quick Access</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {secondaryTools.map((tool) => (
                        <Link
                            key={tool.to}
                            to={tool.to}
                            className="card-interactive p-4 group"
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-surface-100 dark:bg-surface-800">
                                    <tool.icon className="w-5 h-5 text-surface-600 dark:text-surface-400" />
                                </div>
                                <div className="min-w-0">
                                    <h4 className="font-medium text-surface-900 dark:text-surface-100 text-sm">
                                        {tool.title}
                                    </h4>
                                    <p className="text-xs text-surface-500 dark:text-surface-400 truncate">
                                        {tool.description}
                                    </p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Other Tools - Collapsed by default */}
            <section>
                <h3 className="section-label mb-3">More Tools</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {otherTools.map((tool) => (
                        <Link
                            key={tool.to}
                            to={tool.to}
                            className="card-interactive p-4 group"
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-surface-100 dark:bg-surface-800">
                                    <tool.icon className="w-5 h-5 text-surface-500 dark:text-surface-500" />
                                </div>
                                <div className="min-w-0">
                                    <h4 className="font-medium text-surface-700 dark:text-surface-300 text-sm">
                                        {tool.title}
                                    </h4>
                                    <p className="text-xs text-surface-400 dark:text-surface-500 truncate">
                                        {tool.description}
                                    </p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Helpful Tip */}
            <section className="card p-4 bg-primary-50 dark:bg-primary-900/20 border-primary-200 dark:border-primary-800">
                <div className="flex items-start gap-3">
                    <GraduationCap className="w-5 h-5 text-primary-600 dark:text-primary-400 flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="text-sm text-primary-800 dark:text-primary-200 font-medium">
                            Tip: Use the calculator before registration week
                        </p>
                        <p className="text-xs text-primary-600 dark:text-primary-400 mt-1">
                            Know your average in advance to plan which modules to prioritize or retake.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    )
}