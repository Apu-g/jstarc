import React from 'react';
import { render, screen, act, waitFor } from '@testing-library/react';
import Hero3D from '../Hero3D';
import { useLoadingProgress } from '@/hooks/useLoadingProgress';

// Mocks
jest.mock('@/hooks/useLoadingProgress');
jest.mock('@react-three/fiber', () => ({
    Canvas: ({ children }) => <div data-testid="canvas">{children}</div>,
    useFrame: jest.fn(),
    useThree: () => ({ viewport: { width: 10, height: 10 } }),
}));
jest.mock('@react-three/drei', () => ({
    useTexture: jest.fn(() => 'texture.jpg'),
    PerspectiveCamera: () => null,
    Environment: () => null,
}));
jest.mock('gsap', () => ({
    to: jest.fn(),
    timeline: () => ({
        to: jest.fn().mockReturnThis(),
    }),
}));

describe('Hero3D Component', () => {
    beforeEach(() => {
        useLoadingProgress.mockReturnValue({ progress: 0, isReady: false });
    });

    it('renders the loader initially', () => {
        render(<Hero3D />);
        expect(screen.getByAltText('JSTARC Logo')).toBeInTheDocument();
        // Check for loading dots (assuming they are rendered)
    });

    it('transitions to 3D scene when ready', async () => {
        useLoadingProgress.mockReturnValue({ progress: 100, isReady: true });
        render(<Hero3D />);
        
        await waitFor(() => {
             // Check if Canvas is present
             expect(screen.getByTestId('canvas')).toBeInTheDocument();
        });
    });

    it('displays the main text after transition', async () => {
        useLoadingProgress.mockReturnValue({ progress: 100, isReady: true });
        render(<Hero3D />);
        
        // Wait for text to appear
        expect(screen.getByText('JSTARC')).toBeInTheDocument();
        expect(screen.getByText('BENGALURU')).toBeInTheDocument();
    });

    it('handles reduced motion preference', () => {
        // Mock matchMedia
        window.matchMedia = jest.fn().mockImplementation(query => ({
            matches: query === '(prefers-reduced-motion: reduce)',
            media: query,
            onchange: null,
            addListener: jest.fn(), // Deprecated
            removeListener: jest.fn(), // Deprecated
            addEventListener: jest.fn(),
            removeEventListener: jest.fn(),
            dispatchEvent: jest.fn(),
        }));

        render(<Hero3D />);
        // Add assertions for reduced motion behavior if implemented
        // Currently Hero3D uses standard animations, but this test sets up the environment
    });
});
