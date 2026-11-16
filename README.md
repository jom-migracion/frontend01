# React + TypeScript + Vite

## Para empezar

Primera opcion, para inicar el proyecto en local desarrollo


```bash

## clonar repositorio 
git clone "proyect-name" 

## instalar dependencias
npm install 

# crear un archivo .env en la raiz, con el contenido del archivo .env.config

## inicar proyecto
npm run dev 

```

Segunda opcion, para inicar el proyecto en contenedor docker para desarrollo 


```bash

## clonar repositorio 
git clone "proyect-name"

## instalar dependencias
npm install 

# crear un archivo .env en la raiz, con el contenido del archivo .env.config

docker-compose -f docker-compose.dev.yml up --build -d ## construir contenedor DEV, despues de clonar el reposiorito, en caso de modificacion de dockerfile o docker-compose.dev.yml o instalacion de nueva dependencia



## opciones adicionales para detener contenedor o volver a iniciar

docker-compose -f docker-compose.dev.yml down -v ## para eliminar el  contenedor y los volumenes asociados

docker-compose -f docker-compose.dev.yml up -d ## para levantar contenedor

```

## Anidar archivos en package.json, en IDE VSCODE

```
File -> Preferences -> Settings -> en search setting buscar "file nesting" -> habilitarlo "Explorer › File Nesting: Enabled"

en package.json editar y agrear la siguiente lista -> package-lock.json, yarn.lock, pnpm-lock.yaml, bun.lockb, bun.lock,eslint.config.js, .prettierignore, .prettierrc,.gitignore, Dockerfile.dev, docker-compose.yml, docker-compose.dev.yml, .dockerignore

```