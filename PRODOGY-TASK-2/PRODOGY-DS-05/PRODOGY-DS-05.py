import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import folium
from folium.plugins import HeatMap

# Generate synthetic traffic accident data
np.random.seed(42)
num_samples = 1000

data = {
    'Date': pd.date_range(start='2023-01-01', periods=num_samples, freq='H'),
    'Road_Surface_Conditions': np.random.choice(['Dry', 'Wet', 'Snow', 'Ice'], num_samples),
    'Weather_Conditions': np.random.choice(['Clear', 'Rain', 'Fog', 'Snow', 'Wind'], num_samples),
    'Time': pd.to_datetime(np.random.randint(0, 24, num_samples), format='%H').time,
    'Latitude': np.random.uniform(51.3, 51.7, num_samples),
    'Longitude': np.random.uniform(-0.5, 0.3, num_samples)
}

df = pd.DataFrame(data)

# Extract hour from time for analysis
df['Hour'] = df['Time'].apply(lambda x: x.hour)

# Display the first few rows of the dataset
print(df.head())

# Analysis
# 1. Accidents by road conditions
road_conditions = df['Road_Surface_Conditions'].value_counts()
plt.figure(figsize=(10, 6))
sns.barplot(x=road_conditions.index, y=road_conditions.values, palette='viridis')
plt.title('Accidents by Road Conditions')
plt.xlabel('Road Surface Conditions')
plt.ylabel('Number of Accidents')
plt.xticks(rotation=45)
plt.show()

# 2. Accidents by weather conditions
weather_conditions = df['Weather_Conditions'].value_counts()
plt.figure(figsize=(10, 6))
sns.barplot(x=weather_conditions.index, y=weather_conditions.values, palette='viridis')
plt.title('Accidents by Weather Conditions')
plt.xlabel('Weather Conditions')
plt.ylabel('Number of Accidents')
plt.xticks(rotation=45)
plt.show()

# 3. Accidents by time of day
hourly_accidents = df['Hour'].value_counts().sort_index()
plt.figure(figsize=(10, 6))
sns.lineplot(x=hourly_accidents.index, y=hourly_accidents.values, marker='o')
plt.title('Accidents by Time of Day')
plt.xlabel('Hour of Day')
plt.ylabel('Number of Accidents')
plt.xticks(range(0, 24))
plt.grid(True)
plt.show()

# 4. Visualize accident hotspots
# Create a base map
m = folium.Map(location=[51.5074, -0.1278], zoom_start=10)  # Coordinates for London

# Add accident locations to the map
for idx, row in df.iterrows():
    folium.CircleMarker([row['Latitude'], row['Longitude']],
                        radius=3,
                        color='red',
                        fill=True).add_to(m)

# Save and display the map
m.save('accident_hotspots.html')

# Create a heatmap
heat_data = [[row['Latitude'], row['Longitude']] for index, row in df.iterrows()]
HeatMap(heat_data).add_to(m)

# Save and display the heatmap
m.save('accident_heatmap.html')
