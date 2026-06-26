/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import '@/global.css';

import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#1b1c1c', // Abanoz
    background: '#fcf9f8', // Sedef Cream
    backgroundElement: '#efebe9', // Light warm gray
    backgroundSelected: '#d7ccc8', // Warm brown select
    textSecondary: '#6d4c41', // Ceviz Secondary
    primary: '#6f461f', // Ceviz Brown
    secondary: '#735c00', // Altın Gold
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
