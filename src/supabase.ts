import { createClient } from '@supabase/supabase-js';
import { Database } from './generated/supabase';

const supabase = createClient<Database>(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_PUBLIC_KEY!,
);

export { supabase };
