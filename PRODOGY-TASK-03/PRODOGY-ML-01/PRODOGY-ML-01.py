# Importing libraries
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error, r2_score

# Sample data (replace with your dataset)
data = {
    'SquareFootage': [1500, 1800, 2200, 1600, 1900],
    'Bedrooms': [3, 4, 3, 2, 4],
    'Bathrooms': [2, 3, 2, 2, 3],
    'Price': [300000, 400000, 350000, 280000, 410000]
}

df = pd.DataFrame(data)

# Splitting data into features and target
X = df[['SquareFootage', 'Bedrooms', 'Bathrooms']]
y = df['Price']

# Splitting data into training and test sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Creating linear regression model
model = LinearRegression()

# Training the model
model.fit(X_train, y_train)

# Making predictions
y_pred = model.predict(X_test)

# Evaluating the model
mse = mean_squared_error(y_test, y_pred)
r2 = r2_score(y_test, y_pred)

print(f'Mean Squared Error: {mse}')
print(f'R-squared: {r2}')

# Example prediction
example_prediction = model.predict([[2000, 3, 2]])
print(f'Predicted price for a house with 2000 sqft, 3 bedrooms, and 2 bathrooms: ${example_prediction[0]}')
