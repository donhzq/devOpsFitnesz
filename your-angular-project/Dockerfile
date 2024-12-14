# 1. Build fázis: a forráskód fordítása
FROM node:18 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
# Feltételezzük, hogy az Angular projekt neve "your-angular-project" a workspace-ben, így a dist/your-angular-project mappába épül.
#RUN npx ng build --configuration production --project your-angular-project

# 2. Runtime fázis: Nginx
#FROM nginx:alpine
# Másoljuk a lefordított statikus fájlokat a Nginx default document root-jába
#COPY --from=build /app/dist/your-angular-project /usr/share/nginx/html

# Alapértelmezés szerint a Nginx a 80-as porton fut
EXPOSE 4200
#CMD ["nginx", "-g", "daemon off;"]
CMD ["npm" , "start"]
