FROM node:18

# Natív binárisok fordításához szükséges eszközök
RUN apt-get update && apt-get install -y python3 build-essential

# Munkakönyvtár beállítása
WORKDIR /app


COPY package.json ./
COPY tsconfig.json ./
COPY src ./src
RUN npm install

RUN export NODE_OPTIONS=--openssl-legacy-provider && npm run build


ENV MONGO_DB_ENV=mongodb://mongo:27017/fitnesz
ENV ACCESS_TOKEN_SECRET=swsh23hjddnns
ENV ACCESS_TOKEN_LIFE=120
ENV REFRESH_TOKEN_SECRET=dhw782wujnd99ahmmakhanjkajikhiwn2n
ENV REFRESH_TOKEN_LIFE=86400

ENV NODE_ENV=production
ENV NODE_OPTIONS=--openssl-legacy-provider

# Port megnyitása
EXPOSE 5000

# Alkalmazás indítása
CMD ["npm", "start"]
