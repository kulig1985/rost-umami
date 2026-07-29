FROM node:22-bookworm-slim

# socat: a mini-oxygen (workerd) localhost-ra köt; a socat teszi ki 0.0.0.0-ra a Caddynek
RUN apt-get update && apt-get install -y --no-install-recommends socat ca-certificates \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# A @shopify/cli + @shopify/mini-oxygen devDeps, DE a `preview` futtatáshoz kellenek,
# ezért a teljes függőségi fát telepítjük (nincs --omit=dev).
COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

ENV NODE_ENV=production \
    SHOPIFY_CLI_NO_ANALYTICS=1 \
    DO_NOT_TRACK=1 \
    CI=1

EXPOSE 3000
COPY docker-entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh
CMD ["/usr/local/bin/entrypoint.sh"]
