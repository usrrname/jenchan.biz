// @ts-check
import fontFamily from "tailwindcss/defaultTheme";

import colors from "tailwindcss/colors";

module.exports = {
  content: [
    './node_modules/pliny/**/*.js',
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,tsx}',
    './components/**/*.{js,ts,tsx}',
    './layouts/**/*.{js,ts,tsx}',
    './data/**/*.mdx',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        headings: ['Shantell Sans', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        ...fontFamily,
      },
      lineHeight: {
        11: '2.75rem',
        12: '3rem',
        13: '3.25rem',
        14: '3.5rem',
      },
      colors: {
        primary: colors.violet,
        secondary: colors.teal,
        gray: colors.gray,
        watermelon: '#FF3366',
        blueberry: '#4D4DFF',
        'lime-punch': '#AAFF00',
        'grape-soda': '#9933FF',
        'mango-tango': '#FF9933',
        'blue-raspberry': '#00CCFF',
      },
      zIndex: {
        60: '60',
        70: '70',
        80: '80',
      },
      typography: ({ theme }) => ({
        DEFAULT: {
          css: {
            a: {
              color: theme('colors.primary.500'),
              '&:hover': {
                color: `${theme('colors.primary.600')} `,
              },
              code: { color: theme('colors.primary.400') },
            },
            'h1,h2': {
              fontWeight: '700',
              letterSpacing: theme('letterSpacing.tight'),
            },
            h3: {
              fontWeight: '600',
            },
            'h1,h2,h3,h4,h5,h6': {
              fontFamily: theme('fontFamily.headings'),
            },
            code: {
              color: theme('colors.indigo.500'),
            },
          },
        },
        invert: {
          css: {
            a: {
              color: theme('colors.primary.300'),
              '&:hover': {
                color: `${theme('colors.primary.400')} `,
              },
              code: { color: theme('colors.primary.400') },
            },
            'h1,h2,h3,h4,h5,h6': {
              fontFamily: theme('fontFamily.headings'),
              color: theme('colors.gray.100'),
            },
          },
        },
      }),
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    function({ addVariant }) {
      addVariant('rave', '&:where(.theme-rave, .theme-rave *)');
    }
  ],
}
