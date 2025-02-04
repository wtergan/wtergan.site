import os
from supabase import create_client
from dotenv import load_dotenv
from tqdm import tqdm

# loading of environ. vars.
load_dotenv(dotenv_path='.env.local')
supabase_url = os.getenv('NEXT_PUBLIC_SUPABASE_URL')
supabase_key = os.getenv('NEXT_PUBLIC_SUPABASE_KEY')
supabase = create_client(supabase_url, supabase_key)

# given data and table name, insert data.
def insert_data(data, table_name):
    for item in tqdm(data, desc=f"Inserting into {table_name}"):
        supabase.table(table_name).upsert(item).execute()

# taking user input for table data.
def get_table_data():
    table_name = input('enter table name (links, papers?)').strip()
    data = []

    print(f"adding entries for {table_name}....... ")  
    while True:
        print("\nenter details for next item:")
        entry = {}
        while True:
            if table_name == 'links':
                print(f"{table_name} fields: title, url, note (if needed). id not needed.")
            elif table_name == 'papers':
                print(f"{table_name} fields: title, authors, url, year, date. id not needed.")
            field = input("field name (or end to stop entry), or end to finish: ").strip().lower()
            if field == 'end':
                break
            value = input(f"value for {field}: ").strip()
            entry[field] = value
        if entry:
            data.append(entry)
        else:
            print("no field added.... skipping entry.")

        cont = input("add another entry? (yes/no)").strip().lower()
        if cont == 'no':
            break

    return table_name, data


if __name__ == "__main__":
    while True:
        table_name, data = get_table_data()
        if data:
            print(f"\nInserting data into '{table_name}'...")
            insert_data(data, table_name)
        else:
            print("No data to insert. Skipping...")

        cont = input("Do you want to add data to another table? (yes/no): ").strip().lower()
        if cont == 'no':
            print("Exiting.")
            break