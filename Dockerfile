FROM nginx:alpine

# Static site served by nginx
COPY index.html /usr/share/nginx/html/index.html
COPY src /usr/share/nginx/html/src
COPY res /usr/share/nginx/html/res

EXPOSE 80
