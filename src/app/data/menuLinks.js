export const menuLinks = [
  {
    name: 'Home',
    url: '/',
    icon: 'fas fa-home',
    require: 'any',
    requiresOrg: false
  },
  {
    name: 'Posts',
    url: '/posts',
    icon: 'fas fa-newspaper',
    require: 'any',
    requiresOrg: true
  },
  {
    name: 'Calendar',
    url: '/calendar',
    icon: 'fas fa-calendar-alt',
    require: 'any',
    requiresOrg: false
  },
  {
    name: 'Employees',
    url: '/employees',
    icon: 'fas fa-users', 
    require: 'classa',
    requiresOrg: true
  },
  {
    name: 'Projects',
    url: '/projects',
    icon: 'fas fa-project-diagram',
    require: 'any',
    requiresOrg: true
  },
  {
    name: 'Meetings',
    url: '/meetings',
    icon: 'fas fa-video',
    require: 'any',
    requiresOrg: true
  },
  {
    name: 'Messages',
    url: '/messages',
    icon: 'fas fa-comments',
    require: 'any',
    requiresOrg: true
  },
  {
    name: 'Events',
    url: '/events',
    icon: 'fas fa-calendar-check',
    require: 'any',
    requiresOrg: true
  },
  {
    name: 'Resources',
    url: '/resources',
    icon: 'fas fa-book',
    require: 'any',
    requiresOrg: true
  },
  {
    name: 'Settings',
    url: '/settings',
    icon: 'fas fa-cog',
    require: 'any',
    requiresOrg: false
  }
]