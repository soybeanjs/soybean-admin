# 安装Node.js
FROM node:20-alpine3.17 as build

WORKDIR /app
COPY . /app

RUN npm install -g pnpm \
    && pnpm install \
    && pnpm run build

FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html/
# COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY ./docker/nginx.conf /etc/nginx/conf.d/
EXPOSE 80
CMD ["nginx","-g","daemon off;"]

