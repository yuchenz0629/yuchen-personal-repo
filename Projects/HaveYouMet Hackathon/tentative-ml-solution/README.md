Welcome to my project. This is a document that walks you through the steps of running it.

Step 1: Install the dependencies
Change the directory to the project folder and run the following command to install the dependencies:
pip install -r requirements.txt

Step 2: Set up Modal
Run the following command:
python3 -m modal setup
Make sure you have a Modal account so that it would give an authentication token.

Code explanation:
- First we have a load_data function which reads the data from the sheet
- Then we use fuse_embeddings to project the three vectors onto the same dimension, with different weights, because in a real world setting, the level of importance: image > text > audio.

To execute the scipt, run:
modal serve modal_app.py

In tests.py, I tested cosine similarity function and the top5 for existing and non-existent user id. To execute the tests, run:
python tests.py


**POTENTIAL IMPROVEMENT**
The biggest potential improvement here is to use a trained model to get the embeddings. For demonstration purposes I used random projection matrix, but in a real world setting, you would probably use a trained model to get the embeddings.