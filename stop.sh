#!/bin/bash

kill_process_by_pid() {
    local pid="$1"
    local description="$2"

    if [ -z "$pid" ]; then
        echo "Could not find the process to stop."
    else
        if [ -n "$description" ]; then
            echo "Killing process ($description) with PID: $pid"
        else
            echo "Killing process with PID: $pid"
        fi

        kill "$pid"
        if [ $? -eq 0 ]; then
            if [ -n "$description" ]; then
                echo "Process ($description) killed successfully."
            else
                echo "Process killed successfully."
            fi
        else
            if [ -n "$description" ]; then
                echo "Failed to kill the process ($description)."
            else
                echo "Failed to kill the process."
            fi
        fi
    fi
}

# 设置变量backend_pid
# 如果已经定义了backend_service_pid，则使用backend_service_pid的值
# 否则通过pgrep命令查找uvicorn main进程的PID，并取第一个PID作为backend_pid的值
backend_pid=${backend_service_pid:-$(pgrep -f 'uvicorn main' | xargs -n1 | head -n1)}
kill_process_by_pid "$backend_pid" "IdeaGenerator Backend Service"

frontend_pid=${frontend_service_pid:-$(pgrep -f 'python ui.py' | xargs -n1 | head -n1)}
kill_process_by_pid "$frontend_pid" "IdeaGenerator Frontend Service"