'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type {
  FinancialOverview,
  ExpenseBreakdown,
  UpcomingSubscription,
  OverduePayment,
  ClientFinancialSummary,
} from '@/types/database';

export function useDashboardData() {
  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState<FinancialOverview | null>(null);
  const [expenseBreakdown, setExpenseBreakdown] = useState<ExpenseBreakdown[]>([]);
  const [upcomingSubscriptions, setUpcomingSubscriptions] = useState<UpcomingSubscription[]>([]);
  const [overduePayments, setOverduePayments] = useState<OverduePayment[]>([]);
  const [clientSummaries, setClientSummaries] = useState<ClientFinancialSummary[]>([]);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        // Fetch each view separately to handle types properly
        const { data: overviewData } = await supabase
          .from('v_financial_overview' as any)
          .select('*')
          .single();

        const { data: expenseData } = await supabase
          .from('v_expense_breakdown' as any)
          .select('*');

        const { data: subsData } = await supabase
          .from('v_upcoming_subscriptions' as any)
          .select('*');

        const { data: overdueData } = await supabase
          .from('v_overdue_payments' as any)
          .select('*');

        const { data: clientData } = await supabase
          .from('v_client_financial_summary' as any)
          .select('*');

        if (overviewData) setOverview(overviewData as any as FinancialOverview);
        if (expenseData) setExpenseBreakdown(expenseData as any as ExpenseBreakdown[]);
        if (subsData) setUpcomingSubscriptions(subsData as any as UpcomingSubscription[]);
        if (overdueData) setOverduePayments(overdueData as any as OverduePayment[]);
        if (clientData) setClientSummaries(clientData as any as ClientFinancialSummary[]);
      } catch (error) {
        console.error('Dashboard fetch error:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return { loading, overview, expenseBreakdown, upcomingSubscriptions, overduePayments, clientSummaries };
}
