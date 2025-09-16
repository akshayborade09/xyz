'use client';

/**
 * Component Usage Tracker
 *
 * This utility helps track component usage across the application.
 * It can be used to identify unused components and monitor how
 * components are being used.
 *
 * Usage:
 * 1. Import this utility in components you want to track
 * 2. Call trackComponentRender in the component's useEffect or render function
 * 3. View usage data in development tools or logs
 */

// Set to store unique component names that have been rendered
const renderedComponents = new Set<string>();

// Track when a component renders
export function trackComponentRender(componentName: string): void {
  if (process.env.NODE_ENV === 'development') {
    renderedComponents.add(componentName);
    console.log(`[Component Tracker] ${componentName} rendered`);
  }
}

// Get list of all components that have been rendered
export function getRenderedComponents(): string[] {
  return Array.from(renderedComponents);
}

// Check if a specific component has been rendered
export function hasComponentRendered(componentName: string): boolean {
  return renderedComponents.has(componentName);
}

// Reset tracking data (useful for testing)
export function resetTracking(): void {
  renderedComponents.clear();
}

// Example usage in a component:
/*
import { trackComponentRender } from '@/utils/component-tracker';

export function MyComponent() {
  useEffect(() => {
    trackComponentRender('MyComponent');
  }, []);
  
  return <div>My Component</div>;
}
*/
