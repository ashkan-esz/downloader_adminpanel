FROM node:18.16.0-alpine AS builder

ENV NODE_ENV production

ARG REACT_APP_BASE_URL
ENV REACT_APP_BASE_URL $REACT_APP_BASE_URL

WORKDIR /app

COPY ./package*.json ./
RUN npm install --omit=dev

COPY . .

RUN npm run build

FROM nginx:1.21.6-alpine

# Copying built assets from builder
COPY --from=builder /app/build /usr/share/nginx/html

# Copying our nginx.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

ENTRYPOINT ["nginx", "-g", "daemon off;"]
