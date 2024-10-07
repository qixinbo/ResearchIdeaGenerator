#!/usr/bin/env bash

# use path of this example as working directory; enables starting this script from anywhere

#current_dir=$(dirname "$0")
current_dir=$(dirname "$(readlink -f "$0")")
echo ${current_dir}

export APP_MODE="$1"
echo ${APP_MODE}

export PYTHONPATH="${current_dir}":${PYTHONPATH}

echo "---------- Start backend ----------"
#bash IdeaGenerator/backend/start_backend.sh "$1" &

echo "---------- Start frontend ----------"
bash IdeaGenerator/frontend/start_frontend.sh "$1" &
