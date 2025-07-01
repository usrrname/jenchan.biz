const config = {
  semi: false,
  singleQuote: true,
  tabWidth: 2,
  useTabs: false,
  trailingComma: 'es5',
  bracketSpacing: true,
  plugins: ['prettier-plugin-tailwindcss'],
  exclude: [
    'node_modules',
    'dist',
    '.next',
    'build',
    'public',
    'wrangler.toml',
    'wrangler.jsonc',
  ],
}

export default config
