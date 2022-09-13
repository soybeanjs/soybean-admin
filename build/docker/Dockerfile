FROM node:16.17.0 as builder

ENV WORKDIR=/soybean

WORKDIR $WORKDIR

COPY ./ $WORKDIR/

ARG version
ENV COMMITID=$version

RUN npm i -g pnpm

RUN pnpm install
RUN pnpm build

FROM nginx:alpine as prod

RUN mkdir /soybean

COPY --from=builder /soybean/dist /soybean
COPY --from=builder /soybean/build/docker/nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
