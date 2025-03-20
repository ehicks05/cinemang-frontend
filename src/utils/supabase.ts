import { createClient } from '@supabase/supabase-js';
import type { Database } from '~/types/database.gen';

const supabase = createClient<Database>(
	import.meta.env.VITE_SUPABASE_URL,
	import.meta.env.VITE_SUPABASE_PUBLIC_KEY,
	// { db: { schema: import.meta.env.VITE_SUPABASE_URL || 'public' } },
);

export { supabase };
