import { useState, useMemo } from 'react'
import { Users, Mail, Search, Copy, Check } from 'lucide-react'
import { TEACHERS } from '../data/teachers'

export default function TeachersPage() {
    const [search, setSearch] = useState('')
    const [copiedEmail, setCopiedEmail] = useState(null)

    const filteredTeachers = useMemo(() => {
        return TEACHERS.filter(
            (teacher) =>
                teacher.name.toLowerCase().includes(search.toLowerCase()) ||
                teacher.email.toLowerCase().includes(search.toLowerCase())
        )
    }, [search])

    const copyEmail = async (email, teacherName) => {
        try {
            await navigator.clipboard.writeText(email)
            setCopiedEmail(teacherName)
            setTimeout(() => setCopiedEmail(null), 2000)
        } catch (err) {
            console.error('Failed to copy email')
        }
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-sky-100 dark:bg-sky-900/30">
                    <Users className="w-5 h-5 text-sky-600 dark:text-sky-400" />
                </div>
                <div>
                    <h1 className="text-lg font-semibold text-surface-900 dark:text-surface-100">
                        Contact Teachers
                    </h1>
                    <p className="text-sm text-surface-500 dark:text-surface-400">
                        {TEACHERS.length} teachers • Quick access to emails
                    </p>
                </div>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by name or email..."
                    className="input pl-10"
                />
            </div>

            {/* Teachers Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {filteredTeachers.map((teacher) => (
                    <div key={teacher.name} className="card p-3">
                        <div className="flex items-center gap-3">
                            {/* Avatar */}
                            <div className="w-9 h-9 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0">
                                <span className="text-xs font-bold text-primary-700 dark:text-primary-400">
                                    {teacher.name
                                        .split(' ')
                                        .map((n) => n[0])
                                        .join('')
                                        .slice(0, 2)}
                                </span>
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                                <h3 className="font-medium text-surface-900 dark:text-surface-100 text-sm truncate">
                                    {teacher.name}
                                </h3>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                    <Mail className="w-3 h-3 text-surface-400 flex-shrink-0" />
                                    <span className="text-xs text-surface-500 dark:text-surface-400 truncate">
                                        {teacher.email}
                                    </span>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-0.5 flex-shrink-0">
                                <button
                                    onClick={() => copyEmail(teacher.email, teacher.name)}
                                    className="p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 text-surface-400 hover:text-surface-600 dark:hover:text-surface-200 transition-colors"
                                    title="Copy email"
                                >
                                    {copiedEmail === teacher.name ? (
                                        <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
                                    ) : (
                                        <Copy className="w-4 h-4" />
                                    )}
                                </button>
                                <a
                                    href={`mailto:${teacher.email}`}
                                    className="p-2 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-900/30 text-surface-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                                    title="Send email"
                                >
                                    <Mail className="w-4 h-4" />
                                </a>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {filteredTeachers.length === 0 && (
                <div className="card p-8 text-center">
                    <Users className="w-10 h-10 text-surface-300 dark:text-surface-600 mx-auto mb-3" />
                    <p className="text-surface-500 dark:text-surface-400 text-sm">
                        No teachers found matching your search.
                    </p>
                </div>
            )}

            {/* Results count */}
            {search && (
                <div className="text-center text-xs text-surface-400 dark:text-surface-500">
                    Showing {filteredTeachers.length} of {TEACHERS.length} teachers
                </div>
            )}
        </div>
    )
}