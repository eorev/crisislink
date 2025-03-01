import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				crisisBlue: {
					50: '#EBF8FF',
					100: '#D1EEFC',
					200: '#A7D8F0',
					300: '#7CC1E4',
					400: '#55A9D7',
					500: '#3490DC',
					600: '#2779BD',
					700: '#1C64A3',
					800: '#12517B',
					900: '#0A3853',
				},
				crisisGold: {
					50: '#FFFBEB',
					100: '#FEF3C7',
					200: '#FDE68A',
					300: '#FCD34D',
					400: '#FBBF24',
					500: '#F59E0B',
					600: '#D97706',
					700: '#B45309',
					800: '#8E4B10',
					900: '#713F12',
				},
				darkBg: {
					DEFAULT: '#1a202c',
					light: '#2d3748',
					lighter: '#4a5568'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'fade-in': {
					'0%': { opacity: '0' },
					'100%': { opacity: '1' }
				},
				'fade-out': {
					'0%': { opacity: '1' },
					'100%': { opacity: '0' }
				},
				'slide-in': {
					'0%': { transform: 'translateY(20px)', opacity: '0' },
					'100%': { transform: 'translateY(0)', opacity: '1' }
				},
				'slide-up': {
					'0%': { transform: 'translateY(100%)', opacity: '0' },
					'100%': { transform: 'translateY(0)', opacity: '1' }
				},
				'scale-in': {
					'0%': { transform: 'scale(0.95)', opacity: '0' },
					'100%': { transform: 'scale(1)', opacity: '1' }
				},
				'pulse-slow': {
					'0%, 100%': { opacity: '1' },
					'50%': { opacity: '0.8' }
				},
				'float': {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-10px)' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.5s ease-out forwards',
				'fade-out': 'fade-out 0.5s ease-out forwards',
				'slide-in': 'slide-in 0.6s ease-out forwards',
				'slide-up': 'slide-up 0.8s ease-out forwards',
				'scale-in': 'scale-in 0.5s ease-out forwards',
				'pulse-slow': 'pulse-slow 4s infinite ease-in-out',
				'float': 'float 6s infinite ease-in-out'
			},
			boxShadow: {
				'neumorphic': '8px 8px 16px #d1d9e6, -8px -8px 16px #ffffff',
				'neumorphic-inset': 'inset 5px 5px 10px #d1d9e6, inset -5px -5px 10px #ffffff',
				'neumorphic-sm': '4px 4px 8px #d1d9e6, -4px -4px 8px #ffffff',
				'neumorphic-md': '6px 6px 12px #d1d9e6, -6px -6px 12px #ffffff',
				'neumorphic-dark': '8px 8px 16px #1a1a1a, -8px -8px 16px #2c2c2c',
				'neumorphic-inset-dark': 'inset 5px 5px 10px #1a1a1a, inset -5px -5px 10px #2c2c2c',
				'neumorphic-sm-dark': '4px 4px 8px #1a1a1a, -4px -4px 8px #2c2c2c',
				'neumorphic-md-dark': '6px 6px 12px #1a1a1a, -6px -6px 12px #2c2c2c',
				'dark-neumorphic': '5px 5px 10px #151a24, -5px -5px 10px #253244',
				'dark-neumorphic-inset': 'inset 3px 3px 6px #151a24, inset -3px -3px 6px #253244',
				'dark-neumorphic-sm': '3px 3px 6px #151a24, -3px -3px 6px #253244',
				'dark-card': '0 4px 6px -1px rgba(0, 0, 0, 0.2), 0 2px 4px -1px rgba(0, 0, 0, 0.1)',
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
