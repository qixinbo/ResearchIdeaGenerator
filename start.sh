#!/usr/bin/env bash

# use path of this example as working directory; enables starting this script from anywhere

#current_dir=$(dirname "$0")
current_dir=$(dirname "$(readlink -f "$0")")
echo ${current_dir}
export PYTHONPATH="${current_dir}":${PYTHONPATH}

bash IdeaGenerator/backend/start_backend.sh "$1"
