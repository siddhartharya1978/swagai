export const animations = {
  pulse: 'animate-pulse',
  fadeIn: 'animate-fade-in',
  fadeOut: 'animate-fade-out',
  slideIn: 'animate-slide-in',
  slideOut: 'animate-slide-out',
}

// Add these to your tailwind.config.js under extend > keyframes and animation:
// keyframes: {
//   'fade-in': { '0%': { opacity: 0 }, '100%': { opacity: 1 } },
//   'fade-out': { '0%': { opacity: 1 }, '100%': { opacity: 0 } },
//   'slide-in': { '0%': { transform: 'translateY(40px)', opacity: 0 }, '100%': { transform: 'translateY(0)', opacity: 1 } },
//   'slide-out': { '0%': { transform: 'translateY(0)', opacity: 1 }, '100%': { transform: 'translateY(40px)', opacity: 0 } },
// },
// animation: {
//   'fade-in': 'fade-in 0.5s ease-out',
//   'fade-out': 'fade-out 0.5s ease-in',
//   'slide-in': 'slide-in 0.5s cubic-bezier(0.4,0,0.2,1)',
//   'slide-out': 'slide-out 0.5s cubic-bezier(0.4,0,0.2,1)',
// }, 