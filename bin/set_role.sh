#!/bin/bash

docker exec -i $REPO-mongo-1 sh -c "mongosh weblarek --authenticationDatabase admin -u root -p example --eval 'db.users.updateOne({email: \"admin@mail.ru\"}, {\$set: {roles: [\"admin\"]}})'"