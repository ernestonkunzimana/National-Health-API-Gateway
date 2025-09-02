"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { X, Accessibility } from "lucide-react"
import { useAccessibility } from "./accessibility-provider"

export function AccessibilityMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const {
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
  } = useAccessibility()

  return (
    <>
      {/* Accessibility Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="fixed top-4 right-4 z-50 bg-background/95 backdrop-blur-sm"
        aria-label={t("accessibility.menu")}
      >
        <Accessibility className="w-4 h-4" />
        <span className="sr-only">{t("accessibility.menu")}</span>
      </Button>

      {/* Accessibility Panel */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-semibold">{t("accessibility.menu")}</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)} aria-label={t("accessibility.close")}>
                <X className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Theme Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium">{t("accessibility.theme")}</label>
                <Select value={theme} onValueChange={setTheme}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">{t("theme.light")}</SelectItem>
                    <SelectItem value="dark">{t("theme.dark")}</SelectItem>
                    <SelectItem value="high-contrast-light">{t("theme.highContrastLight")}</SelectItem>
                    <SelectItem value="high-contrast-dark">{t("theme.highContrastDark")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Language Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium">{t("accessibility.language")}</label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">{t("language.english")}</SelectItem>
                    <SelectItem value="rw">{t("language.kinyarwanda")}</SelectItem>
                    <SelectItem value="fr">{t("language.french")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Font Size */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {t("accessibility.fontSize")}: {fontSize}px
                </label>
                <Slider
                  value={[fontSize]}
                  onValueChange={(value) => setFontSize(value[0])}
                  min={12}
                  max={24}
                  step={1}
                  className="w-full"
                />
              </div>

              {/* Reduced Motion */}
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">{t("accessibility.reducedMotion")}</label>
                <Switch checked={reducedMotion} onCheckedChange={setReducedMotion} />
              </div>

              {/* High Contrast */}
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">{t("accessibility.highContrast")}</label>
                <Switch
                  checked={highContrast}
                  onCheckedChange={(checked) => {
                    setHighContrast(checked)
                    if (checked) {
                      setTheme(theme.includes("dark") ? "high-contrast-dark" : "high-contrast-light")
                    } else {
                      setTheme(theme.includes("dark") ? "dark" : "light")
                    }
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  )
}
