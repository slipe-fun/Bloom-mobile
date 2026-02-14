import { StyleSheet } from 'react-native-unistyles'

export const staticColor = {
  white: '#ffffff',
  black: '#000000',
  primary: '#1A8CFF',
  orange: '#FF531B',
  green: '#1AFF7A',
  pink: '#FF1A45',
  yellow: '#FF901A',
  cyan: '#28A8E9',
  purple: '#A41AFF',
  red: '#F43025',
  gray: '#8C8C8C',

  // Backdrops
  whiteBackdrop: '#ffffff80',
  blackBackdrop: '#00000080',
  primaryBackdrop: '#1A8CFF80',
  orangeBackdrop: '#FF531B80',
  greenBackdrop: '#1AFF7A80',
  pinkBackdrop: '#FF1A4580',
  yellowBackdrop: '#FF901A80',
  cyanBackdrop: '#28a8e980',
  purpleBackdrop: '#A41AFF80',
  redBackdrop: '#F4302580',
  grayBackdrop: '#8C8C8C80',
}

const base = {
  spacing: {
    /** 2px    */ xxs: 2,
    /** 4px    */ xs: 4,
    /** 8px    */ sm: 8,
    /** 12px   */ md: 12,
    /** 16px   */ lg: 16,
    /** 20px   */ xl: 20,
    /** 24px   */ xxl: 24,
    /** 28px   */ xxxl: 28,
  },
  lineHeight: {
    /** 15px   */ xs: 15,
    /** 17px   */ sm: 17,
    /** 19px   */ md: 19,
    /** 24px   */ lg: 24,
    /** 34px   */ xl: 34,
    /** 39px   */ xxl: 39,
  },
  fontSize: {
    /** 12px   */ xs: 12,
    /** 14px   */ sm: 14,
    /** 16px   */ md: 16,
    /** 18px   */ lg: 18,
    /** 20px   */ xl: 20,
    /** 28px   */ xxl: 28,
    /** 32px   */ xxxl: 34,
    /** 56px   */ super: 56,
  },
  radius: {
    /** 8px    */ xxs: 8,
    /** 12px   */ xs: 12,
    /** 16px   */ sm: 16,
    /** 20px   */ md: 20,
    /** 24px   */ lg: 24,
    /** 28px   */ xl: 28,
    /** 32px   */ xxl: 32,
    /** 42px   */ xxxl: 42,
    /** 9999px */ full: 9999,
  },
  opacity: {
    /** 35%    */ secondaryText: 0.35,
    /** 50%    */ contentText: 0.5,
    /** 75%    */ overlayText: 0.75,
  },
  borderWidth: {
    /** 1px    */ md: 1.25,
  },
  fontFamily: {
    /** Regular  */ regular: 'OpenRunde-Regular',
    /** Medium   */ medium: 'OpenRunde-Medium',
    /** Semibold */ semibold: 'OpenRunde-Semibold',
    /** Bold     */ bold: 'OpenRunde-Bold',
  },
}

export const lightTheme = {
  colors: {
    background: '#ffffff',
    text: '#000000',
    secondaryText: '#00000059',
    contentText: '#00000080',
    overlayText: '#000000bf',
    foreground: '#e0e0e0',
    foregroundTransparent: '#0000001f',
    indicator: '#0000001a',
    foregroundBlur: '#8080801a',
    gradientBlur: '#ffffffd9',
    border: '#0000001a',
    ...staticColor,
  },
  ...base,
}

export const darkTheme = {
  colors: {
    background: '#000000',
    text: '#ffffff',
    secondaryText: '#ffffff59',
    contentText: '#ffffff80',
    overlayText: '#ffffffbf',
    foreground: '#1f1f1f',
    foregroundTransparent: '#ffffff1f',
    indicator: '#ffffff26',
    foregroundBlur: '#80808033',
    gradientBlur: '#000000d9',
    border: '#ffffff1a',
    ...staticColor,
  },
  ...base,
}

const appThemes = {
  light: lightTheme,
  dark: darkTheme,
}

StyleSheet.configure({
  settings: {
    adaptiveThemes: true,
  },
  themes: appThemes,
})

type AppThemes = typeof appThemes

declare module 'react-native-unistyles' {
  export interface UnistylesThemes extends AppThemes {}
}
