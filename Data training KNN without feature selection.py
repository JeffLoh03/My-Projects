import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.neighbors import KNeighborsClassifier
from sklearn.metrics import accuracy_score

# read the combine data file
file_path = r"C:\Users\jeffl\OneDrive\Documents\Data Mining Breat Cancer\full_data.csv" 
df = pd.read_csv(file_path)

# Convert Diagnosis ('M' = Malignant, 'B' = Benign) to numerical values
#  M=1 , B=0
df["Diagnosis"] = df["Diagnosis"].map({"M": 1, "B": 0})  

# select feature
X = df.iloc[:, 2:32]  # feature column
y = df["Diagnosis"]    # target, diagnosis

# split dataset to train set 80% and test set 20%
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Normalize features using StandardScaler (k-NN is distance-based)
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# knn model with k=5
knn = KNeighborsClassifier(n_neighbors=5)
knn.fit(X_train_scaled, y_train)

# predict the diagnosis
y_pred = knn.predict(X_test_scaled)

# show accuracy 
accuracy = accuracy_score(y_test, y_pred)
print(f"k-NN Model Accuracy: {accuracy * 100:.2f}%")
