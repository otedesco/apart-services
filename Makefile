# app name should be overridden.
# ex) production-stage: make build APP_NAME=<APP_NAME>
# ex) development-stage: make build-dev APP_NAME=<APP_NAME>

APP_NAME := $(APP_NAME)
VERSION := $(VERSION)

.PHONY: build

# Build the container image - Production
build:
	docker build -t ${APP_NAME}:${VERSION} --target prod-server -f services/${APP_NAME}/Dockerfile .

# todo: add publish script 

all: build
