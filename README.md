# Project Library (Angular 16)

Calculatrice de version et gestion de wording (Downgraded to Angular 16).

## Prérequis

- **Node.js** : Version 16 ou 18 recommandée (LTS).
- **npm** : Version 8 ou 9.

## Installation et Lancement

1.  **Cloner le projet** :
    ```bash
    git clone <URL_DU_REPO>
    cd project-library
    ```

2.  **Installer les dépendances** :
    ```bash
    npm install
    ```

3.  **Lancer le serveur de développement** :
    ```bash
    npm start
    # ou
    ng serve
    ```
    L'application sera accessible sur `http://localhost:4200`.

4.  **Builder pour la production** :
    ```bash
    npm run build
    ```
    Les fichiers compilés seront dans `dist/project-library`.

## Docker

Pour lancer avec Docker :

```bash
docker build -t app-angular .
docker run -d -p 8080:80 app-angular
```
Accès sur `http://localhost:8080`.
