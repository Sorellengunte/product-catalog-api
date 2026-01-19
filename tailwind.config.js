/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],

  // ⭐ IMPORTANT : empêche Tailwind de supprimer les gradients
  safelist: [
    'bg-gradient-to-r',
    'bg-gradient-to-b',
    'from-blue-600',
    'from-indigo-600',
    'from-cyan-600',
    'via-blue-700',
    'via-purple-700',
    'to-indigo-800',
    'to-violet-800',
    'to-blue-900',
    'opacity-80',
    'opacity-90',
  ],

  theme: {
    extend: {
      // 🎨 Gradients personnalisés (OPTIONNEL mais PRO)
      backgroundImage: {
        'hero-blue': 'linear-gradient(90deg, #2563eb, #1d4ed8, #1e40af)',
        'hero-purple': 'linear-gradient(90deg, #4f46e5, #7c3aed, #6d28d9)',
        'hero-cyan': 'linear-gradient(90deg, #0891b2, #1d4ed8, #1e3a8a)',
      },
    },
  },

  plugins: [],
}
