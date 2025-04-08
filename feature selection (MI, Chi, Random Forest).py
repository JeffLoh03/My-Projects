import pandas as pd
import numpy as np
from sklearn.feature_selection import mutual_info_classif, SelectKBest, chi2
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import MinMaxScaler

# Load the combined dataset
file_path = r"C:\Users\jeffl\OneDrive\Documents\Data Mining Breat Cancer\full_data.csv"   # Update with actual file path
df = pd.read_csv(file_path)

# Convert Diagnosis ('M' = Malignant, 'B' = Benign) to numerical values
df["Diagnosis"] = df["Diagnosis"].map({"M": 1, "B": 0})  # 1 = Malignant, 0 = Benign

# Select features (all 30 features) and target variable
X = df.iloc[:, 2:32]  # Selecting only feature columns
y = df["Diagnosis"]    # Target: Malignancy classification

# Normalize features (for chi-square test)
scaler = MinMaxScaler()
X_scaled = scaler.fit_transform(X)

# Method 1: Mutual Information
mi_scores = mutual_info_classif(X, y)
mi_feature_importance = pd.DataFrame({'Feature': X.columns, 'MI Score': mi_scores}).sort_values(by="MI Score", ascending=False)

# Method 2: Chi-Square Test
chi2_scores, _ = chi2(X_scaled, y)
chi2_feature_importance = pd.DataFrame({'Feature': X.columns, 'Chi2 Score': chi2_scores}).sort_values(by="Chi2 Score", ascending=False)

# Method 3: Random Forest Feature Importance
rf = RandomForestClassifier(n_estimators=100, random_state=42)
rf.fit(X, y)
rf_feature_importance = pd.DataFrame({'Feature': X.columns, 'RF Importance': rf.feature_importances_}).sort_values(by="RF Importance", ascending=False)

# Display the top features from each method
print("🔹 Top Features by Mutual Information:")
print(mi_feature_importance.head(10))

print("\n🔹 Top Features by Chi-Square:")
print(chi2_feature_importance.head(10))

print("\n🔹 Top Features by Random Forest Importance:")
print(rf_feature_importance.head(10))
