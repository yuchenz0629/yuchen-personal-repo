import pandas as pd
import numpy as np
import os

DATA_PATH = "/root/data"

def load_data():
    file_path = os.path.join(DATA_PATH, "user_embeddings.xls")
    data = pd.read_csv(file_path)

    text_len = 128
    image_len = 256
    audio_len = 512

    users = {}
    for _, row in data.iterrows():
        user_id = str(row['user_id'])

        text_str = row["text_embedding_vector"]
        text_vals = [float(x) for x in text_str[1:-1].split(",")]
        if len(text_vals) != text_len:
            raise ValueError(f"Text embedding for user {user_id} is length {len(text_vals)}, expected {text_len}")
        text_emb = np.array(text_vals, dtype=float)

        image_str = row["image_embedding_vector"]
        image_vals = [float(x) for x in image_str[1:-1].split(",")]
        if len(image_vals) != image_len:
            raise ValueError(f"Image embedding for user {user_id} is length {len(image_vals)}, expected {image_len}")
        image_emb = np.array(image_vals, dtype=float)

        audio_str = row["audio_embedding_vector"]
        audio_vals = [float(x) for x in audio_str[1:-1].split(",")]
        if len(audio_vals) != audio_len:
            raise ValueError(f"Audio embedding for user {user_id} is length {len(audio_vals)}, expected {audio_len}")
        audio_emb = np.array(audio_vals, dtype=float)

        users[user_id] = {
            "text": text_emb,
            "image": image_emb,
            "audio": audio_emb
        }
    return users

def fuse_embeddings(users, 
                    out_dim=256,
                    weight_text=2.0,
                    weight_image=4.0,
                    weight_audio=1.0
                   ):
    text_in_dim = 128
    image_in_dim = 256
    audio_in_dim = 512
    
    # Here I am using random projection matrices, but we could train them if needed
    np.random.seed(123456)
    Wt = np.random.randn(out_dim, text_in_dim)
    Wi = np.random.randn(out_dim, image_in_dim)
    Wa = np.random.randn(out_dim, audio_in_dim)
    
    fused_users = {}
    
    for user_id, embs in users.items():
        text_emb  = embs["text"]
        image_emb = embs["image"]
        audio_emb = embs["audio"]
        
        text_proj  = Wt @ text_emb
        image_proj = Wi @ image_emb
        audio_proj = Wa @ audio_emb
        
        fused = (weight_text * text_proj 
                 + weight_image * image_proj 
                 + weight_audio * audio_proj)
        fused_users[user_id] = fused
    
    return fused_users

def similarity(user1_vec, user2_vec):
    dot_product = np.dot(user1_vec, user2_vec)
    norm1 = np.linalg.norm(user1_vec)
    norm2 = np.linalg.norm(user2_vec)
    if norm1 == 0 or norm2 == 0:
        return 0.0
    return float(dot_product / (norm1 * norm2))

def top5(userId):
    users_data = load_data()
    users = fuse_embeddings(users_data)

    if userId not in users:
        print(f"User ID {userId} does not exist.")
        return {
            "results": [],
            "error": f"User ID {userId} does not exist."
        }

    res = []
    for u_id, user_vec in users.items():
        if u_id == userId:
            continue
        score = similarity(users[userId], user_vec)
        res.append((u_id, score))

    res.sort(key=lambda x: x[1], reverse=True)
    top_res = res[:5]

    results_list = [
        {
            "user_id": u_id,
            "score": round(float(score), 2)  
        }
        for u_id, score in top_res
    ]
    return {"results": results_list}