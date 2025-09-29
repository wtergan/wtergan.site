#!/usr/bin/env python3

import os
from datetime import datetime
from supabase import create_client
from dotenv import load_dotenv
from tqdm import tqdm
import json

# Load environment variables
load_dotenv(dotenv_path='.env.local')
supabase_url = os.getenv('NEXT_PUBLIC_SUPABASE_URL')
supabase_key = os.getenv('NEXT_PUBLIC_SUPABASE_KEY')

# Validate environment variables
if not all([supabase_url, supabase_key]):
    raise ValueError("Missing required environment variables. Check .env.local file.")

try:
    supabase = create_client(supabase_url, supabase_key)
except Exception as e:
    raise ConnectionError(f"Failed to connect to Supabase: {str(e)}")

# Table configurations
TABLE_CONFIG = {
    'links': {
        'required': ['title', 'url', 'date'],
        'optional': ['note', 'desc'],
        'display_fields': ['title', 'url', 'date', 'note']
    },
    'papers': {
        'required': ['title', 'authors', 'url', 'year', 'date'],
        'optional': ['desc'],
        'display_fields': ['title', 'authors', 'year', 'url']
    }
}

class DatabaseManager:
    def __init__(self):
        self.supabase = supabase
        self.table_config = TABLE_CONFIG

    def get_valid_tables(self):
        """Get list of valid table names."""
        return list(self.table_config.keys())

    def validate_table(self, table_name):
        """Validate if table name is supported."""
        if table_name not in self.table_config:
            raise ValueError(f"Invalid table. Choose from: {', '.join(self.get_valid_tables())}")
        return True

    def get_table_schema(self, table_name):
        """Get table schema information."""
        self.validate_table(table_name)
        return self.table_config[table_name]

    def display_records(self, table_name, records, limit=None):
        """Display records in a formatted table."""
        if not records:
            print(f"No records found in {table_name}")
            return

        schema = self.get_table_schema(table_name)
        display_fields = schema['display_fields']
        
        # Apply limit if specified
        if limit:
            records = records[:limit]

        print(f"\n{table_name.upper()} ({len(records)} records):")
        print("-" * 80)
        
        for i, record in enumerate(records, 1):
            print(f"\n{i}. ID: {record.get('id', 'N/A')}")
            for field in display_fields:
                value = record.get(field, 'N/A')
                if isinstance(value, str) and len(value) > 100:
                    value = value[:100] + "..."
                print(f"   {field.upper()}: {value}")

    def list_all(self, table_name, limit=None):
        """List all records from a table."""
        self.validate_table(table_name)
        
        try:
            result = self.supabase.table(table_name).select('*').execute()
            records = result.data
            
            if limit:
                records = records[:limit]
            
            self.display_records(table_name, records)
            return records
            
        except Exception as e:
            print(f"Error fetching records from {table_name}: {e}")
            return []

    def search_records(self, table_name, field, value):
        """Search records by field value."""
        self.validate_table(table_name)
        
        try:
            result = self.supabase.table(table_name).select('*').ilike(field, f'%{value}%').execute()
            records = result.data
            
            print(f"\nSearch results for '{value}' in {field}:")
            self.display_records(table_name, records)
            return records
            
        except Exception as e:
            print(f"Error searching {table_name}: {e}")
            return []

    def get_record_by_id(self, table_name, record_id):
        """Get a specific record by ID."""
        self.validate_table(table_name)
        
        try:
            result = self.supabase.table(table_name).select('*').eq('id', record_id).execute()
            if result.data:
                return result.data[0]
            else:
                print(f"No record found with ID: {record_id}")
                return None
        except Exception as e:
            print(f"Error fetching record: {e}")
            return None

    def create_record(self, table_name, data):
        """Create a new record."""
        self.validate_table(table_name)
        schema = self.get_table_schema(table_name)
        
        # Validate required fields
        missing_fields = [field for field in schema['required'] if field not in data or not data[field]]
        if missing_fields:
            raise ValueError(f"Missing required fields: {', '.join(missing_fields)}")
        
        try:
            result = self.supabase.table(table_name).insert(data).execute()
            print(f"Successfully created record in {table_name}")
            return result.data[0] if result.data else None
        except Exception as e:
            print(f"Error creating record: {e}")
            return None

    def update_record(self, table_name, record_id, data):
        """Update an existing record."""
        self.validate_table(table_name)
        
        try:
            result = self.supabase.table(table_name).update(data).eq('id', record_id).execute()
            if result.data:
                print(f"Successfully updated record {record_id} in {table_name}")
                return result.data[0]
            else:
                print(f"No record found with ID: {record_id}")
                return None
        except Exception as e:
            print(f"Error updating record: {e}")
            return None

    def delete_record(self, table_name, record_id):
        """Delete a record by ID."""
        self.validate_table(table_name)
        
        try:
            self.supabase.table(table_name).delete().eq('id', record_id).execute()
            print(f"Successfully deleted record {record_id} from {table_name}")
            return True
        except Exception as e:
            print(f"Error deleting record: {e}")
            return False

    def batch_insert(self, table_name, records):
        """Insert multiple records with progress bar."""
        self.validate_table(table_name)
        schema = self.get_table_schema(table_name)
        
        # Validate all records
        for i, record in enumerate(records):
            missing_fields = [field for field in schema['required'] if field not in record or not record[field]]
            if missing_fields:
                raise ValueError(f"Record {i+1} missing required fields: {', '.join(missing_fields)}")
        
        try:
            success_count = 0
            for record in tqdm(records, desc=f"Inserting into {table_name}"):
                result = self.supabase.table(table_name).insert(record).execute()
                if result.data:
                    success_count += 1
            
            print(f"Successfully inserted {success_count}/{len(records)} records into {table_name}")
            return success_count
        except Exception as e:
            print(f"Error during batch insert: {e}")
            return 0

    def clear_table(self, table_name, confirm=True):
        """Clear all records from a table."""
        self.validate_table(table_name)
        
        if confirm:
            response = input(f"Are you sure you want to delete ALL records from {table_name}? (yes/no): ")
            if response.lower() != 'yes':
                print("Operation cancelled.")
                return False
        
        try:
            # Get all records first
            result = self.supabase.table(table_name).select('id').execute()
            record_ids = [record['id'] for record in result.data]
            
            # Delete each record
            deleted_count = 0
            for record_id in tqdm(record_ids, desc=f"Deleting from {table_name}"):
                self.supabase.table(table_name).delete().eq('id', record_id).execute()
                deleted_count += 1
            
            print(f"Successfully deleted {deleted_count} records from {table_name}")
            return True
        except Exception as e:
            print(f"Error clearing table: {e}")
            return False

    def export_table(self, table_name, output_file=None):
        """Export table data to JSON file."""
        self.validate_table(table_name)
        
        try:
            result = self.supabase.table(table_name).select('*').execute()
            records = result.data
            
            if not output_file:
                timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
                output_file = f"{table_name}_export_{timestamp}.json"
            
            with open(output_file, 'w', encoding='utf-8') as f:
                json.dump(records, f, indent=2, ensure_ascii=False)
            
            print(f"Exported {len(records)} records from {table_name} to {output_file}")
            return output_file
        except Exception as e:
            print(f"Error exporting table: {e}")
            return None

    def import_from_json(self, table_name, json_file):
        """Import records from JSON file."""
        self.validate_table(table_name)
        
        try:
            with open(json_file, 'r', encoding='utf-8') as f:
                records = json.load(f)
            
            # Remove id fields for import
            for record in records:
                if 'id' in record:
                    del record['id']
            
            return self.batch_insert(table_name, records)
        except Exception as e:
            print(f"Error importing from JSON: {e}")
            return 0

def get_user_input(prompt, required=True):
    """Get user input with validation."""
    while True:
        value = input(prompt).strip()
        if value or not required:
            return value
        print("This field is required.")

def interactive_record_creation(db_manager, table_name):
    """Interactive creation of a new record."""
    schema = db_manager.get_table_schema(table_name)
    record = {}
    
    print(f"\nCreating new {table_name[:-1]} record:")
    print(f"Required fields: {', '.join(schema['required'])}")
    print(f"Optional fields: {', '.join(schema['optional'])}")
    
    # Get required fields
    for field in schema['required']:
        record[field] = get_user_input(f"{field.upper()}: ", required=True)
    
    # Get optional fields
    for field in schema['optional']:
        value = get_user_input(f"{field.upper()} (optional): ", required=False)
        if value:
            record[field] = value
    
    return record

def main_menu():
    """Main interactive menu."""
    db_manager = DatabaseManager()
    
    while True:
        print("\n" + "="*50)
        print("DATABASE MANAGER")
        print("="*50)
        print("1. List all records")
        print("2. Search records")
        print("3. Create new record")
        print("4. Update record")
        print("5. Delete record")
        print("6. Batch operations")
        print("7. Export/Import")
        print("8. Clear table")
        print("9. Exit")
        
        choice = input("\nSelect option (1-9): ").strip()
        
        try:
            if choice == '1':
                table_name = input("Table name (links/papers): ").strip().lower()
                limit = input("Limit (press Enter for all): ").strip()
                limit = int(limit) if limit.isdigit() else None
                db_manager.list_all(table_name, limit)
            
            elif choice == '2':
                table_name = input("Table name (links/papers): ").strip().lower()
                field = input("Field to search: ").strip()
                value = input("Search value: ").strip()
                db_manager.search_records(table_name, field, value)
            
            elif choice == '3':
                table_name = input("Table name (links/papers): ").strip().lower()
                record = interactive_record_creation(db_manager, table_name)
                db_manager.create_record(table_name, record)
            
            elif choice == '4':
                table_name = input("Table name (links/papers): ").strip().lower()
                record_id = input("Record ID to update: ").strip()
                
                # Show current record
                current = db_manager.get_record_by_id(table_name, record_id)
                if current:
                    print("\nCurrent record:")
                    db_manager.display_records(table_name, [current])
                    
                    # Get updates
                    updates = {}
                    schema = db_manager.get_table_schema(table_name)
                    all_fields = schema['required'] + schema['optional']
                    
                    for field in all_fields:
                        current_value = current.get(field, '')
                        new_value = input(f"{field.upper()} [{current_value}]: ").strip()
                        if new_value:
                            updates[field] = new_value
                    
                    if updates:
                        db_manager.update_record(table_name, record_id, updates)
            
            elif choice == '5':
                table_name = input("Table name (links/papers): ").strip().lower()
                record_id = input("Record ID to delete: ").strip()
                
                # Show record before deletion
                current = db_manager.get_record_by_id(table_name, record_id)
                if current:
                    print("\nRecord to delete:")
                    db_manager.display_records(table_name, [current])
                    
                    confirm = input("Confirm deletion (yes/no): ").strip().lower()
                    if confirm == 'yes':
                        db_manager.delete_record(table_name, record_id)
            
            elif choice == '6':
                print("\nBatch Operations:")
                print("1. Import from JSON")
                print("2. Batch insert from manual input")
                
                batch_choice = input("Select (1-2): ").strip()
                table_name = input("Table name (links/papers): ").strip().lower()
                
                if batch_choice == '1':
                    json_file = input("JSON file path: ").strip()
                    db_manager.import_from_json(table_name, json_file)
                
                elif batch_choice == '2':
                    records = []
                    while True:
                        print(f"\nRecord {len(records) + 1}:")
                        record = interactive_record_creation(db_manager, table_name)
                        records.append(record)
                        
                        if input("Add another record? (yes/no): ").strip().lower() != 'yes':
                            break
                    
                    if records:
                        db_manager.batch_insert(table_name, records)
            
            elif choice == '7':
                print("\nExport/Import:")
                print("1. Export table to JSON")
                print("2. Import from JSON")
                
                export_choice = input("Select (1-2): ").strip()
                table_name = input("Table name (links/papers): ").strip().lower()
                
                if export_choice == '1':
                    output_file = input("Output file (press Enter for auto-generated): ").strip()
                    db_manager.export_table(table_name, output_file if output_file else None)
                
                elif export_choice == '2':
                    json_file = input("JSON file path: ").strip()
                    db_manager.import_from_json(table_name, json_file)
            
            elif choice == '8':
                table_name = input("Table name (links/papers): ").strip().lower()
                db_manager.clear_table(table_name)
            
            elif choice == '9':
                print("Goodbye!")
                break
            
            else:
                print("Invalid choice. Please select 1-9.")
        
        except KeyboardInterrupt:
            print("\nOperation cancelled by user.")
        except Exception as e:
            print(f"Error: {e}")

if __name__ == "__main__":
    main_menu()