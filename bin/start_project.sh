#!/bin/bash

echo "ЗАПУСК ПРОЕКТА"
cp $GITHUB_WORKSPACE/backend/.env.example $GITHUB_WORKSPACE/backend/.env
sed -i~ '/^DB_ADDRESS=/s/=.*/=mongodb:\/\/root:example@mongo:27017\/weblarek?authSource=admin/' $GITHUB_WORKSPACE/backend/.env
cp $GITHUB_WORKSPACE/frontend/.env.example $GITHUB_WORKSPACE/frontend/.env
sed -i~ '/^VITE_API_ORIGIN=/s/=.*/=http:\/\/localhost\/api/' $GITHUB_WORKSPACE/frontend/.env
cd $GITHUB_WORKSPACE
docker compose up -d

docker exec -i $REPO-mongo-1 sh -c "mongoimport --authenticationDatabase admin -u root -p example --drop -c users --jsonArray --uri=mongodb://mongo:27017/weblarek?authSource=admin" < $DIR_TESTS/.dump/weblarek.users.json
docker exec -i $REPO-mongo-1 sh -c "mongoimport --authenticationDatabase admin -u root -p example --drop -c products --jsonArray --uri=mongodb://mongo:27017/weblarek?authSource=admin" < $DIR_TESTS/.dump/weblarek.products.json