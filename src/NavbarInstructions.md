
# How to Add Theme Toggle to Navbar

Since the Navbar component is marked as read-only, you'll need to manually modify it to add the theme toggle.

Import the ThemeToggle component and add it to the right side of the navbar:

```tsx
import { ThemeToggle } from './ThemeToggle';

// Find the navigation div in the navbar
// Then add the ThemeToggle component alongside your other navbar items:

<div className="flex items-center gap-2">
  {/* Your existing navbar items */}
  <ThemeToggle />
</div>
```

This will add a sun/moon icon button that users can click to toggle between light and dark mode.
