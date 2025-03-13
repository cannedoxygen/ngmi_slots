/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Custom colors for the cyberpunk theme
        'blue': {
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        'purple': {
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
        },
        'gray': {
          700: '#374151',
          750: '#2d3748', // Custom shade
          800: '#1f2937',
          900: '#111827',
        }
      },
      animation: {
        'pulse-fast': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-mini': 'bounce-mini 1s ease infinite',
        'ping-slow': 'ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite',
        'pop-in': 'pop-in 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
      },
      keyframes: {
        'bounce-mini': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        'ping-slow': {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '75%, 100%': { transform: 'scale(1.5)', opacity: '0' },
        },
        'pop-in': {
          '0%': { opacity: '0', transform: 'scale(0.8)' },
          '75%': { opacity: '1', transform: 'scale(1.05)' },
          '100%': { transform: 'scale(1)' },
        },
      },
    },
    fontFamily: {
      'sans': ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
      'heading': ['Orbitron', 'ui-sans-serif', 'system-ui'],
      'mono': ['Roboto Mono', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
    }
  },
  plugins: [],
}