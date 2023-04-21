import { createClient } from '@supabase/supabase-js';
import { Database } from './generated/supabase';

const schema = 'cinemang';
const supabase = createClient<Database>(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_PUBLIC_KEY!,
  {
    db: { schema },
  },
);

export { supabase };
