#!/bin/bash

echo "УСТАНОВКА ЗАВИСИМОСТЕЙ"
npm ci --prefix $DIR_TESTS > /dev/null
npx playwright install --with-deps > /dev/null

echo "ЗАГРУЖАЕМ ИЗОБРАЖЕНИЯ ДЛЯ ТЕСТОВ"
curl -o $DIR_TESTS/data/bimage.png https://getsamplefiles.com/download/png/sample-1.png
curl -o $DIR_TESTS/data/mimage.png https://getsamplefiles.com/download/png/sample-2.png

echo "ЗАПИСЬ ЛОГОВ"
mkdir -p output
docker logs -f $REPO-backend-1 > output/backend.log &

echo "ЗАПУСК ТЕСТОВ"
cd $DIR_TESTS || exit
node ./prepare.js
sh ./bin/set_role.sh
npm run test