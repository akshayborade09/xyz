// Access Control System Types and Configurations

export type AccessLevel = 'none' | 'limited' | 'full';

export interface AccessConfig {
  level: AccessLevel;
  allowedRoutes: string[];
  restrictedFeatures: string[];
  dashboardSections: string[];
}

// Access configurations for different user levels
export const accessConfigs: Record<AccessLevel, AccessConfig> = {
  none: {
    level: 'none',
    allowedRoutes: ['/auth', '/auth/signin', '/auth/signup'],
    restrictedFeatures: ['*'],
    dashboardSections: [],
  },
  limited: {
    level: 'limited',
    allowedRoutes: [
      '/dashboard',
      '/docs',
      '/documentation',
      '/cost-estimator',
      '/ai-studio',
      '/profile',
      '/support',
      '/settings/profile',
      '/dashboard/profile-completion',
    ],
    restrictedFeatures: [
      'compute',
      'storage',
      'billing',
      'api-keys',
      'ssh-keys',
      'kubernetes',
      'networking',
      'infrastructure',
      'model-deployment',
      'databases',
      'advanced-ai',
      'team-management',
    ],
    dashboardSections: [
      'welcome',
      'documentation',
      'cost-tools',
      'ai-services-limited',
      'profile-completion',
    ],
  },
  full: {
    level: 'full',
    allowedRoutes: ['*'],
    restrictedFeatures: [],
    dashboardSections: ['*'],
  },
};

// Route protection logic
export const checkAccess = (
  route: string,
  userAccessLevel: AccessLevel
): boolean => {
  const config = accessConfigs[userAccessLevel];

  // If no access level defined, deny by default
  if (!config) {
    return false;
  }

  // Check for wildcard access
  if (config.allowedRoutes.includes('*')) {
    return true;
  }

  // Check exact route match
  if (config.allowedRoutes.includes(route)) {
    return true;
  }

  // Check if any allowed route is a prefix of the current route
  return config.allowedRoutes.some(allowedRoute => {
    // Remove trailing slash for consistent matching
    const normalizedRoute = route.replace(/\/$/, '');
    const normalizedAllowed = allowedRoute.replace(/\/$/, '');

    return normalizedRoute.startsWith(normalizedAllowed);
  });
};

// Feature access check
export const checkFeatureAccess = (
  feature: string,
  userAccessLevel: AccessLevel
): boolean => {
  const config = accessConfigs[userAccessLevel];

  if (!config) {
    return false;
  }

  // If no restrictions, allow all features
  if (config.restrictedFeatures.length === 0) {
    return true;
  }

  // If wildcard restriction, deny all
  if (config.restrictedFeatures.includes('*')) {
    return false;
  }

  // Check if feature is specifically restricted
  return !config.restrictedFeatures.includes(feature);
};

// Dashboard section access check
export const checkDashboardSectionAccess = (
  section: string,
  userAccessLevel: AccessLevel
): boolean => {
  const config = accessConfigs[userAccessLevel];

  if (!config) {
    return false;
  }

  // If wildcard access, allow all sections
  if (config.dashboardSections.includes('*')) {
    return true;
  }

  // Check if section is specifically allowed
  return config.dashboardSections.includes(section);
};

// Get access level from user profile completion status
export const getAccessLevelFromProfile = (profileStatus: {
  basicInfoComplete: boolean;
  identityVerified: boolean;
  paymentSetupComplete: boolean;
}): AccessLevel => {
  const { basicInfoComplete, identityVerified, paymentSetupComplete } =
    profileStatus;

  // Full access requires all profile sections completed
  if (basicInfoComplete && identityVerified && paymentSetupComplete) {
    return 'full';
  }

  // Limited access for users with at least basic info (from signup)
  if (basicInfoComplete) {
    return 'limited';
  }

  // No access for incomplete profiles
  return 'none';
};

// Access control error messages
export const getAccessDeniedMessage = (
  feature: string,
  accessLevel: AccessLevel
) => {
  switch (accessLevel) {
    case 'none':
      return 'Please complete your account setup to access this feature.';
    case 'limited':
      return `Complete your profile verification to unlock ${feature}. Finish identity verification and payment setup to gain full access.`;
    default:
      return 'Access denied to this feature.';
  }
};

// Get required completion steps for access level upgrade
export const getRequiredStepsForUpgrade = (
  currentLevel: AccessLevel,
  targetLevel: AccessLevel
) => {
  const steps: string[] = [];

  if (
    currentLevel === 'none' &&
    (targetLevel === 'limited' || targetLevel === 'full')
  ) {
    steps.push('Complete basic information');
  }

  if (currentLevel === 'limited' && targetLevel === 'full') {
    steps.push('Complete identity verification', 'Setup payment method');
  }

  return steps;
};
