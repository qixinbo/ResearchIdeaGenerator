#!/usr/bin/env python3
from dotenv import load_dotenv
import os
from fastapi import FastAPI, HTTPException, File, UploadFile, Form
import requests
import json
from pydantic import BaseModel, Field
from typing import List, Optional

load_dotenv()

dify_dataset_api_key = os.getenv("DIFY_DATASET_API_KEY")
dify_api_url = "https://api.dify.ai/v1"
dify_dataset_api_url = dify_api_url + "/datasets"

app = FastAPI()

# 创建空知识库
@app.post("/create_dataset/")
async def create_dataset(name: str, permission: str = "only_me"):
    headers = {
        "Authorization": f"Bearer {dify_dataset_api_key}",
        "Content-Type": "application/json"
    }
    data = {
        "name": name,
        "permission": permission
    }
    response = requests.post(dify_dataset_api_url, headers=headers, json=data)
    if response.status_code!= 200:
        raise HTTPException(status_code=response.status_code, detail=response.text)
    return response.json()

# 获取知识库列表
@app.get("/datasets/")
# limit：返回条数，默认 20，范围 1-100
async def get_datasets(page: int = 1, limit: int = 20):
    url = f'{dify_dataset_api_url}?page={page}&limit={limit}'
    headers = {'Authorization': f'Bearer {dify_dataset_api_key}'}
    response = requests.get(url, headers=headers)
    return response.json()

# 删除知识库
@app.delete("/delete_dataset/{dataset_id}")
async def delete_dataset(dataset_id: str):
    url = f'{dify_dataset_api_url}/{dataset_id}'
    headers = {'Authorization': f'Bearer {dify_dataset_api_key}'}
    response = requests.delete(url, headers=headers)
    if response.status_code == 204:
        return {"message": "Dataset deleted successfully"}
    else:
        raise HTTPException(status_code=response.status_code, detail=response.text)    

# 通过上传文件来创建文档
@app.post("/datasets/{dataset_id}/document/create_by_file")
async def create_document_by_file(
    dataset_id: str,
    file: UploadFile = File(...),
    indexing_technique: str = Form("economy"), # 索引技术，可选值：economy, high_quality
    pre_processing_rule_remove_extra_spaces_enabled: bool = Form(True),
    pre_processing_rule_remove_urls_emails_enabled: bool = Form(True),
    segmentation_separator: str = Form("\n"),
    max_tokens: int = Form(1000),
    mode: str = Form("custom")
):
    # Bug 修复：将单引号替换为双引号
    data = {
        "indexing_technique": indexing_technique,
        "process_rule": {
            "rules": {
                "pre_processing_rules": [
                    {"id": "remove_extra_spaces", "enabled": pre_processing_rule_remove_extra_spaces_enabled},
                    {"id": "remove_urls_emails", "enabled": pre_processing_rule_remove_urls_emails_enabled}
                ],
                "segmentation": {
                    "separator": segmentation_separator,
                    "max_tokens": max_tokens
                }
            },
            "mode": mode
        }
    }
    url = f'{dify_dataset_api_url}/{dataset_id}/document/create_by_file'
    headers = {'Authorization': f'Bearer {dify_dataset_api_key}'}
    form_data = {'data': json.dumps(data)}
    files = {'file': (file.filename, file.file)}
    response = requests.post(url, headers=headers, data=form_data, files=files)
    if response.status_code == 200:
        return response.json()
    else:
        raise HTTPException(status_code=response.status_code, detail=response.text)

# 获取知识库中的文档列表
@app.get("/datasets/{dataset_id}/documents")
async def get_dataset_documents(dataset_id: str):
    url = f'{dify_dataset_api_url}/{dataset_id}/documents'
    headers = {'Authorization': f'Bearer {dify_dataset_api_key}'}
    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        return response.json()
    else:
        raise HTTPException(status_code=response.status_code, detail=response.text)

# 
@app.delete("/delele_document/{dataset_id}/documents/{document_id}")
async def delete_document(dataset_id: str, document_id: str):
    url = f'{dify_dataset_api_url}/{dataset_id}/documents/{document_id}'
    headers = {'Authorization': f'Bearer {dify_dataset_api_key}'}
    response = requests.delete(url, headers=headers)
    if response.status_code == 204:
        return {"message": "Document deleted successfully"}
    else:
        raise HTTPException(status_code=response.status_code, detail=response.text)


if __name__ == "__main__":
    print(
        'Please start the app with the "uvicorn" command as shown in the start.sh script'
    )
