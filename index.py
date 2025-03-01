import requests
import pandas as pd
from bs4 import BeautifulSoup
from flask import Flask, jsonify, render_template_string

def fetch_rota(url):
    """Fetch rota table from a given URL and return as DataFrame."""
    response = requests.get(url)
    response.raise_for_status()  # Ensure request was successful
    
    soup = BeautifulSoup(response.text, 'html.parser')
    table = soup.find('table')  # Find the first table on the page
    
    df = pd.read_html(str(table))[0]  # Convert to DataFrame
    return df

def merge_rotas(url1, url2):
    """Fetch, clean, and merge two rotas."""
    df1 = fetch_rota(url1)
    df2 = fetch_rota(url2)
    
    # Standardize column names (assuming they are slightly different)
    df1.columns = df1.columns.str.strip().str.lower()
    df2.columns = df2.columns.str.strip().str.lower()
    
    # Merge the two dataframes
    merged_df = pd.concat([df1, df2]).drop_duplicates().reset_index(drop=True)
    return merged_df

app = Flask(__name__)

@app.route('/')
def home():
    return "Rota Merge API is Running!"

@app.route('/merged-rota', methods=['GET'])
def get_merged_rota():
    url1 = "https://vchp.my.salesforce-sites.com/rota?clinicId=7014J000000kfMy"
    url2 = "https://vchp.my.salesforce-sites.com/rota?clinicId=7014J000000kfNS"
    merged_rota = merge_rotas(url1, url2)
    
    # Convert merged rota to an HTML table
    html_template = """
    <html>
    <head>
        <title>Merged Rota</title>
        <style>
            table { border-collapse: collapse; width: 100%; }
            th, td { border: 1px solid black; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
        </style>
    </head>
    <body>
        <h2>Merged Rota</h2>
        {{ table|safe }}
    </body>
    </html>
    """
    return render_template_string(html_template, table=merged_rota.to_html(index=False))

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
