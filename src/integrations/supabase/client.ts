// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://xrhooijfbuujnkjsgnav.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhyaG9vaWpmYnV1am5ranNnbmF2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzUxNTUwMzgsImV4cCI6MjA1MDczMTAzOH0.LoWTVETEhjTzFDOo9LGkZ932JzlaLcabrpm2itfYsIA";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);