export const MOBILE_SCHEME = "pw.blooom.app1";
export const REDIRECT_URL_WITH_SCHEME = `${MOBILE_SCHEME}://oauth2redirect/google`;

export const GOOGLE_CLIENT_ID = "917155719162-pekpfajbrg87sjfj03iq68agtmnukb1r.apps.googleusercontent.com";
export const REDIRECT_URI = "https://api.bloomapp.pw/oauth2/google/redirect";
export const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
export const SCOPE = ["https://www.googleapis.com/auth/userinfo.email", "https://www.googleapis.com/auth/userinfo.profile"].join(" ");
export const STATE = "random-state";

export const getAuthUrl = () => {
	const params = new URLSearchParams({
		client_id: GOOGLE_CLIENT_ID,
		redirect_uri: REDIRECT_URI,
		response_type: "code",
		scope: "https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile",
		state: "random-state",
	});

	return `${GOOGLE_AUTH_URL}?${params.toString()}`;
};
