
# Supabase Database Scripts

This directory contains SQL scripts for database management.

## How to run the scripts

### Using Supabase Studio

1. Navigate to your Supabase project dashboard
2. Click on "SQL Editor" in the left sidebar
3. Create a new query
4. Paste the contents of the script you want to run
5. Click "Run" to execute the script

### Using Supabase CLI

If you have the Supabase CLI installed:

```
supabase db execute --project-ref your-project-ref -f ./path/to/script.sql
```

## Available Scripts

### `populate_shelters.sql`

Populates the shelters and resources tables with sample data from across the United States. The script:

1. Finds a valid user ID from the auth.users table
2. Deletes existing shelter and resource data for that user
3. Creates 30+ shelters with varied data:
   - Different locations across multiple states
   - Various capacities and occupancy levels
   - Different operational statuses
4. Creates resources for each shelter:
   - Food supplies (scaled to shelter capacity)
   - Water supplies
   - Medical kits
   - Beds
   - Power generators (for some shelters)
   - Other supplies (hygiene kits)

**Important**: Before running this script, ensure you have at least one user in your auth.users table.
