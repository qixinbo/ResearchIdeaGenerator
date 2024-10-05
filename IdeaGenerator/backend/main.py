#!/usr/bin/env python3
from fastapi import FastAPI
from IdeaGenerator.frontend import ui

app = FastAPI()

ui.init(app)

if __name__ == "__main__":
    print(
        'Please start the app with the "uvicorn" command as shown in the start.sh script'
    )
