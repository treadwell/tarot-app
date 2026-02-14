FROM nginx:alpine

# Static site served by nginx
COPY index.html /usr/share/nginx/html/index.html
COPY favicon.svg /usr/share/nginx/html/favicon.svg
COPY favicon.ico /usr/share/nginx/html/favicon.ico
COPY src /usr/share/nginx/html/src
COPY res /usr/share/nginx/html/res

EXPOSE 80
