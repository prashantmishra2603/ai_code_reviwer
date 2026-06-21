module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#6366f1',
          50:  '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
        },
        secondary: '#0f172a',
        accent: '#a855f7',
        surface: {
          light: '#ffffff',
          dark:  '#1e293b',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Monaco', 'Courier New', 'monospace'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-mesh':   'linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%)',
      },
      animation: {
        'fade-in':      'fadeIn 0.5s ease-out',
        'fade-in-up':   'fadeInUp 0.5s ease-out',
        'scale-in':     'scaleIn 0.3s ease-out',
        'spin-slow':    'spin 8s linear infinite',
        'float':        'float 3s ease-in-out infinite',
        'gradient':     'gradient-shift 4s ease infinite',
        'pulse-glow':   'pulseGlow 2s infinite',
        'shimmer':      'shimmer 2s infinite',
      },
      keyframes: {
        fadeIn:    { from: { opacity: 0 }, to: { opacity: 1 } },
        fadeInUp:  { from: { opacity: 0, transform: 'translateY(24px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        scaleIn:   { from: { opacity: 0, transform: 'scale(0.9)' }, to: { opacity: 1, transform: 'scale(1)' } },
        float:     { '0%, 100%': { transform: 'translateY(0px)' }, '50%': { transform: 'translateY(-8px)' } },
        pulseGlow: { '0%, 100%': { boxShadow: '0 0 0 0 rgba(99,102,241,0.4)' }, '50%': { boxShadow: '0 0 0 12px rgba(99,102,241,0)' } },
        shimmer:   { '0%': { backgroundPosition: '-1000px 0' }, '100%': { backgroundPosition: '1000px 0' } },
        'gradient-shift': { '0%, 100%': { backgroundPosition: '0% 50%' }, '50%': { backgroundPosition: '100% 50%' } },
      },
      boxShadow: {
        'glow':         '0 0 20px rgba(99, 102, 241, 0.3)',
        'glow-lg':      '0 0 40px rgba(99, 102, 241, 0.2)',
        'glow-purple':  '0 0 20px rgba(168, 85, 247, 0.3)',
        'inner-glow':   'inset 0 0 20px rgba(99, 102, 241, 0.1)',
        'card':         '0 4px 24px rgba(0,0,0,0.06)',
        'card-hover':   '0 12px 40px rgba(0,0,0,0.12)',
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '24px',
      },
      transitionDuration: {
        '400': '400ms',
      },
      screens: {
        'xs': '480px',
      },
    },
  },
  plugins: [],
}
