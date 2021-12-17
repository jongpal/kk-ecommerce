FROM node:alpine

WORKDIR /app
COPY package.json .

# CHECK CI
# RUN npm run ci

RUN npm install --only=prod
COPY . .

CMD ["npm", "start"]