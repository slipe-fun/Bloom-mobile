type Provider = "google" | "yandex" | "mailru" | "microsoft" | "protonmail" | "unknown";

const providers: Record<Provider, string[]> = {
	google: ["gmail.com", "googlemail.com"],
	yandex: ["yandex.ru", "yandex.com", "ya.ru"],
	mailru: ["mail.ru", "inbox.ru", "bk.ru", "list.ru"],
	microsoft: ["outlook.com", "hotmail.com", "live.com", "msn.com"],
	protonmail: ["protonmail.com", "proton.me"],
	unknown: [],
};

export default function parseEmail(email: string): { valid: boolean; provider: Provider } {
	if (!email || typeof email !== "string") {
		return { valid: false, provider: "unknown" };
	}

	const trimmedEmail = email.trim();
	if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
		return { valid: false, provider: "unknown" };
	}

	const domain = trimmedEmail.split("@")[1]?.toLowerCase();
	if (!domain) {
		return { valid: false, provider: "unknown" };
	}

	const provider = (Object.keys(providers) as Provider[]).find(
		(p) => p !== "unknown" && providers[p].includes(domain)
	) ?? "unknown";

	return { valid: true, provider };
}
