import type { Config } from 'tailwindcss'
const config:Config={content:['./app/**/*.{ts,tsx}','./components/**/*.{ts,tsx}'],theme:{extend:{borderRadius:{'4xl':'2rem'},boxShadow:{soft:'0 16px 50px rgba(0,0,0,.08)'}}},darkMode:'media',plugins:[]}
export default config
