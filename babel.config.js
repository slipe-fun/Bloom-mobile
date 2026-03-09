module.exports = (api) => {
  api.cache(true)

  return {
    presets: ['babel-preset-expo'],

    plugins: [
      [
        'module-resolver',
        {
          root: ['./src', './app'],
          extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
          alias: {
            '@components': './src/components',
            '@constants': './src/constants',
            '@hooks': './src/hooks',
            '@stores': './src/stores',
            '@screens': './src/screens',
            '@lib': './src/lib',
            '@api': './src/api',
            '@interfaces': './src/interfaces',
            '@assets': './assets',
            '@app': './app',
            '@layouts': './layouts',
            '@providers': './src/providers',
            '@design': './src/design',
          },
        },
      ],

      [
        'react-native-unistyles/plugin',
        {
          root: 'src',
        },
      ],

      // MUST be last
      'react-native-reanimated/plugin',
    ],
  }
}
