ImageTag ?=v0.9.6
SoybeanImg ?= soybean/soybean:$(ImageTag)

VERSION=$(shell git rev-parse --short HEAD)

soybean: soybean-build soybean-push

soybean-build:
	docker build --build-arg version=$(VERSION) -t ${SoybeanImg} -f build/docker/Dockerfile .

soybean-push:
	docker push ${SoybeanImg}
