# Usa Node 18 como base
FROM node:18
# Directorio de trabajo dentro del contenedor
WORKDIR /app
# Copia los archivos necesarios
COPY package*.json ./
RUN npm install
COPY . .
# Compila si aplica
RUN npm run build
# Expone el puerto (puede ser 80, 3000, 8080 según tu app)
EXPOSE 80
# Comando para correr tu app
CMD ["npm", "start"]