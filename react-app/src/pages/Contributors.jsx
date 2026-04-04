import { Heart, Github, ExternalLink, Youtube } from 'lucide-react'

const CONTRIBUTORS = [
    {
        name: 'Abderazak Achour',
        role: 'Owner and Founder',
        github: 'https://github.com/abderazak-py',
        youtube: 'https://www.youtube.com/@abderrazak-dev',
    },
    {
        name: 'Farhat',
        role: 'Contributor and Admin',
        github: 'https://github.com/Farhat-141',
    },
    {
        name: 'Taha',
        role: 'Contributor',
        github: 'https://github.com/t1mtr9',
    },
    {
        name: 'Ibtihal',
        role: 'Contributor',
        github: 'https://github.com/ibtihal0666',
    },
]

export default function ContributorsPage() {
    return (
        <div className="max-w-2xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-pink-100 dark:bg-pink-900/30">
                    <Heart className="w-5 h-5 text-pink-600 dark:text-pink-400" />
                </div>
                <div>
                    <h1 className="text-lg font-semibold text-surface-900 dark:text-surface-100">
                        Project Contributors
                    </h1>
                    <p className="text-sm text-surface-500 dark:text-surface-400">
                        The people behind this project
                    </p>
                </div>
            </div>

            {/* Contributors List */}
            <div className="space-y-2">
                {CONTRIBUTORS.map((contributor) => (
                    <a
                        key={contributor.name}
                        href={contributor.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="card p-4 flex items-center justify-between hover:border-primary-300 dark:hover:border-primary-700 transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                                <span className="text-sm font-bold text-primary-700 dark:text-primary-400">
                                    {contributor.name
                                        .split(' ')
                                        .map((n) => n[0])
                                        .join('')
                                        .slice(0, 2)}
                                </span>
                            </div>
                            <div>
                                <h3 className="font-medium text-surface-900 dark:text-surface-100 text-sm">
                                    {contributor.name}
                                </h3>
                                <p className="text-xs text-surface-500 dark:text-surface-400">
                                    {contributor.role}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 text-surface-400">
                            {contributor.youtube && (
                                <a
                                    href={contributor.youtube}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                    className="hover:text-red-500 transition-colors"
                                >
                                    <Youtube className="w-4 h-4" />
                                </a>
                            )}
                            <Github className="w-4 h-4" />
                            <ExternalLink className="w-3.5 h-3.5" />
                        </div>
                    </a>
                ))}
            </div>

            {/* Thank You Note */}
            <div className="card p-4 text-center">
                <p className="text-sm text-surface-500 dark:text-surface-400">
                    Thank you to all contributors who helped make this project possible!
                </p>
            </div>
        </div>
    )
}