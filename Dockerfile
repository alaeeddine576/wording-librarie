# --- Étape 1 : On construit l'application Angular (Node.js) ---
FROM node:20-alpine as build-stage

WORKDIR /app

# On copie les fichiers de dépendances
COPY package*.json ./

# On installe les dépendances
RUN npm install

# On copie tout le reste du code
COPY . .

# On lance la compilation (le build)
RUN npm run build -- --configuration production

# --- Étape 2 : On prépare le serveur Apache ---
FROM httpd:2.4-alpine as production-stage

# On active le module Rewrite (indispensable pour le .htaccess d'Angular)
RUN sed -i \
    '/LoadModule rewrite_module modules\/mod_rewrite.so/s/^#//g' \
    /usr/local/apache2/conf/httpd.conf

# On autorise le fichier .htaccess à écraser la config (AllowOverride All)
RUN sed -i \
    's#AllowOverride [Nn]one#AllowOverride All#' \
    /usr/local/apache2/conf/httpd.conf

# On copie les fichiers compilés de l'étape 1 vers le dossier public d'Apache
# ⚠️ ATTENTION : Vérifie si ton dossier dist contient "browser". 
# Si oui, garde "/browser". Sinon, retire-le.
COPY --from=build-stage /app/dist/project-library/browser /usr/local/apache2/htdocs/

# On expose le port 80 (standard web)
EXPOSE 80