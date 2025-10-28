/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
          950: '#082f49',
        },
        gold: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        navy: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
        // 🌈 새로운 프리미엄 컬러 팔레트
        neon: {
          50: '#f0fdff',
          100: '#ccfbff',
          200: '#99f6ff',
          300: '#66f0ff',
          400: '#33e9ff',
          500: '#00e3ff',
          600: '#00b6cc',
          700: '#008999',
          800: '#005c66',
          900: '#002e33',
        },
        violet: {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7c3aed',
          800: '#6b21a8',
          900: '#581c87',
        },
        emerald: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
        },
        coral: {
          50: '#fff8f5',
          100: '#ffede6',
          200: '#ffd6c2',
          300: '#ffb899',
          400: '#ff9470',
          500: '#ff6b35',
          600: '#e64a19',
          700: '#cc3300',
          800: '#b32d00',
          900: '#992600',
        },
        glass: {
          white: 'rgba(255, 255, 255, 0.25)',
          'white-dark': 'rgba(255, 255, 255, 0.1)',
          black: 'rgba(0, 0, 0, 0.25)',
          'black-light': 'rgba(0, 0, 0, 0.1)',
        }
      },
      fontFamily: {
        'pretendard': ['Pretendard', 'system-ui', 'sans-serif'],
      },
      animation: {
        'bounce-slow': 'bounce 2s infinite',
        'pulse-slow': 'pulse 3s infinite',
        'spin-slow': 'spin 3s linear infinite',
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'number-roll': 'numberRoll 1s ease-out',
        // 🎭 프리미엄 애니메이션
        'float': 'float 6s ease-in-out infinite',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite alternate',
        'shimmer': 'shimmer 2s linear infinite',
        'morph': 'morph 4s ease-in-out infinite',
        'hologram': 'hologram 3s linear infinite',
        'glass-shine': 'glassShine 3s ease-in-out infinite',
        'number-flip': 'numberFlip 0.8s ease-out',
        'magic-appear': 'magicAppear 1.2s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        numberRoll: {
          '0%': { transform: 'rotateX(90deg)', opacity: '0' },
          '50%': { transform: 'rotateX(45deg)', opacity: '0.5' },
          '100%': { transform: 'rotateX(0deg)', opacity: '1' },
        },
        // 🎨 프리미엄 키프레임
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glowPulse: {
          '0%': { boxShadow: '0 0 20px rgba(59, 130, 246, 0.4)' },
          '100%': { boxShadow: '0 0 40px rgba(59, 130, 246, 0.8)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        morph: {
          '0%, 100%': { borderRadius: '50%' },
          '33%': { borderRadius: '20%' },
          '66%': { borderRadius: '30%' },
        },
        hologram: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        glassShine: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        numberFlip: {
          '0%': { transform: 'rotateY(0deg) scale(1)' },
          '50%': { transform: 'rotateY(90deg) scale(1.1)' },
          '100%': { transform: 'rotateY(0deg) scale(1)' },
        },
        magicAppear: {
          '0%': { 
            opacity: '0', 
            transform: 'scale(0.3) rotate(0deg)',
            filter: 'blur(10px)'
          },
          '50%': { 
            opacity: '0.8', 
            transform: 'scale(1.1) rotate(180deg)',
            filter: 'blur(5px)'
          },
          '100%': { 
            opacity: '1', 
            transform: 'scale(1) rotate(360deg)',
            filter: 'blur(0px)'
          },
        },
      },
      boxShadow: {
        'premium': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        'card': '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'glow': '0 0 20px rgba(59, 130, 246, 0.5)',
        'gold-glow': '0 0 20px rgba(245, 158, 11, 0.5)',
        // 🎭 Glassmorphism & 3D 섀도우
        'glass': '0 8px 32px rgba(31, 38, 135, 0.37)',
        'glass-inset': 'inset 0 1px 0 rgba(255, 255, 255, 0.2)',
        'neon': '0 0 30px rgba(0, 227, 255, 0.6), 0 0 60px rgba(0, 227, 255, 0.4)',
        'neon-pink': '0 0 30px rgba(255, 20, 147, 0.6), 0 0 60px rgba(255, 20, 147, 0.4)',
        'neon-green': '0 0 30px rgba(16, 185, 129, 0.6), 0 0 60px rgba(16, 185, 129, 0.4)',
        'neumorphism': '12px 12px 24px rgba(163, 177, 198, 0.6), -12px -12px 24px rgba(255, 255, 255, 0.5)',
        'neumorphism-inset': 'inset 8px 8px 16px rgba(163, 177, 198, 0.6), inset -8px -8px 16px rgba(255, 255, 255, 0.5)',
        '3d': '0 10px 20px rgba(0, 0, 0, 0.1), 0 6px 6px rgba(0, 0, 0, 0.1)',
        '3d-hover': '0 20px 40px rgba(0, 0, 0, 0.15), 0 12px 12px rgba(0, 0, 0, 0.15)',
        'hologram': '0 0 50px rgba(168, 85, 247, 0.4), 0 0 100px rgba(59, 130, 246, 0.2)',
      },
      backgroundImage: {
        'gradient-premium': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'gradient-gold': 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
        'gradient-navy': 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
        // 🌟 Glassmorphism & 프리미엄 그라데이션
        'glass-gradient': 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
        'glass-dark': 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
        'neon-gradient': 'linear-gradient(135deg, #00e3ff 0%, #a855f7 50%, #ff6b35 100%)',
        'aurora': 'linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #4facfe 100%)',
        'cosmic': 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
        'sunset': 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%)',
        'ocean': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'hologram': 'linear-gradient(45deg, #ff0080, #ff8c00, #40e0d0, #ff0080)',
      },
    },
  },
  plugins: [],
}

