import { account, teams, PROJECT_CONFIG } from './appwrite';

export async function loginAndRouteUser(email, password) {
  // 1. Create session
  await account.createEmailSession(email, password);

  // 2. Fetch teams list
  const teamList = await teams.list();

  // 3. Check membership in core-club-team
  const clubTeam = teamList.teams.find(t => t.$id === PROJECT_CONFIG.TEAM_ID);

  if (!clubTeam) {
    // Not in the team
    return '/member/home';
  }

  // Get user details to find specific membership roles
  // Note: teams.list() doesn't provide roles directly in all SDK versions/contexts,
  // so we fetch the specific membership or use a robust check.
  // However, to strictly follow the "Fetch teams.list()" flow, we use the list to confirm presence.

  try {
    const user = await account.get();
    // Try to get membership details to access roles
    // We use listMemberships as it is often accessible to team members/admins
    const membershipList = await teams.listMemberships(PROJECT_CONFIG.TEAM_ID);
    const membership = membershipList.memberships.find(m => m.userId === user.$id);

    const roles = membership?.roles || [];

    // 4. Routing Logic
    if (roles.includes('leadership')) return '/admin/master-dashboard';
    if (roles.includes('tech-head')) return '/admin/tech-panel';
    if (roles.includes('event-head')) return '/admin/events-manager';
    if (roles.includes('media-head')) return '/admin/media-center';
    if (roles.includes('stage-head')) return '/admin/stage-panel';

    return '/member/home';
  } catch (error) {
    console.error('Error fetching roles:', error);
    // Fallback if we can't get roles but are in the team
    return '/member/home';
  }
}
