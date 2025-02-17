import os
from supabase import create_client
from dotenv import load_dotenv
from tqdm import tqdm

# loading of environ. vars.
load_dotenv(dotenv_path='.env.local')
supabase_url = os.getenv('NEXT_PUBLIC_SUPABASE_URL')
supabase_key = os.getenv('NEXT_PUBLIC_SUPABASE_KEY')

# validate environment variables
if not all([supabase_url, supabase_key]):
    raise ValueError("Missing required environment variables. Check .env.local file.")

try:
    supabase = create_client(supabase_url, supabase_key)
except Exception as e:
    raise ConnectionError(f"Failed to connect to Supabase: {str(e)}")

def insert_data(data, table_name):
    """Insert data into specified table with progress bar and error handling."""
    try:
        for item in tqdm(data, desc=f"Inserting into {table_name}"):
            # Create a new dict with lowercase keys
            lowercase_item = {k.lower(): v for k, v in item.items()}
            supabase.table(table_name).upsert(lowercase_item).execute()
        print(f"Successfully inserted {len(data)} items into {table_name}")
    except Exception as e:
        print(f"Error inserting data: {str(e)}")
        return False
    return True

def get_table_data():
    """Get and validate user input for table data."""
    # Define valid tables and their required/optional fields
    VALID_TABLES = {
        'links': {
            'required': ['TITLE', 'URL', 'DATE'],
            'optional': ['NOTE', 'DESC']
        },
        'papers': {
            'required': ['TITLE', 'AUTHORS', 'URL', 'YEAR', 'DATE'],
            'optional': ['DESC']
        }
    }

    # Get and validate table name
    while True:
        table_name = input('Enter table name (links/papers): ').strip().lower()
        if table_name in VALID_TABLES:
            break
        print(f"Invalid table. Please choose from: {', '.join(VALID_TABLES.keys())}")

    data = []
    print(f"\nAdding entries for {table_name}")
    
    while True:
        print("\nEnter details for next item:")
        entry = {}
        required_fields = VALID_TABLES[table_name]['required']
        optional_fields = VALID_TABLES[table_name]['optional']
        all_fields = required_fields + optional_fields
        
        # Show available fields
        print(f"\nRequired fields: {', '.join(required_fields)}")
        print(f"Optional fields: {', '.join(optional_fields)}")
        
        # Get field inputs
        while True:
            field = input("\nField name (or 'end' to finish entry): ").strip().upper()
            if field == 'END':
                break
            
            if field not in all_fields:
                print(f"Invalid field. Choose from the fields listed above.")
                continue
                
            while True:
                value = input(f"Value for {field} (or 'end' to cancel entry): ").strip()
                if value.upper() == 'END':
                    break
                if not value and field in required_fields:
                    print(f"{field} is required and cannot be empty.")
                    continue
                break
            entry[field] = value
        
        # Validate required fields
        missing_fields = [f for f in required_fields if f not in entry]
        if missing_fields:
            print(f"Missing required fields: {', '.join(missing_fields)}")
            if input("Try this entry again? (yes/no): ").strip().lower() == 'yes':
                continue
        elif entry:
            data.append(entry)
            print("Entry added successfully.")
        
        if input("\nAdd another entry? (yes/no): ").strip().lower() != 'yes':
            break
    
    return table_name, data

def main():
    """Main program loop with error handling."""
    print("Supabase Data Entry Script.")
    
    while True:
        try:
            table_name, data = get_table_data()
            
            if data:
                print(f"\nReview the data to be inserted:")
                for i, entry in enumerate(data, 1):
                    print(f"\nEntry {i}:")
                    for field, value in entry.items():
                        print(f"{field}: {value}")
                
                if input("\nProceed with insertion? (yes/no): ").strip().lower() == 'yes':
                    if insert_data(data, table_name):
                        print("Data insertion complete.")
                else:
                    print("Data insertion cancelled.")
            else:
                print("No data to insert.")
            
            if input("\nAdd data to another table? (yes/no): ").strip().lower() != 'yes':
                print("Done.")
                break
                
        except KeyboardInterrupt:
            print("\nOperation cancelled by user. Exiting...")
            break
        except Exception as e:
            print(f"\nAn unexpected error occurred: {str(e)}")
            if input("Continue with the program? (yes/no): ").strip().lower() != 'yes':
                break

if __name__ == "__main__":
    main()