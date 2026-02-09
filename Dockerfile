# --- Étape 1 : On construit l'application Angular (Node.js) ---
FROM node:20-alpine as build-stage

WORKDIR /app

# On copie les fichiers de dépendances
COPY package*.json ./

# On installe les dépendances
RUN npm install

# On copie tout le reste du code
COPY . .

# On lance la compilation
RUN npm run build -- --configuration production

# --- Étape 2 : On prépare le serveur Apache (Serveur Unique) ---
FROM httpd:2.4-alpine as production-stage

# Configuration Apache (Rewrite et AllowOverride pour Angular)
RUN sed -i \
    '/LoadModule rewrite_module modules\/mod_rewrite.so/s/^#//g' \
    /usr/local/apache2/conf/httpd.conf

RUN sed -i \
    's#AllowOverride [Nn]one#AllowOverride All#' \
    /usr/local/apache2/conf/httpd.conf

# 1. On copie l'application Angular (Le Site)
# ⚠️ Vérifie bien que c'est le bon chemin dist/.../browser
COPY --from=build-stage /app/dist/project-library /usr/local/apache2/htdocs/

# 2. On copie les fichiers de config (Les Données)
# On prend le contenu du dossier local "cloud-data/i18n" et on le met dans un dossier "i18n" sur le serveur
COPY cloud-data /usr/local/apache2/htdocs/i18n/

# On expose le port 80
EXPOSE 80