cd "$(dirname "$0")"
nohup python ui.py &
export frontend_service_pid=$!
echo "Started Idea Generator frontend service with PID: $frontend_service_pid"