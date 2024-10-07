import { createClient, SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://mpunmkgymmjyqipgvbws.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1wdW5ta2d5bW1qeXFpcGd2YndzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjgyNTY5NjcsImV4cCI6MjA0MzgzMjk2N30.DCNT4HALpn-kjlBYbD_CnDkVwSQG2HyffqLtYu6EAuI'

const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey)

export default supabase