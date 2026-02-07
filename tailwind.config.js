/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            // ManyChat Design System Colors (Strict Palette)
            colors: {
                primary: {
                    blue: '#4267FF',       // CTA buttons, links
                    black: '#000000',      // Headlines
                    white: '#FFFFFF',      // Background
                },
                text: {
                    heading: '#000000',    // Main headlines
                    body: '#404040',       // Subheadings, body
                    muted: '#6B7280',      // Secondary text
                },
                bg: {
                    pink: '#FFD6E8',       // Feature card
                    green: '#D4F4DD',      // Feature card
                    purple: '#E5DEFF',     // Feature card
                    blue: '#4A9FBA',       // Feature card
                    orange: '#C88B6B',     // Feature card
                    'light-gray': '#F9FAFB', // Sections
                },
                accent: {
                    orange: '#FF6B4A',     // Decorative lines
                    yellow: '#FFD93D',     // Highlights
                },
                badge: {
                    purple: '#8B5CF6',
                    pink: '#EC4899',
                },
                success: '#10B981',
                meta: '#0081FB',
            },

            // Typography
            fontFamily: {
                sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
            },
            fontSize: {
                '7xl': '4.5rem',       // 72px - Extra large headlines
                '6xl': '3.75rem',      // 60px - Hero headlines (desktop)
                '5xl': '3rem',         // 48px - Hero headlines (mobile)
                '4xl': '2.25rem',      // 36px - Page titles
                '3xl': '1.875rem',     // 30px - Large titles
                '2xl': '1.5rem',       // 24px - Section titles
                'xl': '1.25rem',       // 20px - Subheadings
                'lg': '1.125rem',      // 18px - Large body
                'base': '1rem',        // 16px - Body
                'sm': '0.875rem',      // 14px - Small body
                'xs': '0.75rem',       // 12px - Captions
            },
            fontWeight: {
                black: '900',
                extrabold: '800',
                bold: '700',
                semibold: '600',
                medium: '500',
                normal: '400',
            },
            lineHeight: {
                tight: '1.1',
                snug: '1.25',
                normal: '1.5',
                relaxed: '1.625',
            },
            letterSpacing: {
                tighter: '-0.05em',
                tight: '-0.025em',
                normal: '0',
                wider: '0.025em',
            },

            // Border Radius
            borderRadius: {
                'full': '9999px',      // Pills, buttons
                '2xl': '1.5rem',       // 24px - Feature cards
                'xl': '1rem',          // 16px - Large cards
                'lg': '0.75rem',       // 12px - Cards
                'md': '0.5rem',        // 8px - Default
                'sm': '0.375rem',      // 6px - Small
            },

            // Shadows
            boxShadow: {
                'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
                'button': '0 4px 12px rgba(66, 103, 255, 0.25)',
                'button-hover': '0 6px 12px rgba(66, 103, 255, 0.3)',
                'phone': '0 24px 48px rgba(0, 0, 0, 0.15)',
                'phone-real': '0 50px 100px -20px rgba(50, 50, 93, 0.25), 0 30px 60px -30px rgba(0, 0, 0, 0.3), inset 0 -2px 6px 0 rgba(10, 37, 64, 0.35)',
            },
            backgroundImage: {
                'metal-gradient': 'linear-gradient(to bottom right, #e3e3e3 0%, #a2a2a2 50%, #d4d4d4 100%)',
                'glass-reflection': 'linear-gradient(135deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.05) 40%, rgba(255, 255, 255, 0) 100%)',
            },

            // Container
            maxWidth: {
                'container': '1280px',
            },
        },
    },
    plugins: [],
}
