import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class WordingService {
    private http = inject(HttpClient);

    // 1. Le Signal : La "boîte" réactive qui contient les traductions
    public translations = signal<any>({});

    // 2. Gestion de la langue actuelle
    public currentLang = signal<string>('en');

    async initWording() {
        console.log('🔄 Initialisation du Wording Service...');

        try {
            // Étape A : Récupérer la config version
            // On pointe désormais vers votre sserveur de config distant
            const baseUrl = 'https://famous-piroshki-cb8db3.netlify.app/i18n';

            const config = await firstValueFrom(this.http.get<any>(`${baseUrl}/config.json`));
            const serverVersion = config.version;
            // Étape B : Algorithme de Cache
            const cacheKey = `wording_data_${this.currentLang()}_v${serverVersion}`;
            const storedData = localStorage.getItem(cacheKey);

            if (storedData) {
                console.log('⚡ Cache Hit : Chargement depuis LocalStorage (' + cacheKey + ')');
                this.translations.set(JSON.parse(storedData));
                return;
            }

            // Étape C : Téléchargement (Si cache vide ou version différente)
            console.log('⬇️ Mise à jour requise : Téléchargement du JSON');
            await this.loadTranslationFromServer(serverVersion, baseUrl);

        } catch (error) {
            console.error("Erreur critique de chargement wording", error);
        }
    }

    // Méthode pour télécharger et stocker
    private async loadTranslationFromServer(version: string, baseUrl: string) {
        const lang = this.currentLang();
        // Construction de l'URL dynamique vers Netlify
        const url = `${baseUrl}/${lang}.v${version}.json`;

        const data = await firstValueFrom(this.http.get<any>(url));

        // Mise à jour du Signal (l'écran change)
        this.translations.set(data);

        // Mise à jour du Cache avec la version dans la clé
        const cacheKey = `wording_data_${lang}_v${version}`;
        localStorage.setItem(cacheKey, JSON.stringify(data));

        // Optionnel : on garde la version globale si besoin, mais le cacheKey suffit désormais
        localStorage.setItem('wording_version', version);
    }

    async switchLanguage(lang: string) {
        this.currentLang.set(lang);
        await this.initWording();
    }

    // Utilitaire pour récupérer une clé imbriquée (ex: "HOME.TITLE")
    get(key: string): string {
        const keys = key.split('.');
        let result = this.translations();

        for (const k of keys) {
            if (result && result[k]) {
                result = result[k];
            } else {
                return key; // Retourne la clé si traduction manquante (Fallback)
            }
        }
        return result;
    }
}