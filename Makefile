ImageTag ?=v0.9.6
SoybeanAdminImg ?= soybeanjs/soybean-admin:$(ImageTag)

VERSION=$(shell git rev-parse --short HEAD)

soybean-admin: soybean-admin-build soybean-admin-push

soybean-admin-build:
	docker build --build-arg version=$(VERSION) -t ${SoybeanAdminImg} -f docker/Dockerfile .

soybean-admin-push:
	docker push ${SoybeanAdminImg}

# run tauri app:
run:
	pnpm tauri dev
