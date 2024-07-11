from flask import Flask, request, jsonify
import pandas as pd
from sklearn.decomposition import TruncatedSVD
import pickle

app = Flask(__name__)

# Load data
users_data = pd.read_csv('data/users.csv')
ratings_data = pd.read_csv('data/ratings.csv')

# Pivot table for collaborative filtering
ratings_matrix = ratings_data.pivot(index='user_id', columns='product_id', values='rating').fillna(0)

# Initialize SVD
svd = TruncatedSVD(n_components=10, random_state=42)  # Adjust n_components based on dataset size

# Fit SVD on ratings matrix
svd.fit(ratings_matrix)

# Save the model
with open('models/recommendation_model.pkl', 'wb') as f:
    pickle.dump(svd, f)

@app.route('/recommend', methods=['POST'])
def recommend():
    if request.method == 'POST':
        data = request.get_json()

        if 'user_id' not in data:
            return jsonify({'error': 'User ID is required'})

        user_id = data['user_id']

        # Load the model
        with open('models/recommendation_model.pkl', 'rb') as f:
            svd = pickle.load(f)

        # Predict recommendations for the user
        user_ratings = ratings_matrix.loc[user_id].values.reshape(1, -1)
        user_recommendations = svd.inverse_transform(svd.transform(user_ratings))

        # Get top recommendations
        recommendations = pd.Series(user_recommendations.flatten(), index=ratings_matrix.columns).sort_values(ascending=False)[:5]

        # Format recommendations
        recommended_products = recommendations.index.tolist()

        return jsonify({'user_id': user_id, 'recommended_products': recommended_products})

if __name__ == '__main__':
    app.run(debug=True)
