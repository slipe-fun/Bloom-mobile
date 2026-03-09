import { base } from './base'
import { staticColors } from './colors'

export const lightTheme = {
  colors: {
    background: '#ffffff',
    text: '#000000',
    grayBackground: '#f1f1f4',
    secondaryText: '#00000059',
    contentText: '#00000080',
    switcher: '#d7d7db',
    overlayText: '#000000bf',
    pressable: '#ffffff',
    foreground: '#f1f1f4',
    foregroundTransparent: '#70708f1a',
    indicator: '#0000001a',
    shadow: 'rgba(0, 0, 0, 0.06)',
    gradientBlurStart: '#ffffffd9',
    gradientBlurMiddle: '#ffffffd6',
    gradientBlurEnd: '#ffffff00',
    border: '#0000000d',
    ...staticColors,
  },
  ...base,
}

export const darkTheme = {
  colors: {
    background: '#000000',
    text: '#ffffff',
    grayBackground: '#000000',
    secondaryText: '#ffffff59',
    contentText: '#ffffff80',
    switcher: '#595959',
    overlayText: '#ffffffbf',
    foreground: '#1c1c1e',
    pressable: '#1c1c1c',
    foregroundTransparent: '#ffffff1c',
    indicator: '#ffffff26',
    shadow: '#00000000',
    gradientBlurStart: '#000000d9',
    gradientBlurMiddle: '#000000d6',
    gradientBlurEnd: '#00000000',
    border: '#ffffff1a',
    ...staticColors,
  },
  ...base,
}
