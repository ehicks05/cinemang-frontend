import { createClient } from "@supabase/supabase-js";

const schema = "cinemang";
const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL!,
  process.env.REACT_APP_SUPABASE_PUBLIC_KEY!,
  {
    schema,
  }
);

export { supabase };
