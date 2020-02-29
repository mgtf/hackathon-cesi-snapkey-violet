import pandas as pd
import sys
df = pd.read_json (r'content.json')
df.to_csv (r'db.csv', index = None)
