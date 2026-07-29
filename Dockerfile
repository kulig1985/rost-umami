FROM node:22-bookworm-slim

# socat: a mini-oxygen (workerd) localhost-ra köt; a socat teszi ki 0.0.0.0-ra a Caddynek
# libatomic1: a workerd (mini-oxygen futtatómotor) igényli, a slim image-ből hiányzik.
RUN apt-get update && apt-get install -y --no-install-recommends socat ca-certificates libatomic1 \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Az npm 10.9.x-nek ismert "Exit handler never called!" hibája van nagy telepítésnél
# és kevés RAM-nál → frissítjük egy stabil újabb verzióra.
RUN npm install -g npm@11

# A @shopify/cli + @shopify/mini-oxygen devDeps, DE a `preview` futtatáshoz kellenek,
# ezért a teljes függőségi fát telepítjük (nincs --omit=dev).
# Hálózati megerősítés + kisebb párhuzamosság (alacsonyabb memória-csúcs kis VPS-en).
ENV npm_config_fetch_retries=5 \
    npm_config_fetch_retry_maxtimeout=120000 \
    npm_config_fetch_timeout=600000
# A .npmrc a PUBLIKUS registryt írja elő (a fejlesztői gép belső Nexusa helyett).
COPY package.json package-lock.json .npmrc ./
RUN npm ci --no-audit --no-fund --maxsockets 3

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
