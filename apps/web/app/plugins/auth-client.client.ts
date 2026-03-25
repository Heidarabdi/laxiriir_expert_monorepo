import SuperTokens from "supertokens-web-js";
import EmailPassword from "supertokens-web-js/recipe/emailpassword";
import EmailVerification from "supertokens-web-js/recipe/emailverification";
import Session from "supertokens-web-js/recipe/session";
import { normalizeApiBaseUrl } from "@repo/platform/health";

let initialized = false;

export default defineNuxtPlugin(() => {
	if (initialized) {
		return;
	}

	const config = useRuntimeConfig();

	SuperTokens.init({
		appInfo: {
			apiBasePath: "/api/auth",
			apiDomain: normalizeApiBaseUrl(config.public.apiBaseUrl),
			appName: "Laxiriir Expert",
		},
		enableDebugLogs: import.meta.dev,
		recipeList: [
			Session.init(),
			EmailPassword.init(),
			EmailVerification.init(),
		],
	});

	initialized = true;
});
