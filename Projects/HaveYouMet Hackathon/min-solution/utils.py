import pandas as pd
import numpy as np
import torch
from torch.utils.data import Dataset
import torch.nn as nn
import torch.optim as optim
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

class UserDataset(Dataset):
    def __init__(self, users_dict):
        self.user_ids = list(users_dict.keys())
        self.text_data = []
        self.image_data = []
        self.audio_data = []
        # The label here could be either top5 or not
        self.labels = []
        
        for uid in self.user_ids:
            embs = users_dict[uid]
            self.text_data.append(embs["text"])
            self.image_data.append(embs["image"])
            self.audio_data.append(embs["audio"])
            self.labels.append(embs["label"])
        
        # Convert to torch tensors
        self.text_data = torch.tensor(self.text_data, dtype=torch.float32)
        self.image_data = torch.tensor(self.image_data, dtype=torch.float32)
        self.audio_data = torch.tensor(self.audio_data, dtype=torch.float32)
        self.labels = torch.tensor(self.labels, dtype=torch.long)
    
    def __len__(self):
        return len(self.user_ids)
    
    def __getitem__(self, idx):
        return (self.text_data[idx], 
                self.image_data[idx],
                self.audio_data[idx],
                self.labels[idx])
    

class FusionModel(nn.Module):
    def __init__(self, 
                 text_dim=128, 
                 image_dim=256, 
                 audio_dim=512, 
                 fused_dim=256, 
                 num_classes=2):
        super().__init__()
        
        # Implement Learnable projections for each modality
        self.text_proj = nn.Linear(text_dim, fused_dim)
        self.image_proj = nn.Linear(image_dim, fused_dim)
        self.audio_proj = nn.Linear(audio_dim, fused_dim)
        
        self.classifier = nn.Sequential(
            nn.Linear(fused_dim * 3, fused_dim),
            nn.ReLU(),
            nn.Linear(fused_dim, num_classes)
        )
    
    def forward(self, text_emb, image_emb, audio_emb):
        t = self.text_proj(text_emb)
        i = self.image_proj(image_emb)
        a = self.audio_proj(audio_emb)
        
        fused = torch.cat([t, i, a], dim=1)
        out = self.classifier(fused)
        return out
    
    def embed(self, text_emb, image_emb, audio_emb):
        t = self.text_proj(text_emb)
        i = self.image_proj(image_emb)
        a = self.audio_proj(audio_emb)
        
        fused = torch.cat([t, i, a], dim=1)
        fused = self.classifier[0:2](fused)
        return fused
    
def train_fusion_model(users_dict, num_classes=2, epochs=5, batch_size=8, lr=1e-3):
    dataset = UserDataset(users_dict)
    dataloader = torch.utils.data.DataLoader(dataset, batch_size=batch_size, shuffle=True)
    
    # Initialize model
    model = FusionModel(
        text_dim=128, image_dim=256, audio_dim=512, 
        fused_dim=128, 
        num_classes=num_classes
    )
    
    criterion = nn.CrossEntropyLoss()
    optimizer = optim.Adam(model.parameters(), lr=lr)
    
    model.train()
    for epoch in range(epochs):
        total_loss = 0.0
        for text_emb, image_emb, audio_emb, labels in dataloader:
            optimizer.zero_grad()
            outputs = model(text_emb, image_emb, audio_emb)
            loss = criterion(outputs, labels)
            loss.backward()
            optimizer.step()
            
            total_loss += loss.item()
        
        avg_loss = total_loss / len(dataloader)
        print(f"Epoch [{epoch+1}/{epochs}], Loss: {avg_loss:.4f}")
    
    return model

def fuse_embeddings_with_model(users_dict, trained_model):
    fused_dict = {}
    
    trained_model.eval()
    with torch.no_grad():
        for user_id, embs in users_dict.items():
            text_emb = torch.tensor(embs["text"], dtype=torch.float32).unsqueeze(0)
            image_emb = torch.tensor(embs["image"], dtype=torch.float32).unsqueeze(0)
            audio_emb = torch.tensor(embs["audio"], dtype=torch.float32).unsqueeze(0)
            
            fused_vec = trained_model.embed(text_emb, image_emb, audio_emb)
            fused_dict[user_id] = fused_vec.squeeze(0).numpy()  # shape (some_dim,)
    
    return fused_dict

def similarity(user1_vec, user2_vec):
    dot_product = np.dot(user1_vec, user2_vec)
    norm1 = np.linalg.norm(user1_vec)
    norm2 = np.linalg.norm(user2_vec)
    if norm1 == 0 or norm2 == 0:
        return 0.0
    return float(dot_product / (norm1 * norm2))

def top5(userId):
    users_data = load_data()
    model = train_fusion_model(users_data)
    users = fuse_embeddings_with_model(users_data, model)

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