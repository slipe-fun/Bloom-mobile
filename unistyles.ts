import { StyleSheet } from "react-native-unistyles";

export const staticColor = {
	white: "#ffffff",
	black: "#000000",
	primary: "#0A84FF",
	orange: "#FF531B",
	green: "#00E560",
	pink: "#FF66F5",
	yellow: "#FFB566",
	cyan: "#28A8E9",

	// Backdrops
	cyanBackdrop: "#28A8E959",
	orangeBackdrop: "#FF531B33",
	orangePlaceholder: "#FF531B80",
	primaryBackdrop: "#0A84FF33",
	primaryPlaceholder: "#0A84FF80",
	whiteBackdrop: '#ffffff33',
};

const base = {
	spacing: {
		/** 2px */ xxs: 2,
		/** 4px */ xs: 4,
		/** 8px */ sm: 8,
		/** 12px */ md: 12,
		/** 16px */ lg: 16,
		/** 20px */ xl: 20,
		/** 24px */ xxl: 24,
	},
	lineHeight: {
		/** 15px */ xs: 15,
		/** 17px */ sm: 17,
		/** 19px */ md: 19,
		/** 24px */ lg: 24,
		/** 34px */ xl: 34,
		/** 39px */ xxl: 39,
	},
	fontSize: {
		/** 12px */ xs: 12,
		/** 14px */ sm: 14,
		/** 16px */ md: 16,
		/** 18px */ lg: 18,
		/** 20px */ xl: 20,
		/** 28px */ xxl: 28,
		/** 32px */ xxxl: 32,
		/** 52px */ super: 56,
	},
	radius: {
		/** 12px */ xs: 12,
		/** 16px */ sm: 16,
		/** 20px */ md: 20,
		/** 24px */ lg: 24,
		/** 28px */ xl: 28,
		/** 32px */ xxl: 32,
		/** 9999px */ full: 9999,
	},
	fontFamily: {
		/** Regular */ regular: "OpenRunde-Regular",
		/** Medium */ medium: "OpenRunde-Medium",
		/** Semibold */ semibold: "OpenRunde-Semibold",
		/** Bold */ bold: "OpenRunde-Bold",
	},
	opacity: {
		/** 35% */ secondaryText: 0.35,
		/** 50% */ contentText: 0.5,
	},
};

export const lightTheme = {
	colors: {
		background: "#ffffffff",
		text: "#000000",
		secondaryText: "#00000059",
		foreground: "#e6e6e6ff",
		foregroundTransparent: '#00000019',
		foregroundBlur: '#00000012',
		border: '#0000000c',
		...staticColor,
	},
	...base,
};

export const darkTheme = {
	colors: {
		background: "#000000",
		text: "#ffffff",
		secondaryText: "#ffffff59",
		foreground: "#1A1A1A",
		foregroundTransparent: '#ffffff19',
		foregroundBlur: '#ffffff12',
		border: '#ffffff0c',
		...staticColor,
	},
	...base,
};

const appThemes = {
	light: lightTheme,
	dark: darkTheme,
};

StyleSheet.configure({
	settings: {
		initialTheme: "dark",
	},
	themes: appThemes,
});

type AppThemes = typeof appThemes;

declare module "react-native-unistyles" {
	export interface UnistylesThemes extends AppThemes {}
}

export default lightTheme;
