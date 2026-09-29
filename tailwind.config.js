/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'premium-dark': '#0a0e27',
        'premium-darker': '#060816',
        'premium-blue': '#3b82f6',
        'premium-blue-light': '#60a5fa',
        'premium-gray': '#1e293b',
        'premium-gray-light': '#334155',
      },
      backgroundImage: {
        'gradient-premium': 'linear-gradient(135deg, #0a0e27 0%, #1e293b 100%)',
        'gradient-blue': 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)',
        'hero-pattern': 'radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)',
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'premium': '0 10px 40px rgba(0, 0, 0, 0.3)',
        'premium-lg': '0 20px 60px rgba(0, 0, 0, 0.4)',
        'blue-glow': '0 0 20px rgba(59, 130, 246, 0.3)',
      },
    },
  },
  plugins: [],
};
