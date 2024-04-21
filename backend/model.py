import pandas as pd
import json
from pathlib import Path
from sklearn.linear_model import LinearRegression
from app import get_db_connection
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.metrics import mean_squared_error

def get_data(): 
    conn = get_db_connection()
    cursor = conn.cursor()

    # Fetch data for the specified page using OFFSET and FETCH clauses
    query = """SELECT *
                FROM [dbo].[Households] AS hh
                JOIN [dbo].[Transactions20k] AS tr ON hh.Hshd_num = tr.Hshd_num
                JOIN [dbo].[Products] AS pr ON tr.Product_num = pr.Product_num
                ORDER BY hh.Hshd_num
            """
    cursor.execute(query)

    # Fetch the results of the query.
    results = [dict(zip([column[0] for column in cursor.description], row)) for row in cursor.fetchall()]
    df = pd.DataFrame(results)
    df = df.map(lambda x: x.strip() if isinstance(x, str) else x)
    
    output_path = 'all_households.csv'
    if not Path(output_path).exists():
        df.to_csv('all_households.csv', index=False)

    return df

def model():
    df = get_data()
    print("Columns: ", df.columns)

    # Group by year and week, then sum the spending
    weekly_spending = df.groupby(['Hshd_num', 'Year', 'Week_num']).agg({'Spend': 'sum', 'Income_range': 'first'}).reset_index()

    # # If you want to differentiate by year, you can further group by year and sum the weekly spending
    # yearly_spending = weekly_spending.groupby('year')['spending'].sum().reset_index()
    weekly_spending.replace('null', pd.NA, inplace=True)

    # Drop all columns containing NaN values
    weekly_spending = weekly_spending.dropna()
    print(weekly_spending)
    print(weekly_spending['Income_range'].unique())

    # One-hot encode the categorical variable 'Income_range'
    column_transformer = ColumnTransformer([('encoder', OneHotEncoder(), ['Income_range'])], remainder='passthrough')

    # Create a pipeline for preprocessing and linear regression
    pipeline = Pipeline(steps=[('preprocessor', column_transformer), ('regressor', LinearRegression())])

    # Split features and target variable
    X = df[['Year', 'Week_num', 'Income_range']]
    y = df['Spend']
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.1, random_state=42)

    # Fit the model
    pipeline.fit(X_train, y_train)

    # Predict
    predictions = pipeline.predict(X_test)
    mse = mean_squared_error(y_test, predictions)
    print("Mean Squared Error:", mse)

    random_data_point = pd.DataFrame({
    'Year': [2021.0],             # Random year
    'Week_num': [1.0],            # Random week number
    'Income_range': ['35-49K']     # Random income range
    })

    predicted_spending = pipeline.predict(random_data_point)
    print("Predicted spending:", predicted_spending)

    return pipeline

def main(): 
    income_range = ['35-49K', '50-74K', 'UNDER 35K', '75-99K', '150K+', '100-150K']
    pipeline = model()
    inference_2021_1 = {}
    inference_2021_2 = {}
    for week in range(1, 53, 1): 
        week_val = float(week)
        random_data_point_1 = pd.DataFrame({
        'Year': [2021.0],             # Random year
        'Week_num': [week_val],            # Random week number
        'Income_range': ['50-74K']     # Random income range
        })

        random_data_point_2 = pd.DataFrame({
        'Year': [2021.0],             # Random year
        'Week_num': [week_val],            # Random week number
        'Income_range': ['100-150K']     # Random income range
        })
        predicted_spending_1 = pipeline.predict(random_data_point_1)
        inference_2021_1[week_val] = predicted_spending_1[0]

        predicted_spending_2 = pipeline.predict(random_data_point_2)
        inference_2021_2[week_val] = predicted_spending_2[0]
    
    print("Predict spending per week for people with income 50-74 k in 2021: \n", inference_2021_1)
    print("")
    print("Predict spending per week for people with income 100-150 k in 2021: \n", inference_2021_2)

    with open(r"..\frontend\inference_2021_50_74.json", 'w') as json_out: 
        json.dump(inference_2021_1, json_out, indent=4)

    with open(r"..\frontend\inference_2021_100_150.json", 'w') as json_out: 
        json.dump(inference_2021_2, json_out, indent=4)

if __name__ == "__main__": 
    main()