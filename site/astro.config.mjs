import {defineConfig} from 'astro/config'
import tailwindcss from '@tailwindcss/vite'

// Site 100 % statique : Vercel le sert tel quel, sans adaptateur.
export default defineConfig({
  site: 'https://planeur35.org',
  output: 'static',
  vite: {plugins: [tailwindcss()]},
})
