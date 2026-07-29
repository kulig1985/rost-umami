#!/bin/sh
set -eu

# mini-oxygen (workerd) a belső 127.0.0.1:3001-en fut,
# a socat kiteszi 0.0.0.0:3000-ra, hogy a Caddy konténer elérje (app:3000).
# Megjegyzés: ha a `shopify hydrogen preview` tud közvetlenül 0.0.0.0-ra kötni
# (ellenőrizd: `npx shopify hydrogen preview --help`), a socat elhagyható és
# a preview futhat a 3000-en közvetlenül.
socat TCP-LISTEN:3000,fork,reuseaddr TCP:127.0.0.1:3001 &

exec npx shopify hydrogen preview --port 3001
