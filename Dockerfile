# Usa una imagen base de Node.js
FROM node:18

# Establece el directorio de trabajo en el contenedor
WORKDIR /app

# Copia los archivos package.json y package-lock.json
COPY package*.json ./

# Instala las dependencias de React
RUN npm install

# Copia todo el código fuente del frontend
COPY . .

# Compila el proyecto React para producción
RUN npm run build

# Expone el puerto 3000 (puerto por defecto de React)
EXPOSE 3000

# Inicia el servidor de producción de React
CMD ["npm", "start"]
