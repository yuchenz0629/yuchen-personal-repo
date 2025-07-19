import unittest
from utils import *

class TestTop5Function(unittest.TestCase):

    def test_similarity(self):
        vec1 = np.array([1.0, 0.0, 0.0])
        vec2 = np.array([0.5, 0.5, 0.0])
        score = similarity(vec1, vec2)
        self.assertTrue(isinstance(score, float))
        self.assertEqual(round(score, 4), 0.7071)

    def test_top5_nonexistent_user(self):
        fake_user = "dummy user id"
        result = top5(fake_user)
        
        # To make sure the response meets the format standard
        self.assertIn("results", result, "Response should have a 'results' key.")
        self.assertEqual(len(result["results"]), 0, "Results should be empty for nonexistent user.")
        self.assertIn("error", result, "Response should have an 'error' key for nonexistent user.")
        self.assertIn(fake_user, result["error"], "Error message should mention the fake user ID.")

    def test_top5_valid_user(self):
        valid_user = "user_001"
        result = top5(valid_user)

        self.assertIn("results", result, "Response should have a 'results' key.")
        self.assertTrue(len(result["results"]) <= 5, "Should only return up to 5 results.")

        for item in result["results"]:
            self.assertIn("user_id", item, "Each result item should have 'user_id'.")
            self.assertIn("score", item, "Each result item should have 'score'.")
            self.assertIsInstance(item["score"], float, "'score' should be a float.")

if __name__ == "__main__":
    unittest.main()