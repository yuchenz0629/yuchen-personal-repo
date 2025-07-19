**Welcome to my project. This is a document that walks you through the steps of running it.**

**Step 1: Install the dependencies**
Change the directory to the project folder and run the following command to install the dependencies:
pip install -r requirements.txt

**Step 2: Set up Modal**
Run the following command:
python3 -m modal setup
Make sure you have a Modal account so that it would give an authentication token.

**Code explanation**
- First we have a load_data function which reads the data from the sheet
- We convert the loaded data to a PyTorch dataset. 
- After projecting the vectors to a common dimension, we then pass them through a small classifier network (a couple of linear layers with ReLU activations). The concatenated vector then passes through a small classifier network. The reason I call this semi-complete is because since don't have labels, we need some kind of supervision, but I do not have the opportunity to think of a way at the moment. After which, we can use the embed function to get the embeddings to be calculated similarity.

**Justification**
The way I desgined the fused representation is to cluster similar users closer together, boosting the usefulness of nearest-neighbor searches. Over time or with more data, with the inclusion of means of supervision, it can learn more refined ways of merging modalities—potentially leading to better downstream similarity comparisons.

**Putting them together**
To execute the scipt, run:
modal serve modal_app.py

In tests.py, I tested cosine similarity function and the top5 for existing and non-existent user id. To execute the tests, run:
python tests.py

