import localFont from 'next/font/local';

export const satoshi = localFont({
  src: [
    {
      path: '../public/fonts/Satoshi-Light.woff',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../public/fonts/Satoshi-LightItalic.woff',
      weight: '300',
      style: 'italic',
    },
    {
      path: '../public/fonts/Satoshi-Regular.woff',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/fonts/Satoshi-Italic.woff',
      weight: '400',
      style: 'italic',
    },
    {
      path: '../public/fonts/Satoshi-Medium.woff',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../public/fonts/Satoshi-MediumItalic.woff',
      weight: '500',
      style: 'italic',
    },
    {
      path: '../public/fonts/Satoshi-Bold.woff',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../public/fonts/Satoshi-BoldItalic.woff',
      weight: '700',
      style: 'italic',
    },
    {
      path: '../public/fonts/Satoshi-Black.woff',
      weight: '900',
      style: 'normal',
    },
    {
      path: '../public/fonts/Satoshi-BlackItalic.woff',
      weight: '900',
      style: 'italic',
    },
  ],
  variable: '--font-satoshi',
  display: 'swap',
});
