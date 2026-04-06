import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'
import { registerSW } from 'virtual:pwa-register'

// Register service worker for PWA with proper offline support
const updateSW = registerSW({
    immediate: true,
    onNeedRefresh() {
        // Prompt user to refresh when new content is available
        if (confirm('New content available. Reload?')) {
            updateSW(true)
        }
    },
    onOfflineReady() {
        console.log('App ready to work offline')
    },
    onRegistered(registration) {
        console.log('Service Worker registered')
        // Check for updates periodically
        if (registration) {
            setInterval(() => {
                registration.update()
            }, 60 * 60 * 1000) // Check every hour
        }
    },
    onRegisterError(error) {
        console.error('Service Worker registration error:', error)
    }
})

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <BrowserRouter future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
            <App />
        </BrowserRouter>
    </React.StrictMode>,
)