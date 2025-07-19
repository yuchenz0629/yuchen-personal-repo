import modal
import utils

image = modal.Image.debian_slim().pip_install(
    "fastapi[standard]", 
    "pandas", 
    "numpy"
)

local_data = modal.Mount.from_local_dir("data", remote_path="/root/data")
app = modal.App(
    name="multimodal-user-similarity",
    image=image,
    mounts=[local_data]  
)

@app.function()
@modal.web_endpoint(method="POST")
def top5_endpoint(user_id: str):
    return utils.top5(user_id)