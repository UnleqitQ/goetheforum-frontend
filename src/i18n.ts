import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import AsyncBackend from 'i18next-async-backend';
import detector from "i18next-browser-languagedetector";

type ResourceFetcher = () => Promise<{
	__esModule?: true
	default?: Record<string, unknown>
	[key: string]: unknown
}>;

const resources: { [language: string]: ResourceFetcher | Record<string, ResourceFetcher> } = {
	en: () => import('./assets/lang/en.json'),
	de: () => import('./assets/lang/de.json'),
};

i18n
.use(AsyncBackend)
.use(detector)
.use(initReactI18next)
.init({
	backend: {
		resources
	},
	lng: 'en',
	supportedLngs: ['en', 'de'],
	load: 'languageOnly',
	fallbackLng: 'en',
	interpolation: {
		escapeValue: false
	},
});

export default i18n;
