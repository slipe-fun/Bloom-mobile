import { base } from './base'
import { staticColors } from './colors'

export const lightTheme = {
  colors: {
    background: '#ffffff',
    text: '#000000',
    grayBackground: '#f1f1f4',
    secondaryText: '#00000059',
    contentText: '#00000080',
    section: '#ffffff',
    switcher: '#d7d7db',
    overlayText: '#000000bf',
    pressable: '#ffffff80',
    sectionForeground: '#ffffff',
    foreground: '#f1f1f4',
    foregroundTransparent: '#70708f1a',
    indicator: '#0000001a',
    shadow: 'rgba(0, 0, 0, 0.06)',
    // Default gradient
    gradientBlurStart: '#ffffffe6',
    gradientBlurEnd: '#ffffff00',
    // Gray gradient
    grayGradientBlurStart: '#f1f1f4e6',
    grayGradientBlurEnd: '#f1f1f400',
    border: '#0000000d',
    ...staticColors,
  },
  ...base,
}

export const darkTheme = {
  colors: {
    background: '#000000',
    text: '#ffffff',
    grayBackground: '#0f0f10ff',
    secondaryText: '#ffffff59',
    contentText: '#ffffff80',
    switcher: '#595959',
    overlayText: '#ffffffbf',
    foreground: '#1b1b1d',
    sectionForeground: '#1b1b1d',
    pressable: '#14141480',
    foregroundTransparent: '#ffffff1c',
    indicator: '#ffffff26',
    shadow: '#00000000',
    // Default gradient
    gradientBlurStart: '#000000e6',
    gradientBlurEnd: '#00000000',
    // Gray gradient
    grayGradientBlurStart: '#0f0f10e6',
    grayGradientBlurEnd: '#0f0f1000',
    border: '#ffffff17',
    ...staticColors,
  },
  ...base,
}
