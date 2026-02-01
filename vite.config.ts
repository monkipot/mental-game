import { defineConfig } from "vite";

export default defineConfig({
    base: "/mental-game/",
    build: {
        rollupOptions: {
            input: {
                main: './index.html',
                'jeu-calcul-mental': './jeu_calcul_mental.html',
                'jeu-des-lettres': './jeu_des_lettres.html',
            }
        }
    }
});
