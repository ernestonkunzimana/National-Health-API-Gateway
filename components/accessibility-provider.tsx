"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

type Theme = "light" | "dark" | "high-contrast-light" | "high-contrast-dark"
type Language = "en" | "rw" | "fr"

interface AccessibilityContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
  language: Language
  setLanguage: (language: Language) => void
  fontSize: number
  setFontSize: (size: number) => void
  reducedMotion: boolean
  setReducedMotion: (reduced: boolean) => void
  highContrast: boolean
  setHighContrast: (contrast: boolean) => void
  t: (key: string) => string
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined)

// Translation dictionary
const translations = {
  en: {
    // Navigation
    "nav.howItWorks": "How It Works",
    "nav.technology": "Technology",
    "nav.impact": "Impact",
    "nav.partners": "Partners",
    "nav.requestPartnership": "Request Partnership",

    // Hero Section
    "hero.title": "Transforming Rwanda's Healthcare Through Digital Innovation",
    "hero.subtitle":
      "The National Health API Gateway connects hospitals, insurance providers, and government agencies through a unified digital platform, enabling real-time claims processing and comprehensive health intelligence.",
    "hero.cta.primary": "Explore the Platform",
    "hero.cta.secondary": "View Documentation",

    // Stats
    "stats.hospitals": "Hospitals Connected",
    "stats.claims": "Claims Processed Monthly",
    "stats.savings": "Cost Savings Annually",
    "stats.uptime": "System Uptime",

    // How It Works
    "howItWorks.title": "One Platform, Complete Integration",
    "howItWorks.subtitle":
      "Our API Gateway seamlessly connects all stakeholders in Rwanda's health ecosystem, from rural health centers to major hospitals.",

    // Technology
    "technology.title": "Built on Cutting-Edge Technology",
    "technology.subtitle": "Enterprise-grade infrastructure designed for Rwanda's unique healthcare landscape.",

    // Impact
    "impact.title": "Measurable Results, Real Impact",
    "impact.subtitle": "Transforming healthcare delivery across Rwanda with quantifiable improvements.",

    // Partners
    "partners.title": "Starting with Rwanda's Leading Hospitals",
    "partners.subtitle": "Pilot implementation with major healthcare providers across the country.",

    // Accessibility
    "accessibility.menu": "Accessibility Menu",
    "accessibility.theme": "Theme",
    "accessibility.language": "Language",
    "accessibility.fontSize": "Font Size",
    "accessibility.reducedMotion": "Reduced Motion",
    "accessibility.highContrast": "High Contrast",
    "accessibility.close": "Close",

    // Themes
    "theme.light": "Light",
    "theme.dark": "Dark",
    "theme.highContrastLight": "High Contrast Light",
    "theme.highContrastDark": "High Contrast Dark",

    // Languages
    "language.english": "English",
    "language.kinyarwanda": "Kinyarwanda",
    "language.french": "Français",
  },
  rw: {
    // Navigation
    "nav.howItWorks": "Uburyo Bukora",
    "nav.technology": "Ikoranabuhanga",
    "nav.impact": "Ingaruka",
    "nav.partners": "Abafatanyabikorwa",
    "nav.requestPartnership": "Saba Ubufatanye",

    // Hero Section
    "hero.title": "Guhindura Ubuvuzi mu Rwanda binyuze mu Buhanga",
    "hero.subtitle":
      "Urubuga rw'API y'Ubuzima Bw'Igihugu ruhuza ibitaro, abatanga ubwishingizi, n'inzego za leta binyuze mu rubuga rumwe rw'ikoranabuhanga.",
    "hero.cta.primary": "Shakisha Urubuga",
    "hero.cta.secondary": "Reba Inyandiko",

    // Stats
    "stats.hospitals": "Ibitaro Byahujwe",
    "stats.claims": "Ibyifuzo Bitunganywa Buri Kwezi",
    "stats.savings": "Ikizamini Buri Mwaka",
    "stats.uptime": "Igihe Sisitemu Ikora",

    // How It Works
    "howItWorks.title": "Urubuga Rumwe, Ubwiyunge Bwuzuye",
    "howItWorks.subtitle": "API Gateway yacu ihuza neza abafatanyabikorwa bose mu gahunda y'ubuzima mu Rwanda.",

    // Technology
    "technology.title": "Yubatswe ku Buhanga Bugezweho",
    "technology.subtitle": "Ibikorwa by'urwego rw'ikigo byateguwe ku buryo bwihariye bw'ubuvuzi mu Rwanda.",

    // Impact
    "impact.title": "Ibisubizo Bipimwa, Ingaruka Nyazo",
    "impact.subtitle": "Guhindura gutanga ubuvuzi muri Rwanda hamwe n'iterambere rishobora gupimwa.",

    // Partners
    "partners.title": "Gutangira n'Ibitaro Bikomeye by'u Rwanda",
    "partners.subtitle": "Gushyira mu bikorwa icyitegererezo hamwe n'abatanga ubuvuzi bakomeye mu gihugu.",

    // Accessibility
    "accessibility.menu": "Ibikubiye ku Kugera",
    "accessibility.theme": "Insanganyamatsiko",
    "accessibility.language": "Ururimi",
    "accessibility.fontSize": "Ingano y'Inyandiko",
    "accessibility.reducedMotion": "Kugabanya Kugenda",
    "accessibility.highContrast": "Itandukaniro Rikomeye",
    "accessibility.close": "Funga",

    // Themes
    "theme.light": "Urumuri",
    "theme.dark": "Umwijima",
    "theme.highContrastLight": "Itandukaniro Rikomeye rw'Urumuri",
    "theme.highContrastDark": "Itandukaniro Rikomeye rw'Umwijima",

    // Languages
    "language.english": "Icyongereza",
    "language.kinyarwanda": "Ikinyarwanda",
    "language.french": "Igifaransa",
  },
  fr: {
    // Navigation
    "nav.howItWorks": "Comment Ça Marche",
    "nav.technology": "Technologie",
    "nav.impact": "Impact",
    "nav.partners": "Partenaires",
    "nav.requestPartnership": "Demander un Partenariat",

    // Hero Section
    "hero.title": "Transformer les Soins de Santé du Rwanda par l'Innovation Numérique",
    "hero.subtitle":
      "La Passerelle API de Santé Nationale connecte les hôpitaux, les assureurs et les agences gouvernementales via une plateforme numérique unifiée.",
    "hero.cta.primary": "Explorer la Plateforme",
    "hero.cta.secondary": "Voir la Documentation",

    // Stats
    "stats.hospitals": "Hôpitaux Connectés",
    "stats.claims": "Réclamations Traitées Mensuellement",
    "stats.savings": "Économies Annuelles",
    "stats.uptime": "Temps de Fonctionnement",

    // How It Works
    "howItWorks.title": "Une Plateforme, Intégration Complète",
    "howItWorks.subtitle":
      "Notre Passerelle API connecte de manière transparente tous les acteurs de l'écosystème de santé du Rwanda.",

    // Technology
    "technology.title": "Construit sur une Technologie de Pointe",
    "technology.subtitle": "Infrastructure de niveau entreprise conçue pour le paysage sanitaire unique du Rwanda.",

    // Impact
    "impact.title": "Résultats Mesurables, Impact Réel",
    "impact.subtitle": "Transformer la prestation de soins de santé au Rwanda avec des améliorations quantifiables.",

    // Partners
    "partners.title": "Commencer avec les Hôpitaux Leaders du Rwanda",
    "partners.subtitle": "Mise en œuvre pilote avec les principaux prestataires de soins de santé du pays.",

    // Accessibility
    "accessibility.menu": "Menu d'Accessibilité",
    "accessibility.theme": "Thème",
    "accessibility.language": "Langue",
    "accessibility.fontSize": "Taille de Police",
    "accessibility.reducedMotion": "Mouvement Réduit",
    "accessibility.highContrast": "Contraste Élevé",
    "accessibility.close": "Fermer",

    // Themes
    "theme.light": "Clair",
    "theme.dark": "Sombre",
    "theme.highContrastLight": "Contraste Élevé Clair",
    "theme.highContrastDark": "Contraste Élevé Sombre",

    // Languages
    "language.english": "English",
    "language.kinyarwanda": "Kinyarwanda",
    "language.french": "Français",
  },
}

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light")
  const [language, setLanguage] = useState<Language>("en")
  const [fontSize, setFontSize] = useState(16)
  const [reducedMotion, setReducedMotion] = useState(false)
  const [highContrast, setHighContrast] = useState(false)

  // Translation function
  const t = (key: string): string => {
    return translations[language][key] || key
  }

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement
    root.className = `${theme} font-size-${fontSize}`

    if (reducedMotion) {
      root.style.setProperty("--animation-duration", "0s")
      root.style.setProperty("--transition-duration", "0s")
    } else {
      root.style.removeProperty("--animation-duration")
      root.style.removeProperty("--transition-duration")
    }
  }, [theme, fontSize, reducedMotion])

  // Load preferences from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem("accessibility-theme") as Theme
    const savedLanguage = localStorage.getItem("accessibility-language") as Language
    const savedFontSize = localStorage.getItem("accessibility-fontSize")
    const savedReducedMotion = localStorage.getItem("accessibility-reducedMotion")
    const savedHighContrast = localStorage.getItem("accessibility-highContrast")

    if (savedTheme) setTheme(savedTheme)
    if (savedLanguage) setLanguage(savedLanguage)
    if (savedFontSize) setFontSize(Number.parseInt(savedFontSize))
    if (savedReducedMotion) setReducedMotion(savedReducedMotion === "true")
    if (savedHighContrast) setHighContrast(savedHighContrast === "true")
  }, [])

  // Save preferences to localStorage
  useEffect(() => {
    localStorage.setItem("accessibility-theme", theme)
    localStorage.setItem("accessibility-language", language)
    localStorage.setItem("accessibility-fontSize", fontSize.toString())
    localStorage.setItem("accessibility-reducedMotion", reducedMotion.toString())
    localStorage.setItem("accessibility-highContrast", highContrast.toString())
  }, [theme, language, fontSize, reducedMotion, highContrast])

  const value = {
    theme,
    setTheme,
    language,
    setLanguage,
    fontSize,
    setFontSize,
    reducedMotion,
    setReducedMotion,
    highContrast,
    setHighContrast,
    t,
  }

  return <AccessibilityContext.Provider value={value}>{children}</AccessibilityContext.Provider>
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext)
  if (context === undefined) {
    throw new Error("useAccessibility must be used within an AccessibilityProvider")
  }
  return context
}
