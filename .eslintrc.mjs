export default {
  root: true,
  parser: '@typescript-eslint/parser',
  env: {
    browser: true,
    amd: true,
    node: true,
    es6: true,
  },
  plugins: ['@typescript-eslint', 'eslint-plugin-next-on-pages'],
  extends: [
    'eslint:recommended',
    'plugin:jsx-a11y/recommended',
    'eslint-plugin-next-on-pages/recommended',
  ],
  parserOptions: {
    project: true,
    tsconfigRootDir: __dirname,
  },
  rules: {
    'prettier/prettier': 'warn',
    'prefer-const': 'off',
    'react/react-in-jsx-scope': 'off',
    'jsx-a11y/anchor-is-valid': [
      'error',
      {
        components: ['Link'],
        specialLink: ['hrefLeft', 'hrefRight'],
        aspects: ['invalidHref', 'preferButton'],
      },
    ],
    'react/prop-types': 0,
    '@typescript-eslint/no-unused-vars': 0,
    'react/no-unescaped-entities': 0,
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
  },
}
