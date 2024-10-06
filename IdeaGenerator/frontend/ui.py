from nicegui import ui
import httpx
import os

app_mode = os.environ.get('APP_MODE')
if 'dev' == app_mode:
    backend_url = 'http://localhost:8000'
else:
    backend_url = 'http://localhost:8080'

async def handle_upload(e):
    for i in range(len(e.names)):
        ui.notify(f'Uploading {e.names[i]}...')
        
        # Send file to FastAPI backend
        async with httpx.AsyncClient() as client:
            files = {'file': (e.names[i], e.contents[i], e.types[i])}
            response = await client.post(backend_url+'/upload/', files=files)
        
        if response.status_code == 200:
            result = response.json()
            ui.notify(f'Uploaded {result["filename"]} (Size: {result["size"]} bytes)')
        else:
            ui.notify(f'Failed to upload {e.names[i]}', color='negative')

@ui.page('/')
def index():
    ui.upload(on_multi_upload=handle_upload, multiple=True, label='Upload files')

ui.run(port=8888)