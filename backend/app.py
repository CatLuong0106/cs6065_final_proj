import os
import pyodbc, struct
from azure import identity
from flask import Flask, jsonify, request, abort, render_template
from typing import Union
from pydantic import BaseModel
from dotenv import load_dotenv
from flask_cors import CORS
from flask import Flask, flash, request, redirect, url_for
from werkzeug.utils import secure_filename
import pandas as pd
import json

app = Flask(__name__, static_folder="../frontend/build/static", template_folder="../frontend/build")
CORS(app)

load_dotenv()

connection_string = os.environ["AZURE_CONNECTION_STRING"]

@app.route("/")
def frontend():
    return render_template("index.html")


# Establish connection to the Azure SQL database
def get_db_connection():
    conn = pyodbc.connect(connection_string)
    return conn


@app.route('/getHouseholds', methods=['GET'])
def getHousehold():
    conn = get_db_connection()
    cursor = conn.cursor()

    # Pagination parameters
    page = request.args.get('page', default=1, type=int)
    pageSize = request.args.get('pageSize', default=100, type=int)

    # Calculate offset based on pagination parameters
    offset = (page - 1) * pageSize

    # Fetch data for the specified page using OFFSET and FETCH clauses
    cursor.execute("""SELECT *
                    FROM [dbo].[Households] AS hh
                    JOIN [dbo].[Transactions20k] AS tr ON hh.Hshd_num = tr.Hshd_num
                    JOIN [dbo].[Products] AS pr ON tr.Product_num = pr.Product_num
                    ORDER BY hh.Hshd_num, Basket_num, Purchase_date, tr.Product_num, Department, Commodity
                    OFFSET ? ROWS
                    FETCH NEXT ? ROWS ONLY;
                   """, (offset, pageSize))

    results = [dict(zip([column[0] for column in cursor.description], row)) for row in cursor.fetchall()]
    
    # Check if results are empty (no records found for the specified page)
    if not results:
        abort(404, description="Households not found")

    conn.close()
    return jsonify(results)

@app.route('/getHouseholds/<int:household_id>', methods=['GET'])
def getHouseholdByID(household_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Pagination parameters
    page = request.args.get('page', default=1, type=int)
    pageSize = request.args.get('pageSize', default=100, type=int)

    # Calculate offset based on pagination parameters
    offset = (page - 1) * pageSize

    
    cursor.execute("""SELECT *
                    FROM [dbo].[Households] AS hh
                    JOIN [dbo].[Transactions20k] AS tr ON hh.Hshd_num = tr.Hshd_num
                    JOIN [dbo].[Products] AS pr ON tr.Product_num = pr.Product_num
                    WHERE hh.Hshd_num = ?
                    ORDER BY hh.Hshd_num, Basket_num, Purchase_date, tr.Product_num, Department, Commodity
                    OFFSET ? ROWS
                    FETCH NEXT ? ROWS ONLY;""", (household_id, offset, pageSize))

    results = [dict(zip([column[0] for column in cursor.description], row)) for row in cursor.fetchall()]


    if len(results) == 0 or results is None:
        abort(404, description="Households not found")
    conn.close()
    print(len(results))
    return jsonify(results)


@app.route('/uploadHouseholdsFile', methods=['POST'])
def uploadHouseholdsFile():
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400
        
    if file:
        conn = get_db_connection()
        cursor = conn.cursor()
        filename = secure_filename(file.filename)
        file.save(filename)

        # Assuming you have a function to handle CSV or Excel data insertion into the database
        # For example, using pandas to read CSV and process the data
        try:
            df = pd.read_csv(filename)  # Or pd.read_excel(filename)
            df.columns = df.columns.str.strip()
            print(df.columns)
            # Iterate over rows in the DataFrame and insert into SQL database
            for index, row in df.iterrows():
                cursor.execute("""
                    INSERT INTO [dbo].[Households] (Hshd_num, Loyalty_flag, Age_range, Marital_status, Income_range,
                                                Homeowner_desc, Hshd_composition, Hshd_size, Children)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                """, row['HSHD_NUM'], row['L'], row['AGE_RANGE'], row['MARITAL'], row['INCOME_RANGE'],
                    row['HOMEOWNER'], row['HSHD_COMPOSITION'], row['HH_SIZE'], row['CHILDREN'])

            # Commit the transaction to save changes
            conn.commit()

            # Close the cursor and connection
            cursor.close()
            conn.close()


            return jsonify({'message': 'File uploaded successfully'}), 200
        except Exception as e:
            return jsonify({'error': str(e)}), 500

    return jsonify({'error': 'File upload failed'}), 500


@app.route('/uploadTransactionsFile', methods=['POST'])
def uploadTransactionsFile():
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400
        
    if file:
        conn = get_db_connection()
        cursor = conn.cursor()
        filename = secure_filename(file.filename)
        file.save(filename)


        # Assuming you have a function to handle CSV or Excel data insertion into the database
        # For example, using pandas to read CSV and process the data
        try:
            df = pd.read_csv(filename)  # Or pd.read_excel(filename)
            df.columns = df.columns.str.strip()
            print(df.columns)
            # Iterate over rows in the DataFrame and insert into SQL database
            
            for index, row in df.iterrows():
                cursor.execute("""
                    INSERT INTO [dbo].[Transactions20k] (Basket_num, Hshd_num, Purchase_date, Product_num, Spend,
                                                Units, Store_region, Week_num, Year)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                """, row['BASKET_NUM'], row['HSHD_NUM'], row['PURCHASE_'], row['PRODUCT_NUM'], row['SPEND'],
                    row['UNITS'], row['STORE_R'], row['WEEK_NUM'], row['YEAR'])

            # Commit the transaction to save changes
            conn.commit()

            # Close the cursor and connection
            cursor.close()
            conn.close()


            return jsonify({'message': 'File uploaded successfully'}), 200
        except Exception as e:
            return jsonify({'error': str(e)}), 500

    return jsonify({'error': 'File upload failed'}), 500


@app.route('/uploadProductsFile', methods=['POST'])
def uploadProductsFile():
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400
        
    if file:
        conn = get_db_connection()
        cursor = conn.cursor()
        filename = secure_filename(file.filename)
        file.save(filename)


        # Assuming you have a function to handle CSV or Excel data insertion into the database
        # For example, using pandas to read CSV and process the data
        try:
            df = pd.read_csv(filename)  # Or pd.read_excel(filename)
            df.columns = df.columns.str.strip()
            print(df.columns)
            # Iterate over rows in the DataFrame and insert into SQL database
            
            for index, row in df.iterrows():
                cursor.execute("""
                    INSERT INTO [dbo].[Products] (Product_num, Department, Commodity, Brand_type, Natural_organic_flag)
                    VALUES (?, ?, ?, ?, ?)
                """, row['PRODUCT_NUM'], row['DEPARTMENT'], row['COMMODITY'], row['BRAND_TY'], row['NATURAL_ORGANIC_FLAG'])

            # Commit the transaction to save changes
            conn.commit()

            # Close the cursor and connection
            cursor.close()
            conn.close()


            return jsonify({'message': 'File uploaded successfully'}), 200
        except Exception as e:
            return jsonify({'error': str(e)}), 500

    return jsonify({'error': 'File upload failed'}), 500


if __name__ == '__main__':
    app.run(debug=True, port=8000)