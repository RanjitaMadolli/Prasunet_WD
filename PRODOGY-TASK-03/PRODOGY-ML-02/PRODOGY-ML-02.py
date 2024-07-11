# Importing libraries
import numpy as np
import pandas as pd
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
import matplotlib.pyplot as plt

# Sample data (replace with your dataset)
data = {
    'CustomerID': [1, 2, 3, 4, 5],
    'PurchaseCount': [10, 15, 8, 20, 18],
    'PurchaseAmount': [1000, 1500, 800, 2000, 1800]
}

df = pd.DataFrame(data)

# Selecting features for clustering
X = df[['PurchaseCount', 'PurchaseAmount']]

# Standardizing the data (necessary for K-means)
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# Choosing the number of clusters (K)
k = 3

# Creating K-means model
model = KMeans(n_clusters=k, random_state=42)

# Fitting the model
model.fit(X_scaled)

# Getting cluster labels
labels = model.labels_

# Adding cluster labels to the original dataframe
df['Cluster'] = labels

# Visualizing the clusters (for 2D data)
plt.figure(figsize=(8, 6))
plt.scatter(X['PurchaseCount'], X['PurchaseAmount'], c=labels, cmap='viridis', s=100, alpha=0.8, edgecolors='k')
plt.xlabel('Purchase Count')
plt.ylabel('Purchase Amount')
plt.title('K-means Clustering of Customers')
plt.colorbar(label='Cluster')
plt.grid(True)
plt.show()

# Displaying the dataframe with cluster assignments
print(df)
