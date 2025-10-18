module.exports = function (api) {
	api.cache(true);
	return {
		presets: ['babel-preset-expo'],
		plugins: [
			[
				"module-resolver",
				{
					root: ["./src"],
					alias: {
						"@components": "./src/components",
						"@constants": "./src/constants",
                        "@hooks": "./src/hooks",
                        "@stores": "./src/stores",
						"@assets": "./assets",
						"@screens": "./src/screens",
						"@providers": "./src/providers",
						"@lib": "./src/lib",
						"@interfaces": "./src/interfaces/index",
						"@api": "./src/api"
					},
				},
			],
			[
				"react-native-unistyles/plugin",
				{
					root: "src",
				},
			],
            'react-native-reanimated/plugin'
		],
	};
};
