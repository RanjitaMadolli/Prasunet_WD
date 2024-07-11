import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns

# Load the Titanic dataset
url = "https://raw.githubusercontent.com/datasciencedojo/datasets/master/titanic.csv"
titanic_data = pd.read_csv(url)

# Display the first few rows of the dataset
print(titanic_data.head())

# Data Cleaning
# Check for missing values
print(titanic_data.isnull().sum())

# Fill missing values
titanic_data['Age'].fillna(titanic_data['Age'].median(), inplace=True)
titanic_data['Embarked'].fillna(titanic_data['Embarked'].mode()[0], inplace=True)
titanic_data['Cabin'].fillna('Unknown', inplace=True)

# Convert data types if necessary (e.g., Pclass to categorical)
titanic_data['Pclass'] = titanic_data['Pclass'].astype('category')

# Create new features
# Extract title from Name
titanic_data['Title'] = titanic_data['Name'].apply(lambda x: x.split(',')[1].split('.')[0].strip())

# Create FamilySize feature
titanic_data['FamilySize'] = titanic_data['SibSp'] + titanic_data['Parch'] + 1

# Exploratory Data Analysis (EDA)
# Summary statistics for numerical features
print(titanic_data.describe())

# Distribution Analysis
# Distribution of Age
plt.figure(figsize=(10, 6))
sns.histplot(titanic_data['Age'], kde=True, bins=30)
plt.title('Age Distribution')
plt.show()

# Distribution of Fare
plt.figure(figsize=(10, 6))
sns.histplot(titanic_data['Fare'], kde=True, bins=30)
plt.title('Fare Distribution')
plt.show()

# Categorical Analysis
# Count plot for Pclass
plt.figure(figsize=(10, 6))
sns.countplot(x='Pclass', data=titanic_data)
plt.title('Passenger Class Distribution')
plt.show()

# Count plot for Embarked
plt.figure(figsize=(10, 6))
sns.countplot(x='Embarked', data=titanic_data)
plt.title('Port of Embarkation Distribution')
plt.show()

# Correlation Analysis
# Select only numeric columns for the correlation heatmap
numeric_cols = titanic_data.select_dtypes(include=['float64', 'int64']).columns

# Correlation heatmap
plt.figure(figsize=(12, 8))
sns.heatmap(titanic_data[numeric_cols].corr(), annot=True, cmap='coolwarm')
plt.title('Correlation Heatmap')
plt.show()

# Survival Analysis
# Survival rate by Pclass
plt.figure(figsize=(10, 6))
sns.barplot(x='Pclass', y='Survived', data=titanic_data)
plt.title('Survival Rate by Passenger Class')
plt.show()

# Survival rate by Sex
plt.figure(figsize=(10, 6))
sns.barplot(x='Sex', y='Survived', data=titanic_data)
plt.title('Survival Rate by Sex')
plt.show()

# Survival rate by Age
plt.figure(figsize=(10, 6))
sns.histplot(titanic_data[titanic_data['Survived'] == 1]['Age'], kde=True, bins=30, color='blue', label='Survived')
sns.histplot(titanic_data[titanic_data['Survived'] == 0]['Age'], kde=True, bins=30, color='red', label='Not Survived')
plt.legend()
plt.title('Survival Rate by Age')
plt.show()
