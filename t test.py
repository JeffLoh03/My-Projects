import pandas as pd
import numpy as np
from scipy.stats import ttest_ind
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.neighbors import KNeighborsClassifier
from sklearn.metrics import accuracy_score

# Read the full dataset
file_path = r"C:\Users\jeffl\OneDrive\Documents\Data Mining Breat Cancer\full_data.csv"
df = pd.read_csv(file_path)

# Convert Diagnosis ('M' = Malignant, 'B' = Benign) to numerical values
#  M=1 , B=0
df["Diagnosis"] = df["Diagnosis"].map({"M": 1, "B": 0})

# select feature
X = df.iloc[:, 2:32]  # feature column
y = df["Diagnosis"]    # target, diagnosis

# Perform T test to get the p value
p_values = {}
for column in X.columns:
    malignant_group = X[y == 1][column]
    benign_group = X[y == 0][column]
    t_stat, p_val = ttest_ind(malignant_group, benign_group, equal_var=False)
    p_values[column] = p_val

# sort the p value from smallest to largest
t_test_results = pd.DataFrame(list(p_values.items()), columns=['Feature', 'P-Value']).sort_values(by='P-Value')

#select the top 10 accuracy
selected_features = t_test_results['Feature'].head(10).tolist()

# train the model with the feature selection
X_selected = X[selected_features]

# split the dataset into train and test set
X_train, X_test, y_train, y_test = train_test_split(X_selected, y, test_size=0.2, random_state=42)

# normalize the data
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# start to train by using knn model, k=5
knn = KNeighborsClassifier(n_neighbors=5)
knn.fit(X_train_scaled, y_train)

# predict the target
y_pred = knn.predict(X_test_scaled)

# perform the accuracy
accuracy_selected_features = accuracy_score(y_test, y_pred)

# using all feature for comparison
X_train_full, X_test_full, y_train_full, y_test_full = train_test_split(X, y, test_size=0.2, random_state=42)


X_train_full_scaled = scaler.fit_transform(X_train_full)
X_test_full_scaled = scaler.transform(X_test_full)

# train k-NN with all features
knn_full = KNeighborsClassifier(n_neighbors=5)
knn_full.fit(X_train_full_scaled, y_train_full)

#predict the target
y_pred_full = knn_full.predict(X_test_full_scaled)

# accuracy
accuracy_all_features = accuracy_score(y_test_full, y_pred_full)

# Print accuracy comparison
print(f"\n Accuracy using Selected Features: {accuracy_selected_features * 100:.2f}%")
print(f" Accuracy using All Features: {accuracy_all_features * 100:.2f}%")
