export default [
  { name: 'main', path: '/' },
  { name: 'dashboard', path: '/dashboard' },
  { name: 'my-projects', path: '/my-projects' },
  { name: 'new-project', path: '/new-project' },
  { name: 'project', path: '/project/:_id' },
  { name: 'application', path: '/project/:_id/applications/:applicationId' },
  { name: 'setting-application', path: '/application/:_id/setting' },
  { name: 'integration', path: '/project/:_id/applications/:applicationId/integrations/:integrationsId' },
  { name: 'profile', path: '/profile' },
  { name: 'login', path: '/login' },
  { name: 'signup', path: '/signup' },
  { name: 'verify-email', path: '/verify-email/:_token' }
]
