import {
  BookIcon,
  BookOpenIcon,
  BriefcaseBusinessIcon,
  CalendarIcon,
  HeartPulseIcon,
  InfoIcon,
  MonitorIcon,
  MusicIcon,
  PartyPopperIcon,
  PizzaIcon,
  TicketIcon,
  TrendingUpIcon,
  UserIcon,
  VolleyballIcon,
  CheckCircle,
  CircleOff,
  HelpCircle,
  GamepadIcon,
} from 'lucide-react'

export const headerItems = [
  {
    label: 'Browse Events',
    url: '/events',
    icon: CalendarIcon,
  },
  {
    label: 'How It Works',
    url: '/how-it-works',
    icon: BookOpenIcon,
  },
  {
    label: 'Help Center',
    url: '/help-center',
    icon: InfoIcon,
  },
]

export const profileItems = [
  {
    label: 'Profile Settings',
    url: 'profile',
    icon: UserIcon,
  },
  {
    label: 'Events Organized',
    url: 'events',
    icon: CalendarIcon,
  },
  {
    label: 'Purchase Tickets',
    url: 'tickets',
    icon: TicketIcon,
  },
  {
    label: 'Sales & Analytics',
    url: 'sales-analytics',
    icon: TrendingUpIcon,
  },
]

export const categoryIconsList = [
  {
    icon: MusicIcon,
    name: 'Music & Concerts',
  },
  {
    icon: BriefcaseBusinessIcon,
    name: 'Business & Networking',
  },
  {
    icon: PartyPopperIcon,
    name: 'Festivals & Celebrations',
  },
  {
    icon: BookIcon,
    name: 'Education & Learning',
  },
  {
    icon: MonitorIcon,
    name: 'Tech & Innovation',
  },
  {
    icon: VolleyballIcon,
    name: 'Sports & Outdoors',
  },
  {
    icon: HeartPulseIcon,
    name: 'Health & Wellness',
  },
  {
    icon: PizzaIcon,
    name: 'Food & Drink',
  },
]

export const labels = [
  {
    value: 'bug',
    label: 'Bug',
  },
  {
    value: 'feature',
    label: 'Feature',
  },
  {
    value: 'documentation',
    label: 'Documentation',
  },
]

export const statuses = [
  {
    value: 'Draft',
    label: 'Draft',
    icon: HelpCircle,
  },
  {
    value: 'Published',
    label: 'Published',
    icon: CheckCircle,
  },
  {
    value: 'Cancelled',
    label: 'Cancelled',
    icon: CircleOff,
  },
]

export const categories = [
  {
    label: 'Music',
    value: 'music',
    icon: MusicIcon,
  },
  {
    label: 'Business',
    value: 'business',
    icon: BriefcaseBusinessIcon,
  },
  {
    label: 'Festivals',
    value: 'festivals',
    icon: PartyPopperIcon,
  },
  {
    label: 'Food & Drink',
    value: 'food-drink',
    icon: PizzaIcon,
  },
  {
    label: 'Hobbies',
    value: 'hobbies',
    icon: GamepadIcon,
  },
  {
    label: 'Health & Wellness',
    value: 'health-wellness',
    icon: HeartPulseIcon,
  },
]
