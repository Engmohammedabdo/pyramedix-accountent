'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { MonthlyRevenue } from '@/types/database';

export function useMonthlyRevenue() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<MonthlyRevenue[]>([]);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const { data: revenue } = await supabase
        .from('v_monthly_revenue' as any)
        .select('*')
        .order('year', { ascending: false })
        .order('month', { ascending: false })
        .limit(12);

      if (revenue) setData((revenue as any as MonthlyRevenue[]).reverse());
      setLoading(false);
    }
    fetchData();
  }, []);

  return { loading, data };
}
