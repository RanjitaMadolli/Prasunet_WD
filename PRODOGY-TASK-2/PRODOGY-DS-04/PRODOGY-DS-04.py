import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from nltk.sentiment.vader import SentimentIntensityAnalyzer
import nltk

# Download the VADER lexicon
nltk.download('vader_lexicon')

# Load sample social media data
# For demonstration purposes, we'll create a sample dataset
data = {
    'text': [
        "I love this product! It's absolutely amazing.",
        "This is the worst service I have ever experienced.",
        "I'm so happy with the new update!",
        "I hate the new design. It's so confusing.",
        "The customer support was very helpful and friendly.",
        "I'm never buying from this brand again.",
        "Best purchase I've made this year!",
        "The quality of this item is terrible.",
        "Great experience, will definitely recommend to others.",
        "The delivery was late and the item was damaged."
    ]
}

df = pd.DataFrame(data)

# Display the first few rows of the dataset
print(df.head())

# Initialize the VADER sentiment analyzer
sid = SentimentIntensityAnalyzer()

# Define a function to get the sentiment scores
def get_sentiment(text):
    scores = sid.polarity_scores(text)
    return scores

# Apply the function to the dataset
df['sentiment'] = df['text'].apply(get_sentiment)

# Convert the sentiment scores to separate columns
df = pd.concat([df.drop(['sentiment'], axis=1), df['sentiment'].apply(pd.Series)], axis=1)

# Display the updated dataset with sentiment scores
print(df.head())

# Visualization

# Sentiment distribution
plt.figure(figsize=(10, 6))
sns.histplot(df['compound'], kde=True)
plt.title('Sentiment Score Distribution')
plt.xlabel('Sentiment Score')
plt.ylabel('Frequency')
plt.show()

# Sentiment by category (positive, neutral, negative)
df['sentiment_category'] = df['compound'].apply(lambda x: 'positive' if x > 0 else ('negative' if x < 0 else 'neutral'))

plt.figure(figsize=(10, 6))
sns.countplot(x='sentiment_category', data=df, hue='sentiment_category', palette='viridis', legend=False)
plt.title('Sentiment Category Distribution')
plt.xlabel('Sentiment Category')
plt.ylabel('Count')
plt.show()

# Sentiment over time (for time-series data)
# For demonstration purposes, let's assume we have a timestamp column
df['timestamp'] = pd.date_range(start='2023-01-01', periods=len(df), freq='D')

plt.figure(figsize=(14, 7))
sns.lineplot(x='timestamp', y='compound', data=df)
plt.title('Sentiment Over Time')
plt.xlabel('Date')
plt.ylabel('Sentiment Score')
plt.show()
