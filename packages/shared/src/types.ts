export type SidebarModule = {
  id: string
  title: string
  slug: string
  order: number
  iconEmoji?: string
  isGated: boolean
  lessons: SidebarLesson[]
}

export type SidebarLesson = {
  id: string
  title: string
  slug: string
  order: number
  moduleSlug: string
  completed: boolean
  durationMinutes?: number
  videoId?: string
  content?: string
  resources?: LessonResource[]
}

export type LessonResource = {
  id: string
  title: string
  description?: string
  fileType: string
  url: string
}

export type LessonWithModule = SidebarLesson & {
  module: SidebarModule
}

export type UserProgress = {
  completedLessonIds: string[]
  completedModuleIds: string[]
}

export type NextLessonInfo = {
  lesson: SidebarLesson
  module: SidebarModule
} | null

// Marketing dashboard types

export type ServiceResult<T> =
  | { status: 'ok'; data: T }
  | { status: 'unavailable'; error: string }

export type DateRange = {
  from: string // ISO date
  to: string
  label: string
}

export type DateRangePreset = 'today' | '7d' | '30d' | '90d' | 'custom'

export type KpiMetric = {
  label: string
  value: string | number
  previousValue?: string | number
  deltaPercent?: number
  format?: 'currency' | 'percent' | 'number'
  sparklineData?: number[]
}

export type RevenueDataPoint = {
  date: string
  revenue: number
  purchases: number
}

export type TrafficSourceDataPoint = {
  date: string
  direct: number
  organic: number
  metaAds: number
  social: number
  referral: number
}

export type EmailMetricDataPoint = {
  date: string
  openRate: number
  clickRate: number
  subscribers: number
}

export type VariantData = {
  variant: string
  visitors: number
  signups: number
  conversionRate: number
}

export type CampaignData = {
  id: string
  name: string
  status: 'active' | 'paused' | 'completed'
  spend: number
  impressions: number
  clicks: number
  ctr: number
  cpc: number
  conversions: number
  cpa: number
  sparklineData: number[]
}

export type FunnelStep = {
  label: string
  value: number
  conversionFromPrevious?: number
}

export type WeeklyReportData = {
  weekOf: string
  traffic: {
    totalVisitors: number
    fromMetaAds: number
    adSpend: number
    organicDirect: number
  }
  conversions: {
    newEmailSignups: number
    signupRate: number
    bestVariant: string
    costPerSignup: number
  }
  email: {
    welcomeOpenRate: number
    newsletterOpenRate: number
    unsubscribes: number
  }
  sales: {
    courseSales: number
    revenue: number
    cpa: number
  }
}
