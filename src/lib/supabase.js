// src/lib/supabase.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ffnzwusnwqfmcckzgzrq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZmbnp3dXNud3FmbWNja3pnenJxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczMzEzODIyMiwiZXhwIjoyMDQ4NzE0MjIyfQ.I9ScJtdb63yPrBe-Pgzx5vjfv3UkDoM1Qb5kYm_PTP4';
const supabase_jwt_secrete = '28Ftd3UKM8frZ5tuLtPaMdoj+YQ4/z91cL9LwhetAIzU/rvceCKEKW2nv12wSLL1w0AA++f3W5+pRtedpsWgRA=='
const supabase = createClient(supabaseUrl, supabaseKey);

// export default supabase;     


