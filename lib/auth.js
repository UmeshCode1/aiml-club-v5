import { account, teams, PROJECT_CONFIG } from './appwrite';

// Login and route user based on team role
export async function loginAndRouteUser(email, password) {
  // Create session
  await account.createEmailSession(email, password);

  // Fetch teams and check membership
  const teamList = await teams.list();
  const clubTeam = teamList.teams.find(t => t.$id === PROJECT_CONFIG.TEAM_ID);
  if (!clubTeam) throw new Error('User is not a member of the core club team.');

  // Get user membership and role
  const membership = clubTeam.memberships?.find(m => m.userId === (await account.get()).$id);
  const role = membership?.roles?.[0] || '';

  // Routing logic
  if (role === 'leadership') return '/admin/master-dashboard';
  if (role === 'tech-head') return '/admin/tech-panel';
  if (role === 'event-head') return '/admin/events-manager';
  if (role === 'media-head') return '/admin/media-center';
  if (role === 'stage-head') return '/admin/stage-panel';
  return '/member/home';
}
