# Hero3D Component 

## Overview
The `Hero3D` component replaces the standard hero section with an immersive 3D experience using Three.js, GSAP, and Framer Motion. It features a custom loading sequence, a 3D "burst" of team member photos, and refined typographic animations.

## Features
- **Custom Loader**: Syncs with asset loading using `useLoadingProgress` hook.
- **3D Transition**: Animates the logo from center to navbar position while spawning 3D planes.
- **Team Photo Burst**: Uses WebGL to animate photos of Masters and Black Belts towards the camera with dissolve effects.
- **Parallax Tilt**: Interactive mouse-driven 3D tilt effect on the container.
- **Performance Optimized**: Uses efficient Three.js practices and texture management.

## Props
The component does not currently accept external props but consumes data from:
- `@/data/masters`
- `@/data/blackbelts`

## Usage
```jsx
import Hero3D from '@/components/Hero3D';

export default function Page() {
  return <Hero3D />;
}
```

## Dependencies
- `@react-three/fiber`
- `@react-three/drei`
- `three`
- `gsap`
- `framer-motion`

## Performance Budget
- **Target**: 60 FPS on mid-tier mobile devices.
- **Texture Management**: Textures are loaded via `useTexture` hook. For production, consider using a texture atlas (SpriteSheet) to reduce draw calls if the number of team members grows significantly.
- **Geometry**: Simple planes are used to minimize vertex count.

## Testing
Unit tests are located in `components/__tests__/Hero3D.test.jsx`.
Run tests using your test runner (e.g., `npm test` if Jest is configured).
