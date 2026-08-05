/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: '#0B1120',
        surface: '#111827',
        'surface-elevated': '#1E293B',
        border: '#334155',
        primary: '#06B6D4',
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
        'text-primary': '#F1F5F9',
        'text-secondary': '#94A3B8',
        'text-muted': '#64748B',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      spacing: {
        'sidebar': '240px',
        'topnav': '56px',
      },
    },
  },
  plugins: [],
}
