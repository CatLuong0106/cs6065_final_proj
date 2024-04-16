import os
import pyodbc, struct
from azure import identity
from flask import Flask, jsonify, request, abort
from typing import Union
from pydantic import BaseModel
from dotenv import load_dotenv
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

load_dotenv()

connection_string = os.environ["AZURE_CONNECTION_STRING"]

# Establish connection to the Azure SQL database
def get_db_connection():
    conn = pyodbc.connect(connection_string)
    return conn

@app.route('/getHousehold', methods=['GET'])
def getHousehold():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM dbo.Households")
    results = [dict(zip([column[0] for column in cursor.description], row)) for row in cursor.fetchall()]
    conn.close()
    return jsonify(results)

@app.route('/getHouseholdByID/<int:household_id>', methods=['GET'])
def getHouseholdByID(household_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM dbo.Households WHERE Hshd_num = ?", (household_id,))
    result = cursor.fetchone()
    if result is None:
        abort(404, description="Household not found")
    result = dict(zip([column[0] for column in cursor.description], result))
    conn.close()
    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True)