import { useState, useEffect } from 'react'

export function usePWAInstall() {
    const [installPrompt, setInstallPrompt] = useState(null)
    const [isInstalled, setIsInstalled] = useState(() => {
        if (typeof window !== 'undefined') {
            return window.matchMedia('(display-mode: standalone)').matches
        }
        return false
    })

    useEffect(() => {
        // Listen for the beforeinstallprompt event
        const handleBeforeInstallPrompt = (e) => {
            e.preventDefault()
            setInstallPrompt(e)
        }

        // Listen for app installed event
        const handleAppInstalled = () => {
            setIsInstalled(true)
            setInstallPrompt(null)
        }

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
        window.addEventListener('appinstalled', handleAppInstalled)

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
            window.removeEventListener('appinstalled', handleAppInstalled)
        }
    }, [])

    const install = async () => {
        if (!installPrompt) return false

        const result = await installPrompt.prompt()
        setInstallPrompt(null)

        return result.outcome === 'accepted'
    }

    return { installPrompt, isInstalled, install, canInstall: !!installPrompt }
}