import pandas as pd
import numpy as np
from sklearn.feature_selection import mutual_info_classif
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.neighbors import KNeighborsClassifier
from sklearn.metrics import accuracy_score

# Read the file
file_path = r"C:\Users\jeffl\OneDrive\Documents\Data Mining Breat Cancer\full_data.csv"
df = pd.read_csv(file_path)

# Convert Diagnosis ('M' = Malignant, 'B' = Benign) to numerical values
#  M=1 , B=0
df["Diagnosis"] = df["Diagnosis"].map({"M": 1, "B": 0})

# select feature
X = df.iloc[:, 2:32]  # feature column
y = df["Diagnosis"]    # target, diagnosis

# Compute mutual information 
mi_scores = mutual_info_classif(X, y)
mi_results = pd.DataFrame({'Feature': X.columns, 'Mutual Information': mi_scores}).sort_values(by="Mutual Information", ascending=False)

# select top 10 highest mutual information
selected_features = mi_results['Feature'].head(7).tolist()

# train the model with features selection
X_selected = X[selected_features]

# split the dataset into train and test set
X_train, X_test, y_train, y_test = train_test_split(X_selected, y, test_size=0.2, random_state=42)

# Normalize features
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# train K-NN model
knn = KNeighborsClassifier(n_neighbors=5)
knn.fit(X_train_scaled, y_train)

# Predict on test data
y_pred = knn.predict(X_test_scaled)

# Compute accuracy 
accuracy_selected_features = accuracy_score(y_test, y_pred)

# # Train k-NN using all features for comparison
# X_train_full, X_test_full, y_train_full, y_test_full = train_test_split(X, y, test_size=0.2, random_state=42)

# # Normalize full feature set
# X_train_full_scaled = scaler.fit_transform(X_train_full)
# X_test_full_scaled = scaler.transform(X_test_full)

# # Train k-NN with all features
# knn_full = KNeighborsClassifier(n_neighbors=5)
# knn_full.fit(X_train_full_scaled, y_train_full)

# # Predict using all features
# y_pred_full = knn_full.predict(X_test_full_scaled)

# # Compute accuracy using all features
# accuracy_all_features = accuracy_score(y_test_full, y_pred_full)

# Print accuracy comparison
print(f"\n Accuracy using Selected Features: {accuracy_selected_features * 100:.2f}%")
# print(f" Accuracy using All Features: {accuracy_all_features * 100:.2f}%")
