import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://jvrezkosmftausbnqwxs.supabase.co'
const supabaseKey = 'sb_publishable_T78TUacnLPGdQUhjhj2jTQ_7wbu9RJz'

export const supabase = createClient(supabaseUrl, supabaseKey)
