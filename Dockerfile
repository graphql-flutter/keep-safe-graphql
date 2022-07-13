FROM node:16
LABEL mantainer="Vincenzo Palazzo vincenzopalazzodev@gmail.com"

# Create app directory
WORKDIR /usr/src/app

# Bundle app source
COPY . .

RUN npm install

CMD [ "npm", "run", "start" ]