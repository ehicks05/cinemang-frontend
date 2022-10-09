import { createClient } from '@supabase/supabase-js';

const schema = 'cinemang';
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_PUBLIC_KEY!,
  {
    schema,
  },
);

export { supabase };
