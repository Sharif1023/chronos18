
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dmmqvidrkgfdlccbbvuu.supabase.co';
const supabaseAnonKey = 'sb_publishable_kRK90CR69UkZtwVVd1a0Yw_3fmyqxiU';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
