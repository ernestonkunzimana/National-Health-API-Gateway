"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ChartContainer } from "@/components/ui/chart"
import {
  Heart,
  Zap,
  Play,
  ArrowRight,
  Shield,
  Clock,
  Users,
  Cloud,
  Smartphone,
  BarChart3,
  CheckCircle,
  Globe,
  DollarSign,
  Award,
  ExternalLink,
  Mail,
  Phone,
  MapPin,
  Menu,
  X,
  AlertTriangle,
  Wifi,
  Hospital,
  Building2,
  FileText,
  UserCheck,
} from "lucide-react"
import { AccessibilityMenu } from "@/components/accessibility-menu"
import { useAccessibility } from "@/components/accessibility-provider"

const scrollToSection = (sectionId: string) => {
  const element = document.getElementById(sectionId)
  if (element) {
    const navHeight = 80 // Account for fixed navigation height
    const elementPosition = element.offsetTop - navHeight
    window.scrollTo({
      top: elementPosition,
      behavior: "smooth",
    })
  }
}

// Animated Counter Component
function AnimatedCounter({
  end,
  suffix = "",
  prefix = "",
  duration = 2000,
}: {
  end: number
  suffix?: string
  prefix?: string
  duration?: number
}) {
  const [count, setCount] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 },
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [isVisible])

  useEffect(() => {
    if (!isVisible) return

    let startTime: number
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / duration, 1)

      setCount(Math.floor(progress * end))

      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    requestAnimationFrame(animate)
  }, [isVisible, end, duration])

  return (
    <div ref={ref} className="tabindex-0" role="text" aria-live="polite">
      {prefix}
      {count.toLocaleString()}
      {suffix}
    </div>
  )
}

function SafeChartContainer({ config, children }: { config: any; children: React.ReactNode }) {
  if (!config) {
    console.log("[v0] Chart config is undefined")
    return <div>Loading chart...</div>
  }

  return <ChartContainer config={config}>{children}</ChartContainer>
}

function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { t } = useAccessibility()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navigationItems = [
    { href: "how-it-works", label: t("nav.howItWorks") },
    { href: "technology", label: t("nav.technology") },
    { href: "impact", label: t("nav.impact") },
    { href: "partners", label: t("nav.partners") },
  ]

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-background/95 backdrop-blur-sm border-b" : "bg-transparent"
      }`}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Heart className="w-5 h-5 text-primary-foreground" aria-hidden="true" />
            </div>
            <span className="text-xl font-bold text-primary">Rwanda HealthLink</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <button
                key={item.href}
                onClick={() => scrollToSection(item.href)}
                className="text-foreground hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-sm px-2 py-1 cursor-pointer"
                aria-label={`Navigate to ${item.label} section`}
                type="button"
              >
                {item.label}
              </button>
            ))}
            <Button variant="outline" size="sm" onClick={() => scrollToSection("contact")} className="cursor-pointer">
              {t("nav.requestPartnership")}
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle mobile menu"
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t bg-background/95 backdrop-blur-sm">
            <div className="flex flex-col space-y-2 pt-4">
              {navigationItems.map((item) => (
                <button
                  key={item.href}
                  onClick={() => {
                    scrollToSection(item.href)
                    setIsMobileMenuOpen(false)
                  }}
                  className="text-left text-foreground hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-sm px-2 py-2 cursor-pointer"
                  aria-label={`Navigate to ${item.label} section`}
                  type="button"
                >
                  {item.label}
                </button>
              ))}
              <Button
                variant="outline"
                size="sm"
                className="mt-2 w-fit bg-transparent cursor-pointer"
                onClick={() => {
                  scrollToSection("contact")
                  setIsMobileMenuOpen(false)
                }}
              >
                {t("nav.requestPartnership")}
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

function HeroSection() {
  const { t } = useAccessibility()

  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      aria-label="Hero section"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 gradient-hero opacity-10" aria-hidden="true">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23059669' fillOpacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate-slide-up">
            <Badge variant="secondary" className="w-fit">
              <Zap className="w-4 h-4 mr-2" aria-hidden="true" />
              Transforming Healthcare in Rwanda
            </Badge>
            <h1 className="text-5xl lg:text-7xl font-bold text-balance leading-tight">{t("hero.title")}</h1>
            <p className="text-xl text-muted-foreground text-pretty max-w-2xl">{t("hero.subtitle")}</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="animate-pulse-glow"
                onClick={() => scrollToSection("how-it-works")}
                aria-label={t("hero.cta.primary")}
              >
                <Play className="w-5 h-5 mr-2" aria-hidden="true" />
                {t("hero.cta.primary")}
              </Button>
              <Button variant="outline" size="lg">
                {t("hero.cta.secondary")}
                <ArrowRight className="w-5 h-5 ml-2" aria-hidden="true" />
              </Button>
            </div>
          </div>

          {/* Dashboard Mockup */}
          <div className="relative animate-slide-up-delay-1">
            <div
              className="bg-card rounded-2xl shadow-2xl p-6 animate-float"
              role="img"
              aria-label="Health Analytics Dashboard Preview"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Health Analytics Dashboard</h3>
                <Badge variant="secondary">Live</Badge>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-primary/10 rounded-lg p-4">
                  <div className="text-2xl font-bold text-primary">
                    <AnimatedCounter end={2000000} suffix="+" />
                  </div>
                  <div className="text-sm text-muted-foreground">{t("stats.claims")}</div>
                </div>
                <div className="bg-secondary/10 rounded-lg p-4">
                  <div className="text-2xl font-bold text-secondary">
                    <AnimatedCounter end={99} suffix="%" />
                  </div>
                  <div className="text-sm text-muted-foreground">{t("stats.uptime")}</div>
                </div>
              </div>
              <div className="h-32">
                <div className="bg-muted/20 rounded-lg p-4 flex items-center justify-center">
                  <div className="text-center">
                    <BarChart3 className="w-8 h-8 text-primary mx-auto mb-2" aria-hidden="true" />
                    <div className="text-sm text-muted-foreground">Real-time Analytics</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// Problem Section
function ProblemSection() {
  const problems = [
    {
      icon: Clock,
      title: "Manual Claims Processing",
      stat: "21-45 days",
      description: "Average processing time creates cash flow challenges for healthcare providers",
    },
    {
      icon: AlertTriangle,
      title: "Fragmented Systems",
      stat: "60+ hospitals",
      description: "Incompatible systems operating in isolation across the country",
    },
    {
      icon: BarChart3,
      title: "Limited Real-time Data",
      stat: "No visibility",
      description: "Government lacks health intelligence for evidence-based decision making",
    },
    {
      icon: Wifi,
      title: "Rural Access Barriers",
      stat: "40% affected",
      description: "Population faces connectivity issues limiting healthcare access",
    },
  ]

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Rwanda's Healthcare Challenges</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Current healthcare financing faces significant inefficiencies that impact providers, patients, and the
            entire health system.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {problems.map((problem, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-2">
              <CardHeader>
                <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <problem.icon className="w-8 h-8 text-destructive" />
                </div>
                <CardTitle className="text-lg">{problem.title}</CardTitle>
                <div className="text-2xl font-bold text-destructive">{problem.stat}</div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm">{problem.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

// Solution Section
function SolutionSection() {
  const features = [
    {
      icon: Zap,
      title: "Real-Time Claims Processing",
      description: "Process 90% of claims digitally in under 2 seconds",
      color: "primary",
    },
    {
      icon: Wifi,
      title: "Offline-First Design",
      description: "Works seamlessly in low-connectivity rural areas",
      color: "secondary",
    },
    {
      icon: Shield,
      title: "AI Fraud Detection",
      description: "20% reduction in fraudulent claims through machine learning",
      color: "accent",
    },
    {
      icon: BarChart3,
      title: "Government Dashboards",
      description: "Real-time health intelligence for policy makers",
      color: "primary",
    },
    {
      icon: Globe,
      title: "Universal Compatibility",
      description: "Connects OpenMRS, Sisoft, and all hospital systems",
      color: "secondary",
    },
    {
      icon: Smartphone,
      title: "Mobile-First Access",
      description: "Healthcare providers and patients access via mobile apps",
      color: "accent",
    },
  ]

  return (
    <section id="how-it-works" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">One Platform, Complete Integration</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Our comprehensive API Gateway transforms healthcare financing through real-time connectivity and intelligent
            automation.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="hover:shadow-lg transition-all duration-300 hover:-translate-y-2 group">
              <CardHeader>
                <div
                  className={`w-16 h-16 bg-${feature.color}/10 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                >
                  <feature.icon className={`w-8 h-8 text-${feature.color}`} />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

// Technology Stack Section
function TechnologySection() {
  const [hoveredTech, setHoveredTech] = useState<string | null>(null)

  const techStack = [
    {
      category: "Frontend",
      technologies: [
        { name: "React.js", role: "User interface development", color: "#61DAFB" },
        { name: "React Native", role: "Mobile applications", color: "#61DAFB" },
        { name: "Progressive Web Apps", role: "Offline-first web apps", color: "#5A0FC8" },
      ],
    },
    {
      category: "Backend",
      technologies: [
        { name: "Node.js", role: "Server-side runtime", color: "#339933" },
        { name: "Python AI/ML", role: "Machine learning models", color: "#3776AB" },
        { name: "PostgreSQL", role: "Primary database", color: "#336791" },
        { name: "MongoDB", role: "Document storage", color: "#47A248" },
      ],
    },
    {
      category: "Integration",
      technologies: [
        { name: "HL7 FHIR", role: "Healthcare data standards", color: "#FF6B35" },
        { name: "REST APIs", role: "System connectivity", color: "#02569B" },
        { name: "WebSockets", role: "Real-time communication", color: "#010101" },
      ],
    },
    {
      category: "Security & Cloud",
      technologies: [
        { name: "Blockchain", role: "Audit trails", color: "#F7931A" },
        { name: "End-to-end Encryption", role: "Data protection", color: "#FF0000" },
        { name: "Auto-scaling Infrastructure", role: "99.9% uptime", color: "#FF9900" },
      ],
    },
  ]

  return (
    <section id="technology" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Built on Cutting-Edge Technology</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Our platform leverages modern technologies to ensure scalability, security, and seamless integration across
            all healthcare systems.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {techStack.map((stack, stackIndex) => (
            <Card key={stackIndex} className="hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-lg text-center">{stack.category}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {stack.technologies.map((tech, techIndex) => (
                  <div
                    key={techIndex}
                    className="p-3 rounded-lg border hover:bg-muted/50 transition-all cursor-pointer"
                    onMouseEnter={() => setHoveredTech(`${stackIndex}-${techIndex}`)}
                    onMouseLeave={() => setHoveredTech(null)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: tech.color }} />
                      <div className="flex-1">
                        <div className="font-medium text-sm">{tech.name}</div>
                        {hoveredTech === `${stackIndex}-${techIndex}` && (
                          <div className="text-xs text-muted-foreground mt-1 animate-slide-up">{tech.role}</div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

// Impact Metrics Section
function ImpactSection() {
  const metrics = [
    { label: "Claims Processed Annually", value: 2000000, suffix: "+" },
    { label: "Faster Processing Time", value: 30, suffix: "%" },
    { label: "Government Savings", value: 5, suffix: "M USD" },
    { label: "Digital Claims Target", value: 90, suffix: "%" },
    { label: "Fraud Reduction", value: 20, suffix: "%" },
    { label: "System Uptime", value: 99.9, suffix: "%" },
  ]

  return (
    <section id="impact" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Measurable Results, Real Impact</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Our platform delivers quantifiable improvements across all key healthcare financing metrics.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {metrics.map((metric, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-2">
              <CardContent className="pt-8">
                <div className="text-4xl font-bold text-primary mb-2">
                  <AnimatedCounter end={metric.value} suffix={metric.suffix} />
                </div>
                <div className="text-muted-foreground">{metric.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-center">Before vs After Transformation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div className="space-y-2">
                <div className="text-3xl font-bold text-destructive">30 days</div>
                <div className="text-sm text-muted-foreground">Processing Time Before</div>
                <ArrowRight className="w-6 h-6 mx-auto text-muted-foreground" />
                <div className="text-3xl font-bold text-primary">2 seconds</div>
                <div className="text-sm text-muted-foreground">Processing Time After</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-destructive">15%</div>
                <div className="text-sm text-muted-foreground">Fraud Rate Before</div>
                <ArrowRight className="w-6 h-6 mx-auto text-muted-foreground" />
                <div className="text-3xl font-bold text-primary">3%</div>
                <div className="text-sm text-muted-foreground">Fraud Rate After</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-destructive">85%</div>
                <div className="text-sm text-muted-foreground">System Uptime Before</div>
                <ArrowRight className="w-6 h-6 mx-auto text-muted-foreground" />
                <div className="text-3xl font-bold text-primary">99.9%</div>
                <div className="text-sm text-muted-foreground">System Uptime After</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}

// Stakeholder Benefits Section
function StakeholderSection() {
  const stakeholders = [
    {
      title: "For Hospitals",
      icon: Hospital,
      benefits: [
        "Faster reimbursements improve cash flow",
        "Reduced administrative burden",
        "Real-time patient eligibility verification",
        "Comprehensive analytics and reporting",
      ],
      color: "primary",
    },
    {
      title: "For Government",
      icon: Building2,
      benefits: [
        "Real-time health intelligence for policy decisions",
        "Fraud detection saving millions annually",
        "Universal health coverage monitoring",
        "Evidence-based resource allocation",
      ],
      color: "secondary",
    },
    {
      title: "For Insurance Companies",
      icon: Shield,
      benefits: [
        "Automated claims processing",
        "AI-powered fraud prevention",
        "Improved member services",
        "Cost reduction through efficiency",
      ],
      color: "accent",
    },
    {
      title: "For Patients",
      icon: Users,
      benefits: [
        "Faster claim approvals and treatment",
        "Transparent insurance coverage information",
        "Rural access through offline capabilities",
        "Digital health records management",
      ],
      color: "primary",
    },
  ]

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Benefits for Every Stakeholder</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Our platform creates value across the entire healthcare ecosystem, ensuring sustainable adoption and
            long-term success.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {stakeholders.map((stakeholder, index) => (
            <Card key={index} className="hover:shadow-lg transition-all duration-300 hover:-translate-y-2">
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 bg-${stakeholder.color}/10 rounded-full flex items-center justify-center`}>
                    <stakeholder.icon className={`w-6 h-6 text-${stakeholder.color}`} />
                  </div>
                  <CardTitle className="text-xl">{stakeholder.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {stakeholder.benefits.map((benefit, benefitIndex) => (
                    <li key={benefitIndex} className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

// Pilot Hospitals Section
function PilotHospitalsSection() {
  const hospitals = [
    {
      name: "CHUK",
      fullName: "University Teaching Hospital",
      integration: "OpenMRS Integration",
      description: "Leading academic medical center with comprehensive research and training programs",
      patients: "50,000+",
      specialty: "Academic Medicine",
    },
    {
      name: "King Faisal Hospital",
      fullName: "Premium Private Healthcare",
      integration: "Sisoft Integration",
      description: "State-of-the-art private hospital providing world-class healthcare services",
      patients: "30,000+",
      specialty: "Specialized Care",
    },
    {
      name: "RDF Military Hospital",
      fullName: "Specialized Military Healthcare",
      integration: "Hybrid System",
      description: "Advanced military medical facility serving defense personnel and families",
      patients: "25,000+",
      specialty: "Military Medicine",
    },
    {
      name: "Gasabo District Hospital",
      fullName: "Community Healthcare",
      integration: "DHIS2 Integration",
      description: "Community-focused hospital providing essential healthcare services",
      patients: "40,000+",
      specialty: "Primary Care",
    },
  ]

  return (
    <section id="partners" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Starting with Rwanda's Leading Hospitals</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Our pilot implementation begins with four diverse healthcare facilities, ensuring comprehensive testing
            across different systems and patient populations.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {hospitals.map((hospital, index) => (
            <Card key={index} className="hover:shadow-lg transition-all duration-300 hover:-translate-y-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl text-primary">{hospital.name}</CardTitle>
                    <CardDescription className="text-base font-medium">{hospital.fullName}</CardDescription>
                  </div>
                  <Badge variant="secondary">{hospital.integration}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">{hospital.description}</p>
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">{hospital.patients} patients</span>
                  </div>
                  <Badge variant="outline">{hospital.specialty}</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

// Implementation Timeline Section
function TimelineSection() {
  const phases = [
    {
      phase: "Phase 1",
      duration: "Months 1-3",
      title: "Foundation & Infrastructure Setup",
      tasks: [
        "Governance & partnerships establishment",
        "Cloud environment and security setup",
        "Core development team assembly",
        "Technical infrastructure deployment",
      ],
      progress: 100,
    },
    {
      phase: "Phase 2",
      duration: "Months 4-9",
      title: "System Integration & Development",
      tasks: [
        "Hospital system connectors development",
        "Government system integration",
        "Private sector onboarding",
        "API gateway development",
      ],
      progress: 75,
    },
    {
      phase: "Phase 3",
      duration: "Months 10-12",
      title: "Live Deployment & Optimization",
      tasks: ["Production deployment", "User training programs", "Performance monitoring", "System optimization"],
      progress: 25,
    },
    {
      phase: "Future",
      duration: "Year 2+",
      title: "National Rollout & Regional Expansion",
      tasks: [
        "National scaling across all hospitals",
        "Regional expansion to East Africa",
        "Advanced AI features",
        "International partnerships",
      ],
      progress: 0,
    },
  ]

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">12-Month Implementation Roadmap</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Our structured approach ensures systematic deployment with measurable milestones and continuous stakeholder
            engagement.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {phases.map((phase, index) => (
            <Card key={index} className="hover:shadow-lg transition-all duration-300 hover:-translate-y-2">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Badge variant={phase.progress === 100 ? "default" : phase.progress > 0 ? "secondary" : "outline"}>
                    {phase.phase}
                  </Badge>
                  <span className="text-sm text-muted-foreground">{phase.duration}</span>
                </div>
                <CardTitle className="text-lg">{phase.title}</CardTitle>
                <Progress value={phase.progress} className="mt-2" />
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {phase.tasks.map((task, taskIndex) => (
                    <li key={taskIndex} className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                      <span className="text-sm">{task}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

// Government Partnership Section
function GovernmentSection() {
  const partners = [
    {
      name: "Ministry of Health",
      role: "Policy oversight and strategic direction",
      icon: Building2,
    },
    {
      name: "NHIC",
      role: "Claims coordination and standards setting",
      icon: FileText,
    },
    {
      name: "RSSB",
      role: "Primary payer integration and member services",
      icon: Users,
    },
    {
      name: "NIDA",
      role: "Patient identification and verification",
      icon: UserCheck,
    },
    {
      name: "RISA",
      role: "Cloud infrastructure and cybersecurity",
      icon: Cloud,
    },
  ]

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Leading with Government Support</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Strong government partnerships ensure policy alignment, regulatory compliance, and sustainable
            implementation across Rwanda's health system.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {partners.map((partner, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-2">
              <CardHeader>
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <partner.icon className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="text-lg">{partner.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm">{partner.role}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="max-w-4xl mx-auto bg-primary/5 border-primary/20">
          <CardContent className="p-8">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                <Award className="w-6 h-6 text-primary" />
              </div>
              <div>
                <blockquote className="text-lg italic mb-4">
                  "The National Health API Gateway represents a transformational opportunity for Rwanda's health system.
                  This initiative aligns perfectly with our digital health strategy and will significantly improve
                  healthcare delivery for all Rwandans."
                </blockquote>
                <cite className="text-sm font-medium">
                  — Dr. Sabin Nsanzimana, Minister of Health, Republic of Rwanda
                </cite>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}

// Investment & Sustainability Section
function InvestmentSection() {
  const revenueStreams = [
    { name: "Transaction Fees", percentage: 40, description: "$0.25 average per claim processed" },
    { name: "Subscription Services", percentage: 30, description: "$300-1,500/month per facility" },
    { name: "Analytics Services", percentage: 20, description: "Premium insights for decision makers" },
    { name: "Professional Services", percentage: 10, description: "Integration and customization" },
  ]

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Sustainable Business Model</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Our diversified revenue model ensures long-term sustainability while delivering measurable value to all
            stakeholders.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          <Card>
            <CardHeader>
              <CardTitle>5-Year Financial Projection</CardTitle>
              <CardDescription>Revenue growth and profitability timeline</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-primary/10 rounded-lg">
                    <div className="text-2xl font-bold text-primary">$3.5M</div>
                    <div className="text-sm text-muted-foreground">Year 5 Revenue</div>
                  </div>
                  <div className="text-center p-4 bg-secondary/10 rounded-lg">
                    <div className="text-2xl font-bold text-secondary">250%</div>
                    <div className="text-sm text-muted-foreground">5-Year ROI</div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Year 1 (Pilot)</span>
                    <span className="font-medium">$50K</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Year 2 (Launch)</span>
                    <span className="font-medium">$400K</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Year 3 (Scale)</span>
                    <span className="font-medium">$1.2M</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Year 4 (Mature)</span>
                    <span className="font-medium">$2.1M</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Year 5 (Expand)</span>
                    <span className="font-medium text-primary">$3.5M</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Revenue Stream Distribution</CardTitle>
              <CardDescription>Diversified income sources for sustainability</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {revenueStreams.map((stream, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{stream.name}</span>
                    <span className="text-primary font-bold">{stream.percentage}%</span>
                  </div>
                  <Progress value={stream.percentage} />
                  <p className="text-sm text-muted-foreground">{stream.description}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}

// Regional Expansion Section
function RegionalExpansionSection() {
  const countries = [
    { name: "Rwanda", status: "Pilot Implementation", year: "2024-2025", market: "Current", color: "primary" },
    { name: "Kenya", status: "Phase 2 Expansion", year: "2026", market: "$2-3M", color: "secondary" },
    { name: "Uganda", status: "Phase 3 Expansion", year: "2027", market: "$1-2M", color: "accent" },
    { name: "Tanzania", status: "Phase 4 Expansion", year: "2028", market: "$2-3M", color: "primary" },
  ]

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Scaling Across East Africa</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Our regional expansion strategy leverages Rwanda's success to transform healthcare financing across East
            Africa.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {countries.map((country, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-2">
              <CardHeader>
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="text-xl">{country.name}</CardTitle>
                <Badge variant={index === 0 ? "default" : "outline"} className="mt-2">
                  {country.year}
                </Badge>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm font-medium">{country.status}</div>
                <div className="text-lg font-bold text-primary">{country.market}</div>
                <div className="text-xs text-muted-foreground">Annual market potential</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

// Call to Action Section
function CallToActionSection() {
  return (
    <section className="py-20 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-4xl font-bold mb-6">Join the Digital Health Revolution</h2>
        <p className="text-xl mb-12 max-w-3xl mx-auto opacity-90">
          Partner with us to transform healthcare financing in Rwanda and across East Africa. Together, we can build a
          more efficient, transparent, and equitable health system.
        </p>

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <Card className="bg-primary-foreground text-primary hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
            <CardHeader>
              <Hospital className="w-12 h-12 mx-auto mb-4" />
              <CardTitle>Request Partnership</CardTitle>
              <CardDescription className="text-primary/70">For hospitals and healthcare providers</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" variant="default">
                Partner With Us
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-primary-foreground text-primary hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
            <CardHeader>
              <Building2 className="w-12 h-12 mx-auto mb-4" />
              <CardTitle>Government Collaboration</CardTitle>
              <CardDescription className="text-primary/70">For ministry officials and policymakers</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" variant="default">
                Collaborate
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-primary-foreground text-primary hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
            <CardHeader>
              <DollarSign className="w-12 h-12 mx-auto mb-4" />
              <CardTitle>Investment Opportunity</CardTitle>
              <CardDescription className="text-primary/70">For investors and development partners</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" variant="default">
                Invest Now
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}

// Contact Form Section
function ContactSection() {
  const { t } = useAccessibility()

  return (
    <section id="contact" className="py-20 bg-primary/5">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-balance">{t("contact.title")}</h2>
          <p className="text-lg text-muted-foreground mb-8 text-pretty">{t("contact.description")}</p>
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">{t("contact.government")}</h3>
              <p className="text-muted-foreground mb-4">{t("contact.governmentDesc")}</p>
              <Button className="w-full">{t("contact.contactGovernment")}</Button>
            </Card>
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">{t("contact.private")}</h3>
              <p className="text-muted-foreground mb-4">{t("contact.privateDesc")}</p>
              <Button className="w-full">{t("contact.contactPrivate")}</Button>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  const { t } = useAccessibility()

  return (
    <footer className="bg-foreground text-background py-16" role="contentinfo">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Heart className="w-5 h-5 text-primary-foreground" aria-hidden="true" />
              </div>
              <span className="text-xl font-bold">Rwanda HealthLink</span>
            </div>
            <p className="text-sm opacity-80">
              Transforming healthcare financing through digital innovation and real-time connectivity.
            </p>
            <div className="flex space-x-4">
              <Button
                variant="ghost"
                size="sm"
                className="text-background hover:text-primary"
                aria-label="External link"
              >
                <ExternalLink className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Platform</h4>
            <ul className="space-y-2 text-sm opacity-80">
              <li>
                <button
                  onClick={() => scrollToSection("how-it-works")}
                  className="hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-sm"
                >
                  {t("nav.howItWorks")}
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("technology")}
                  className="hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-sm"
                >
                  {t("nav.technology")}
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("impact")}
                  className="hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-sm"
                >
                  {t("nav.impact")}
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("partners")}
                  className="hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-sm"
                >
                  {t("nav.partners")}
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm opacity-80">
              <li>
                <a
                  href="#"
                  className="hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-sm"
                >
                  Documentation
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-sm"
                >
                  API Reference
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-sm"
                >
                  Case Studies
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-sm"
                >
                  White Papers
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <div className="space-y-2 text-sm opacity-80">
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4" aria-hidden="true" />
                <a
                  href="mailto:info@rwandahealthlink.rw"
                  className="hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-sm"
                >
                  info@rwandahealthlink.rw
                </a>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4" aria-hidden="true" />
                <a
                  href="tel:+250788123456"
                  className="hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-sm"
                >
                  +250 788 123 456
                </a>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4" aria-hidden="true" />
                <span>Kigali, Rwanda</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-background/20 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm opacity-60">© 2024 Rwanda HealthLink. All rights reserved.</p>
          <div className="flex space-x-6 text-sm opacity-60 mt-4 md:mt-0">
            <a
              href="#"
              className="hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-sm"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-sm"
            >
              Terms of Service
            </a>
            <a
              href="#"
              className="hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-sm"
            >
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default function RwandaHealthLinkPage() {
  return (
    <div className="min-h-screen">
      <AccessibilityMenu />
      <Navigation />
      <HeroSection />
      <ProblemSection />
      <SolutionSection />
      <TechnologySection />
      <ImpactSection />
      <StakeholderSection />
      <PilotHospitalsSection />
      <TimelineSection />
      <GovernmentSection />
      <InvestmentSection />
      <RegionalExpansionSection />
      <CallToActionSection />
      <ContactSection />
      <Footer />
    </div>
  )
}
