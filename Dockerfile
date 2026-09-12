# syntax=docker/dockerfile:1

FROM composer:2 AS vendor
WORKDIR /app
COPY composer.json composer.lock ./
RUN composer install \
    --no-dev \
    --no-interaction \
    --no-progress \
    --prefer-dist \
    --optimize-autoloader \
    --no-scripts
COPY . .
RUN php artisan package:discover --ansi \
    && php artisan wayfinder:generate --with-form \
    && composer dump-autoload --optimize --no-dev --no-interaction

FROM node:22-bookworm-slim AS frontend
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY --from=vendor /app /app
RUN npm run build

FROM php:8.3-apache-bookworm
WORKDIR /var/www/html

RUN apt-get update \
    && apt-get install -y --no-install-recommends libicu-dev libzip-dev \
    && docker-php-ext-install intl pdo_mysql zip \
    && a2enmod rewrite \
    && rm -rf /var/lib/apt/lists/*

COPY --from=vendor /app /var/www/html
COPY --from=frontend /app/public/build /var/www/html/public/build
COPY docker/000-default.conf /etc/apache2/sites-available/000-default.conf
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint

RUN chmod +x /usr/local/bin/docker-entrypoint \
    && chown -R www-data:www-data storage bootstrap/cache

ENV APP_ENV=production \
    APP_DEBUG=false \
    LOG_CHANNEL=stderr

ENTRYPOINT ["docker-entrypoint"]
