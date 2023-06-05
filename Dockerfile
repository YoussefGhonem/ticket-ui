# Client App
FROM node:16-alpine as node-build
WORKDIR /usr/src/app

COPY ./dist ./dist

# Final image
FROM nginx:1.17.1-alpine
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=node-build /usr/src/app/dist /usr/share/nginx/html
CMD ["/bin/sh",  "-c",  "envsubst < /usr/share/nginx/html/assets/settings.template.json > /usr/share/nginx/html/assets/settings.json && exec nginx -g 'daemon off;'"]
