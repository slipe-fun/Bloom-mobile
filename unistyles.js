import { StyleSheet } from "react-native-unistyles";

const base = {
	spacing: {
		xxs: 2,
		xs: 4,
		sm: 8,
		md: 12,
		lg: 16,
		xl: 20,
		xxl: 24,
	},
	lineHeight: {
		xs: 15,
		sm: 17,
		md: 19,
		lg: 24,
		xl: 34,
		xxl: 39,
	},
	fontSize: {
		xs: 12,
		sm: 14,
		md: 16,
		lg: 20,
		xl: 28,
		xxl: 32,
	},
	radius: {
		sm: 12,
		md: 20,
		lg: 24,
		xl: 32,
		full: 9999,
	},
	fontFamily: {
		regular: "OpenRunde-Regular",
		medium: "OpenRunde-Medium",
		semibold: "OpenRunde-Semibold",
		bold: "OpenRunde-Bold",
	},
	opacity: {
		secondaryText: 0.35,
		contentText: 0.7,
	},
};

export const lightTheme = {
	colors: {
		background: "#ffffffff",
		text: "#000000",
		white: "#ffffff",
		black: "#000000",
		secondaryText: "#00000059",
		foreground: "#E0E0E0",
		primary: "#0A84FF",
		orange: "#FF531B",
		green: "#00E560",
		pink: "#FF66F5",
		yellow: "#FFB566",
		cyan: "#28A8E9",
		cyanBackdrop: "#28a8e959",
	},
	...base,
};

StyleSheet.configure({
	settings: {
		initialTheme: "light",
	},
	themes: {
		light: lightTheme,
	},
});

export default lightTheme;
