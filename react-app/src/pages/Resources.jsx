import { useState } from 'react'
import { BookOpen, FileText, Code, FileQuestion, ChevronDown, ExternalLink, Search, FolderOpen } from 'lucide-react'
import { MODULE_RESOURCES, EXTERNAL_RESOURCES } from '../data/resources'

const SECTION_CONFIG = {
    cours: { label: 'Cours', icon: BookOpen, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-100 dark:bg-blue-900/30' },
    td: { label: 'TD (Travaux Dirigés)', icon: FileText, color: 'text-green-600 dark:text-green-400', bg: 'bg-green-100 dark:bg-green-900/30' },
    tp: { label: 'TP (Travaux Pratiques)', icon: Code, color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-100 dark:bg-purple-900/30' },
    exam: { label: 'Examens', icon: FileQuestion, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-100 dark:bg-amber-900/30' }
}

function ResourceLink({ title, url }) {
    return (
        <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 hover:border-primary-300 dark:hover:border-primary-700 transition-all group"
        >
            <ExternalLink className="w-3.5 h-3.5 text-surface-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors" />
            <span className="text-sm text-surface-700 dark:text-surface-300 group-hover:text-surface-900 dark:group-hover:text-surface-100 transition-colors">{title}</span>
        </a>
    )
}

function SectionAccordion({ type, resources }) {
    const [isOpen, setIsOpen] = useState(false)
    const config = SECTION_CONFIG[type]
    const Icon = config.icon

    if (!resources || resources.length === 0) return null

    return (
        <div className="border border-surface-200 dark:border-surface-700 rounded-lg overflow-hidden">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-3 hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors"
            >
                <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded ${config.bg}`}>
                        <Icon className={`w-3.5 h-3.5 ${config.color}`} />
                    </div>
                    <span className="font-medium text-surface-900 dark:text-surface-100 text-sm">{config.label}</span>
                    <span className="text-xs text-surface-400">({resources.length})</span>
                </div>
                <ChevronDown className={`w-4 h-4 text-surface-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && (
                <div className="p-3 pt-0 grid gap-1.5">
                    {resources.map((resource, index) => (
                        <ResourceLink key={index} title={resource.title} url={resource.url} />
                    ))}
                </div>
            )}
        </div>
    )
}

function ModuleCard({ moduleKey, module }) {
    const [isOpen, setIsOpen] = useState(false)

    const totalResources = ['cours', 'td', 'tp', 'exam'].reduce((acc, type) => {
        return acc + (module[type]?.length || 0)
    }, 0)

    return (
        <div className="card overflow-hidden">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-4"
            >
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                        <FolderOpen className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div className="text-left">
                        <h3 className="font-medium text-surface-900 dark:text-surface-100 text-sm">{module.name}</h3>
                        <div className="flex items-center gap-2 mt-0.5">
                            <span className="badge badge-primary text-2xs">{module.semester}</span>
                            <span className="text-xs text-surface-400">{totalResources} resources</span>
                        </div>
                    </div>
                </div>
                <ChevronDown className={`w-4 h-4 text-surface-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="px-4 pb-4 space-y-2">
                    {module.cours && <SectionAccordion type="cours" resources={module.cours} />}
                    {module.td && <SectionAccordion type="td" resources={module.td} />}
                    {module.tp && <SectionAccordion type="tp" resources={module.tp} />}
                    {module.exam && <SectionAccordion type="exam" resources={module.exam} />}
                </div>
            )}
        </div>
    )
}

export default function ResourcesPage() {
    const [search, setSearch] = useState('')

    const filteredModules = Object.entries(MODULE_RESOURCES).filter(([key, module]) =>
        module.name.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-green-100 dark:bg-green-900/30">
                    <BookOpen className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                    <h1 className="text-lg font-semibold text-surface-900 dark:text-surface-100">
                        Study Resources
                    </h1>
                    <p className="text-sm text-surface-500 dark:text-surface-400">
                        Course materials, TD, TP, and exams
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
                    placeholder="Search modules..."
                    className="input pl-10"
                />
            </div>

            {/* Module Cards */}
            <div className="space-y-2">
                {filteredModules.map(([key, module]) => (
                    <ModuleCard key={key} moduleKey={key} module={module} />
                ))}
            </div>

            {filteredModules.length === 0 && (
                <div className="card p-8 text-center">
                    <BookOpen className="w-10 h-10 text-surface-300 dark:text-surface-600 mx-auto mb-3" />
                    <p className="text-surface-500 dark:text-surface-400 text-sm">No modules found matching your search.</p>
                </div>
            )}

            {/* External Resources */}
            <div className="card p-4">
                <h2 className="section-label mb-3">External Learning Resources</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {EXTERNAL_RESOURCES.map((resource, index) => (
                        <a
                            key={index}
                            href={resource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="card-interactive p-3 flex items-start gap-3"
                        >
                            <ExternalLink className="w-4 h-4 text-primary-600 dark:text-primary-400 flex-shrink-0 mt-0.5" />
                            <div>
                                <h3 className="font-medium text-surface-900 dark:text-surface-100 text-sm">{resource.title}</h3>
                                <p className="text-xs text-surface-500 dark:text-surface-400 mt-0.5">{resource.desc}</p>
                                <div className="flex gap-1.5 mt-2">
                                    {resource.tags.map((tag, i) => (
                                        <span key={i} className="badge text-2xs bg-surface-100 dark:bg-surface-700 text-surface-600 dark:text-surface-300">{tag}</span>
                                    ))}
                                </div>
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </div>
    )
}