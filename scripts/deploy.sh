#!/bin/bash
set -e

export RANCHER_ENV=$1
export RANCHER_STACK=$2
export RANCHER_SERVICE=$3
export RANCHER_START_FIRST=true

docker login -u="$DOCKER_USERNAME" -p="$DOCKER_PASSWORD"
docker push $DOCKER_IMAGE

#Atualiza a infra
echo "Deploy no Rancher da imagem $DOCKER_IMAGE, env $RANCHER_ENV, stack $RANCHER_STACK, service $RANCHER_SERVICE."
if [ ! -d "api-cloud-v2" ] ; then
    git clone https://github.com/prodest/api-cloud-v2.git
fi
cd api-cloud-v2
npm install
node ./client --ENVIRONMENT=$RANCHER_ENV \
    --STACK=$RANCHER_STACK --SERVICE=$RANCHER_SERVICE \
    --IMAGE=$DOCKER_IMAGE --START_FIRST=$RANCHER_START_FIRST
