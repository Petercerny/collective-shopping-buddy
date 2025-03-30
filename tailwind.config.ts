
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
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				brand: {
					DEFAULT: '#F2FCE2',  // Soft Green
					light: '#FEF7CD',    // Soft Yellow
					dark: '#E5DEFF',     // Soft Purple
					accent: '#FFDEE2'    // Soft Pink
				},
				// Updated more vibrant pastel colors
				pastel: {
					green: '#C1F0A0',    // Vibrant Pastel Green
					yellow: '#FFE878',   // Vibrant Pastel Yellow
					orange: '#FFAA7A',   // Vibrant Pastel Orange
					purple: '#D3BBFF',   // Vibrant Pastel Purple
					pink: '#FFB7C5',     // Vibrant Pastel Pink
					peach: '#FFC4A3',    // Vibrant Pastel Peach
					blue: '#A1D0FF',     // Vibrant Pastel Blue
					gray: '#E6E6F5',     // Vibrant Pastel Gray
				},
				// Added color palette options
				palette: {
					// Candy palette
					candy: {
						primary: '#FFB7C5',  // Pink
						secondary: '#D3BBFF', // Purple
						accent: '#A1D0FF',   // Blue
						neutral: '#E6E6F5',  // Gray
						highlight: '#FFAA7A', // Orange
					},
					// Sunset palette
					sunset: {
						primary: '#FFE878',  // Yellow
						secondary: '#FFAA7A', // Orange
						accent: '#FFB7C5',   // Pink
						neutral: '#E6E6F5',  // Gray
						highlight: '#FFC4A3', // Peach
					},
					// Ocean palette
					ocean: {
						primary: '#A1D0FF',  // Blue
						secondary: '#C1F0A0', // Green
						accent: '#D3BBFF',   // Purple
						neutral: '#E6E6F5',  // Gray
						highlight: '#FFE878', // Yellow
					},
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
					from: {
						opacity: '0',
					},
					to: {
						opacity: '1',
					},
				},
				'slide-up': {
					from: {
						transform: 'translateY(10px)',
						opacity: '0',
					},
					to: {
						transform: 'translateY(0)',
						opacity: '1',
					},
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.3s ease-out',
				'slide-up': 'slide-up 0.3s ease-out'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
