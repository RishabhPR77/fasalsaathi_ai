import pandas as pd
import joblib
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder
from sklearn.multioutput import RegressorChain
import xgboost as xgb

print("🚀 Starting model training process...")

# --- 1) Load the Entire Dataset ---
try:
    df = pd.read_csv('mp_agriculture_stagewise_10000rows_district_season.csv')
    print("✅ Dataset loaded successfully!")
except FileNotFoundError:
    print("❌ Error: 'mp_agriculture_stagewise_10000rows_district_season.csv' not found.")
    exit()

# --- 2) Define Features (X) and All Targets (Y) ---
features = ['crop', 'seed_type', 'soil', 'district', 'season']
targets = ['total_duration_estimate'] + \
          [col for col in df.columns if col.endswith(('_tmin', '_tmax', '_rh', '_rain', '_wind', '_solar_rad'))] + \
          [col for col in df.columns if col.endswith('_stage_dur')]

X = df[features]
Y = df[targets]
print(f"⚙️ Training model with {X.shape[0]} rows of data.")

# --- 3) Create the Final Modeling Pipeline ---
preprocessor = ColumnTransformer(
    transformers=[('cat', OneHotEncoder(handle_unknown='ignore'), features)]
)

base_model = xgb.XGBRegressor(
    n_estimators=100,
    learning_rate=0.1,
    max_depth=5,
    random_state=42,
    n_jobs=-1
)

final_model = RegressorChain(base_estimator=base_model)

pipeline = Pipeline(steps=[
    ('preprocessor', preprocessor),
    ('regressor', final_model)
])

# --- 4) Train the Final Model on the Whole Dataset ---
print("⏳ Training the final RegressorChain model on all data... (this may take a few minutes)")
pipeline.fit(X, Y)
print("✅ Final model training complete!")

# --- 5) Save the Trained Model for Future Use ---
model_filename = 'final_crop_model.joblib'
joblib.dump(pipeline, model_filename)
print(f"\n💾 Model has been saved to '{model_filename}'. It is now compatible with your API.")
