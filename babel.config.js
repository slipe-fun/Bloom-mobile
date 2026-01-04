module.exports = (api) => {
  api.cache(true)

  return {
    presets: ['babel-preset-expo'],

    plugins: [
      [
        'module-resolver',
        {
          root: ['./src'],
          extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
          alias: {
            '@components': './src/components',
            '@constants': './src/constants',
            '@hooks': './src/hooks',
            '@stores': './src/stores',
            '@screens': './src/screens',
            '@lib': './src/lib',
            '@api': './src/api',
            '@providers': './src/api/providers',
            '@interfaces': './src/interfaces',
            '@assets': './assets',
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
