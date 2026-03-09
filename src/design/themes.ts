import { base } from './base'
import { staticColors } from './colors'

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
    ...staticColors,
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
    ...staticColors,
  },
  ...base,
}
