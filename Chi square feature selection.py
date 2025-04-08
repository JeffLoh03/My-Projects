import pandas as pd
import numpy as np
from sklearn.feature_selection import SelectKBest, chi2
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import MinMaxScaler, StandardScaler
from sklearn.neighbors import KNeighborsClassifier
from sklearn.metrics import accuracy_score

# read the file
file_path=r"C:\Users\jeffl\OneDrive\Documents\Data Mining Breat Cancer\lymphography\lymphography_cleaned.csv"
df = pd.read_csv(file_path)

# select feature
X = df.iloc[:, 1:]  #feature
y = df["class"]  # target

# standardize the value
scaler = MinMaxScaler()
X_scaled = scaler.fit_transform(X)

# chi square test with top 10 selective feature
chi2_selector = SelectKBest(score_func=chi2, k=10)  
X_selected = chi2_selector.fit_transform(X_scaled, y)

# tabulate the Chi square and the feature with decending order
chi2_scores = pd.DataFrame({'Feature': X.columns, 'Chi2 Score': chi2_selector.scores_}).sort_values(by='Chi2 Score', ascending=False)
chi2_scores.to_csv("chi2_feature_selection.csv", index=False)

# split dataset to train set 80% and test set 20%
X_train, X_test, y_train, y_test = train_test_split(X_selected, y, test_size=0.2, random_state=42)

# Standardize features for k-NN
std_scaler = StandardScaler()
X_train_scaled = std_scaler.fit_transform(X_train)
X_test_scaled = std_scaler.transform(X_test)

# Train k-NN classifier
knn = KNeighborsClassifier(n_neighbors=5)
knn.fit(X_train_scaled, y_train)

# Predict on test data
y_pred = knn.predict(X_test_scaled)

# Compute accuracy using selected features
accuracy_selected_features = accuracy_score(y_test, y_pred)

# Train k-NN using all features for comparison
X_train_full, X_test_full, y_train_full, y_test_full = train_test_split(X_scaled, y, test_size=0.2, random_state=42)

# Standardize full feature set
X_train_full_scaled = std_scaler.fit_transform(X_train_full)
X_test_full_scaled = std_scaler.transform(X_test_full)

# Train k-NN with all features
knn_full = KNeighborsClassifier(n_neighbors=5)
knn_full.fit(X_train_full_scaled, y_train_full)

# Predict using all features
y_pred_full = knn_full.predict(X_test_full_scaled)

# Compute accuracy using all features
accuracy_all_features = accuracy_score(y_test_full, y_pred_full)

# Print accuracy comparison
print(f"\n Accuracy using Selected Features: {accuracy_selected_features * 100:.2f}%")
print(f" Accuracy using All Features: {accuracy_all_features * 100:.2f}%")
