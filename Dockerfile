FROM node:22-bookworm-slim

# socat: a mini-oxygen (workerd) localhost-ra köt; a socat teszi ki 0.0.0.0-ra a Caddynek
RUN apt-get update && apt-get install -y --no-install-recommends socat ca-certificates \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# A @shopify/cli + @shopify/mini-oxygen devDeps, DE a `preview` futtatáshoz kellenek,
# ezért a teljes függőségi fát telepítjük (nincs --omit=dev).
# Hálózati megerősítés (registry hibák ellen), audit/fund kikapcsolva a gyorsabb, stabilabb telepítésért.
ENV npm_config_fetch_retries=5 \
    npm_config_fetch_retry_maxtimeout=120000 \
    npm_config_fetch_timeout=600000
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

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
