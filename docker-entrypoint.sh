#!/usr/bin/env sh
set -eu

: "${PORT:=8080}"

if [ -z "${APP_KEY:-}" ]; then
    echo "APP_KEY is required." >&2
    exit 1
fi

php artisan migrate --force --no-interaction
php artisan optimize --no-interaction

sed -ri "s!Listen 80!Listen ${PORT}!" /etc/apache2/ports.conf
sed -ri "s!<VirtualHost \*:80>!<VirtualHost *:${PORT}>!" /etc/apache2/sites-available/000-default.conf

exec apache2-foreground
