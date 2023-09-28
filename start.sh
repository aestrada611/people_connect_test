#!/bin/bash
set -e
npm start &
npm run server &
wait
