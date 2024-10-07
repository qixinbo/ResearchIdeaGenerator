cd "$(dirname "$0")"

if [ "$1" = "prod" ]; then
  echo "Starting Vite server in production mode..."
  nohup npm run build &
  export backend_service_pid=$!
  echo "Started Idea Generator backend service with PID: $backend_service_pid"
elif [ "$1" = "dev" ]; then
  echo "Starting Vite server in development mode..."
  nohup npm run dev &
  export backend_service_pid=$!
  echo "Started Idea Generator backend service with PID: $backend_service_pid"
else
  echo "Invalid parameter. Use 'prod' or 'dev'."
  exit 1
fi