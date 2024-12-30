// src/lib/supabase.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ffnzwusnwqfmcckzgzrq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZmbnp3dXNud3FmbWNja3pnenJxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczMzEzODIyMiwiZXhwIjoyMDQ4NzE0MjIyfQ.I9ScJtdb63yPrBe-Pgzx5vjfv3UkDoM1Qb5kYm_PTP4';

const supabase = createClient(supabaseUrl, supabaseKey);

// export default supabase;