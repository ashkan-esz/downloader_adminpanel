FROM node:20.10.0-alpine AS builder

ENV NODE_ENV production

WORKDIR /app

COPY ./package*.json ./
RUN npm install --omit=dev

COPY . .

RUN npm run build

FROM nginx:1.21.6-alpine

# Copying built assets from builder
COPY --from=builder /app/build /usr/share/nginx/html

# Copy .env file and shell script to container
WORKDIR /usr/share/nginx/html
COPY ./env.sh .
COPY .env .

# Add bash
RUN apk add --no-cache bash

# Make our shell script executable
RUN chmod +x env.sh

# Copying our nginx.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf


# Start Nginx server
CMD ["/bin/bash", "-c", "/usr/share/nginx/html/env.sh && nginx -g \"daemon off;\""]
