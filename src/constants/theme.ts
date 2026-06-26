/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import '@/global.css';

import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#2C1E15', // Deep Abanoz/Walnut Brown
    background: '#FAF6F0', // Soft warm cream
    backgroundElement: '#F2EAE1', // Lighter warm cream for cards
    backgroundSelected: '#E5D7C6', // Selected background indicator
    textSecondary: '#5E4738', // Medium warm brown for subtitles
    primary: '#7D4F2A', // Ceviz Brown
    secondary: '#A07817', // Altın Gold
  },
  dark: {
    text: '#fcf9f8', // Sedef Cream
    background: '#14110f', // Very dark Walnut Brown
    backgroundElement: '#2a221d', // Dark Ceviz Element
    backgroundSelected: '#42342c', // Dark select
    textSecondary: '#a1887f', // Muted warm brown
    primary: '#8b5e34', // Lighter Ceviz Brown
    secondary: '#fed65b', // Bright Altın Gold
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = {
  sans: 'HankenGrotesk_400Regular',
  sansSemiBold: 'HankenGrotesk_600SemiBold',
  sansBold: 'HankenGrotesk_700Bold',
  serif: 'LibreCaslonText_400Regular',
  serifBold: 'LibreCaslonText_700Bold',
  mono: 'JetBrainsMono_400Regular',
  monoBold: 'JetBrainsMono_700Bold',
};

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
