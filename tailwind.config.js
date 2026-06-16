/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--color-background)',
        surface: {
          DEFAULT: 'var(--color-surface)',
          active: 'var(--color-surface-active)',
        },
        border: 'var(--color-border)',
        brand: {
          DEFAULT: 'var(--color-brand)',
          light: 'var(--color-brand-light)',
        },
        text: {
          primary: 'var(--color-text-primary)',
          body: 'var(--color-text-body)',
          secondary: 'var(--color-text-secondary)',
          muted: 'var(--color-text-muted)',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
        mono: ['"Space Grotesk"', 'monospace'],
      },
    },
  },
  plugins: [],
}
