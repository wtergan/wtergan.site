// API endpoint that pings Supabase every now and then, thereby maintaining db connection.
import { NextResponse } from "next/server";

/*
GET request handler that achieves the following:
    - uses Supabase's service role key for elevated privileges.
    - attempts to fetch from the tables list as connection test.
    - returns success/failure status, based on the Supabase response.
 */
export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const tables = ["papers", "links"];

  // Handling case if env vars are missing...
  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json({ error: "Missing Supabase credentials..." }, { status: 500 });
  }

  // Pinging each table in the db, using Promise.all() for parallel requests handling.
  // Also adding try-catch to handle possible network failures.
  const results = await Promise.all(
    tables.map(async (table) => {
      try {
        const res = await fetch(`${supabaseUrl}/rest/v1/${table}`, {
          method: "GET",
          headers: {
            "apikey": supabaseKey,
            "Authorization": `Bearer ${supabaseKey}`,
            "Content-Type": "application/json",
          },
        });

        return { table, status: res.ok ? "success" : "failed" };
      } catch (error) {
        return { table, status: "error", error: error instanceof Error ? error.message : "Unknown error" };
      }
    })
  );

  return NextResponse.json({ results });
}