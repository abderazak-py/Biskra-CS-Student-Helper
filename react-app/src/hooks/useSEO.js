import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export default function useSEO({ title, description, canonicalPath }) {
    const location = useLocation()

    useEffect(() => {
        // 1. Update Title
        if (title) {
            document.title = `${title} | CS Student Helper`
        } else {
            document.title = 'CS Student Helper - Biskra University Academic Toolkit'
        }

        // 2. Update Meta Description
        let descMeta = document.querySelector('meta[name="description"]')
        if (!descMeta) {
            descMeta = document.createElement('meta')
            descMeta.setAttribute('name', 'description')
            document.head.appendChild(descMeta)
        }
        const defaultDesc = 'A comprehensive and offline-ready CS Student Helper PWA for Biskra University. Calculate semester GPAs, track study time, access learning resources, and practice with CS quizzes.'
        descMeta.setAttribute('content', description || defaultDesc)

        // 3. Update Canonical Link
        let canonicalLink = document.querySelector('link[rel="canonical"]')
        if (!canonicalLink) {
            canonicalLink = document.createElement('link')
            canonicalLink.setAttribute('rel', 'canonical')
            document.head.appendChild(canonicalLink)
        }
        const path = canonicalPath !== undefined ? canonicalPath : location.pathname
        const formattedPath = path.startsWith('/') ? path : `/${path}`
        const absoluteUrl = `https://biskra-cs.vercel.app${formattedPath === '/' ? '' : formattedPath}`
        canonicalLink.setAttribute('href', absoluteUrl)

        // 4. Update Open Graph Meta Tags
        const updateOgTag = (property, content) => {
            let tag = document.querySelector(`meta[property="${property}"]`)
            if (!tag) {
                tag = document.createElement('meta')
                tag.setAttribute('property', property)
                document.head.appendChild(tag)
            }
            tag.setAttribute('content', content)
        }

        updateOgTag('og:title', title ? `${title} | CS Student Helper` : 'CS Student Helper - Biskra University Academic Toolkit')
        updateOgTag('og:description', description || defaultDesc)
        updateOgTag('og:url', absoluteUrl)

        // 5. Update Twitter Card Meta Tags
        const updateTwitterTag = (name, content) => {
            let tag = document.querySelector(`meta[name="${name}"]`) || document.querySelector(`meta[property="${name}"]`)
            if (!tag) {
                tag = document.createElement('meta')
                tag.setAttribute('name', name)
                document.head.appendChild(tag)
            }
            tag.setAttribute('content', content)
        }

        updateTwitterTag('twitter:title', title ? `${title} | CS Student Helper` : 'CS Student Helper - Biskra University Academic Toolkit')
        updateTwitterTag('twitter:description', description || defaultDesc)
        updateTwitterTag('twitter:url', absoluteUrl)

    }, [title, description, canonicalPath, location.pathname])
}
