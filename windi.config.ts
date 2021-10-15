import { defineConfig } from 'windicss/helpers';
import themeSettings from './src/settings/theme.json';

const {
  themeColor,
  otherColor: { info, success, warning, error }
} = themeSettings;

export default defineConfig({
  extract: {
    include: ['src/**/*.{vue,html,jsx,tsx}', 'public/**/*.{html}', './*.html'],
    exclude: ['node_modules', '.git']
  },
  darkMode: 'class', // or 'media'
  shortcuts: {
    'center-layout': 'w-1280px mx-auto px-15px',
    'flex-center': 'flex justify-center items-center',
    'flex-x-center': 'flex justify-center',
    'flex-y-center': 'flex items-center',
    'inline-flex-center': 'inline-flex justify-center items-center',
    'inline-flex-x-center': 'inline-flex justify-center',
    'inline-flex-y-center': 'inline-flex items-center',
    'flex-1-hidden': 'flex-1 overflow-hidden',
    'flex-col-stretch': 'flex flex-col items-stretch',
    'inline-flex-col-stretch': 'flex flex-col items-stretch',
    'absolute-center': 'absolute left-0 top-0 flex justify-center items-center w-full h-full',
    'absolute-lt': 'absolute left-0 top-0',
    'absolute-lb': 'absolute left-0 bottom-0',
    'absolute-rt': 'absolute right-0 top-0',
    'absolute-rb': 'absolute right-0 bottom-0',
    'fixed-center': 'fixed left-0 top-0 flex justify-center items-center w-full h-full',
    'ellipsis-text': 'whitespace-nowrap overflow-hidden overflow-ellipsis',
    'nowrap-hidden': 'whitespace-nowrap overflow-hidden'
  },
  theme: {
    extend: {
      colors: {
        primary: themeColor,
        info,
        success,
        warning,
        error,
        light: '#ffffff',
        dark: '#18181c'
      },
      transitionProperty: ['width', 'height', 'background', 'background-color']
    }
  },
  variants: {},
  plugins: []
});
