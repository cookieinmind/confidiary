module.exports = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    fontFamily: {
      default: ['Roboto Mono', 'monospace'],
    },
    colors: {
      transparent: 'transparent',
      darkTransparent: 'rgba(0, 0, 0, 0.5)',

      disabled: '#998E8E',
      onDisabled: '#7e7e7e',
      //Main
      //Backgrounds
      surface: '#FCFCFC',
      onSurface: '#201A1A',
      black: '#000000',

      //Extras
      outline: '#71787D',

      error: '#ffb4a9',
      onError: '#680003',
      errorContainer: '#930006',
      onErrorContainer: '#ffdad4',

      //Sins
      lust: '#F0134D',
      gluttony: '#7900FF',
      greed: '#1EAE98',
      sloth: '#FF4D00',
      wrath: '#FA9905',
      pride: '#323EDD',
      envy: '#FA26A0',
      //Virtues
      chastity: '#F889A6',
      temperance: '#BC80FF',
      charity: '#8ED7CB',
      diligence: '#FFA680',
      patience: '#FDCC82',
      humility: '#989EEE',
      kindness: '#FD92CF',
    },
    letterSpacing: {
      tightest: '-0.5px',
      tighter: '-0.25px',
      tight: '-0.1px',
      normal: '0px',
      wide: '0.1px',
      wider: '0.25px',
      widest: '0.5px',
    },
    screens: {
      xs: '360px',
      sm: '640px',
      md: '1023px',
      lg: '1279px',
      xl: '1536px',
      '2xl': '1920px',
    },
    extend: {
      dropShadow: {
        'page-title': '2px 2px 0px #797297',
        chip: '-2px 2px 0px #000000',
      },
      transitionTimingFunction: {
        'in-out-back': 'cubic-bezier(0.7, -0.4, 0.4, 1.4)',
      },
      backdropBlur: {
        xxs: '1px',
        xs: '2px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/line-clamp'),
    // ...
  ],
};
