import { Outlet, NavLink, useLocation } from 'react-router-dom'
import { useState } from 'react'
import {
    Home,
    Calculator,
    BookOpen,
    Timer,
    Moon,
    Brain,
    CheckSquare,
    Users,
    Menu,
    X,
    GraduationCap,
    Github,
    Heart,
} from 'lucide-react'
import { Link } from 'react-router-dom'

const navItems = [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/calculator', icon: Calculator, label: 'Calculator' },
    { to: '/resources', icon: BookOpen, label: 'Resources' },
    { to: '/pomodoro', icon: Timer, label: 'Pomodoro' },
    { to: '/adkar', icon: Moon, label: 'Adkar' },
    { to: '/quiz', icon: Brain, label: 'Quiz' },
    { to: '/habits', icon: CheckSquare, label: 'Habits' },
    { to: '/teachers', icon: Users, label: 'Teachers' },
]

const bottomNavItems = [
    { to: '/contributors', icon: Heart, label: 'Credits' },
]

export default function Layout() {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const location = useLocation()

    const getPageTitle = () => {
        const item = navItems.find((item) => item.to === location.pathname)
        return item?.label || 'CS Helper'
    }

    return (
        <div className="min-h-screen flex bg-surface-50 dark:bg-surface-950">
            {/* Mobile overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-surface-900/20 dark:bg-surface-950/50 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`
                fixed lg:static inset-y-0 left-0 z-50
                w-64 bg-white dark:bg-surface-900 border-r border-surface-200 dark:border-surface-800
                transform transition-transform duration-200 ease-out
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}
            >
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="p-5 border-b border-surface-200 dark:border-surface-800">
                        <Link to="/" className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-primary-700 flex items-center justify-center">
                                <GraduationCap className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h1 className="font-semibold text-surface-900 dark:text-surface-100">
                                    CS Helper
                                </h1>
                                <p className="text-xs text-surface-500 dark:text-surface-400">
                                    Biskra University
                                </p>
                            </div>
                        </Link>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
                        {navItems.map((item) => (
                            <NavLink
                                key={item.to}
                                to={item.to}
                                end={item.to === '/'}
                                onClick={() => setSidebarOpen(false)}
                                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                            >
                                <item.icon className="w-5 h-5" />
                                <span>{item.label}</span>
                            </NavLink>
                        ))}
                    </nav>

                    {/* Bottom Navigation */}
                    <div className="p-3 border-t border-surface-200 dark:border-surface-800 space-y-1">
                        {bottomNavItems.map((item) => (
                            <NavLink
                                key={item.to}
                                to={item.to}
                                onClick={() => setSidebarOpen(false)}
                                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                            >
                                <item.icon className="w-5 h-5" />
                                <span>{item.label}</span>
                            </NavLink>
                        ))}
                    </div>

                    {/* Footer */}
                    <div className="p-3 border-t border-surface-200 dark:border-surface-800">
                        <div className="px-3 py-2">
                            <div className="flex items-center gap-2 text-xs text-surface-500 dark:text-surface-400">
                                <span>
                                    Made by{' '}
                                    <a
                                        href="https://github.com/abderazak-py"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-surface-700 dark:text-surface-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                                    >
                                        Abderrazak
                                    </a>
                                </span>
                                <span className="text-surface-300 dark:text-surface-600">•</span>
                                <a
                                    href="https://github.com/abderazak-py"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-surface-700 dark:hover:text-surface-300 transition-colors"
                                >
                                    <Github className="w-3.5 h-3.5" />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main content */}
            <main className="flex-1 flex flex-col min-h-screen">
                {/* Top bar */}
                <header className="sticky top-0 z-30 bg-surface-50/95 dark:bg-surface-950/95 backdrop-blur-sm border-b border-surface-200 dark:border-surface-800">
                    <div className="flex items-center justify-between px-4 lg:px-6 py-3">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setSidebarOpen(true)}
                                className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 text-surface-500 dark:text-surface-400 transition-colors"
                            >
                                <Menu className="w-5 h-5" />
                            </button>
                            <h2 className="text-sm font-medium text-surface-500 dark:text-surface-400">
                                {getPageTitle()}
                            </h2>
                        </div>

                        {/* Close button for mobile */}
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="lg:hidden p-2 -mr-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 text-surface-500 dark:text-surface-400 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </header>

                {/* Page content */}
                <div className="flex-1 p-4 lg:p-6">
                    <Outlet />
                </div>
            </main>
        </div>
    )
}