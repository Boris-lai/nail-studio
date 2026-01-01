import { createClient } from "@supabase/supabase-js";
const supabaseUrl = "https://qkgglpyddnmyhoybssye.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFrZ2dscHlkZG5teWhveWJzc3llIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcwOTUxNjYsImV4cCI6MjA4MjY3MTE2Nn0.QSg3MxOmcgX85hSBXZ2z115KLU6ky9U1Fhmh4YVzeo4";
export const supabase = createClient(supabaseUrl, supabaseKey);
