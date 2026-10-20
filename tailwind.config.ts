import type { Config } from 'tailwindcss';
const config: Config = { content: ['./app/**/*.{js,ts,jsx,tsx,mdx}', './components/**/*.{js,ts,jsx,tsx,mdx}'], theme: { extend: { colors: { persona: { navy: '#0c2e63', red: '#f51632', pale: '#fff3f3' } }, boxShadow: { soft: '0 12px 35px rgba(15, 39, 79, .09)' } } }, plugins: [] };
export default config;
