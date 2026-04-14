/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly VITE_MERCHANT_SESSION_TTL_HOURS?: string;
	readonly VITE_TURNSTILE_SITE_KEY?: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
