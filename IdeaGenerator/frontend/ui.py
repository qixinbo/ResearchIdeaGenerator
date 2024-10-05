from nicegui import ui
import os

def handle_upload(e):
    for file in e.files:
        upload_dir = "uploads"
        if not os.path.exists(upload_dir):
            os.makedirs(upload_dir)
        file_path = os.path.join(upload_dir, file.name)
        with open(file_path, "wb") as f:
            f.write(file.content)
        ui.notify(f'文件 {file.name} 上传成功！')

@ui.page('/')
def main():
    ui.label('多文件上传示例').classes('text-h3')
    ui.upload(on_upload=handle_upload, multiple=True, label='选择文件').classes('max-w-full')

ui.run(port=8888)