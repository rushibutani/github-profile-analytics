// This file has been intentionally simplified to prevent showing
// loading skeletons on the initial homepage load (when no user is searched).
// Loading states are now handled by Suspense boundaries in page.tsx
// and dynamic imports for better control.

export default function Loading() {
  // Return minimal loading UI that only shows during navigation
  return null;
}
