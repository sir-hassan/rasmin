FROM node:14

WORKDIR /app

COPY package*.json ./

RUN if [ -d .npm-cache ]; then npm ci --cache .npm-cache --prefer-offline; else npm ci; fi

COPY . .

RUN npm run build

CMD npm run start