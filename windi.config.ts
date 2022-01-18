import { defineConfig } from 'windicss/helpers';

export default defineConfig({
  extract: {
    include: ['src/**/*.{vue,html,jsx,tsx}', 'public/**/*.{html}', './*.html'],
    exclude: ['node_modules', '.git', './stats.html']
  },
  darkMode: 'class',
  shortcuts: {
    'wh-full': 'w-full h-full',
    'flex-center': 'flex justify-center items-center',
    'flex-col-center': 'flex-center flex-col',
    'flex-x-center': 'flex justify-center',
    'flex-y-center': 'flex items-center',
    'i-flex-center': 'inline-flex justify-center items-center',
    'i-flex-x-center': 'inline-flex justify-center',
    'i-flex-y-center': 'inline-flex items-center',
    'b-flex-col': 'flex flex-col',
    'flex-col-stretch': 'b-flex-col items-stretch',
    'i-flex-col': 'inline-flex flex-col',
    'i-flex-col-stretch': 'i-flex-col items-stretch',
    'flex-1-hidden': 'flex-1 overflow-hidden',
    'absolute-lt': 'absolute left-0 top-0',
    'absolute-lb': 'absolute left-0 bottom-0',
    'absolute-rt': 'absolute right-0 top-0',
    'absolute-rb': 'absolute right-0 bottom-0',
    'absolute-tl': 'absolute-lt',
    'absolute-tr': 'absolute-rt',
    'absolute-bl': 'absolute-lb',
    'absolute-br': 'absolute-rb',
    'absolute-center': 'absolute-lt flex-center wh-full',
    'fixed-lt': 'fixed left-0 top-0',
    'fixed-lb': 'fixed left-0 bottom-0',
    'fixed-rt': 'fixed right-0 top-0',
    'fixed-rb': 'fixed right-0 bottom-0',
    'fixed-tl': 'fixed-lt',
    'fixed-tr': 'fixed-rt',
    'fixed-bl': 'fixed-lb',
    'fixed-br': 'fixed-rb',
    'fixed-center': 'fixed left-0 top-0 flex-center wh-full',
    'nowrap-hidden': 'whitespace-nowrap overflow-hidden',
    'ellipsis-text': 'nowrap-hidden overflow-ellipsis',
    'transition-base': 'transition-all duration-300 ease-in-out'
  },
  theme: {
    extend: {
      colors: {
        primary: 'var(--primary-color)',
        'primary-hover': 'var(--primary-color-hover)',
        'primary-pressed': 'var(--primary-color-pressed)',
        'primary-active': 'var(--primary-color-active)',
        info: 'var(--info-color)',
        'info-hover': 'var(--info-color-hover)',
        'info-pressed': 'var(--info-color-pressed)',
        'info-active': 'var(--info-color-active)',
        success: 'var(--success-color)',
        'success-hover': 'var(--success-color-hover)',
        'success-pressed': 'var(--success-color-pressed)',
        'success-active': 'var(--success-color-active)',
        warning: 'var(--warning-color)',
        'warning-hover': 'var(--warning-color-hover)',
        'warning-pressed': 'var(--warning-color-pressed)',
        'warning-active': 'var(--warning-color-active)',
        error: 'var(--error-color)',
        'error-hover': 'var(--error-color-hover)',
        'error-pressed': 'var(--error-color-pressed)',
        'error-active': 'var(--error-color-active)'
      },
      backgroundColor: {
        dark: '#18181c',
        'dark-base': '#101014'
      },
      textColor: {
        'black-base': '#333639',
        'white-base': 'rgba(255, 255, 255, 0.82)'
      },
      transitionProperty: [
        'width',
        'height',
        'background',
        'background-color',
        'padding-left',
        'border-color',
        'right',
        'fill'
      ]
    }
  },
  variants: {},
  plugins: []
});
