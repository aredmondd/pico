import type { PageServerLoad } from './$types';
import { supabase } from '$lib/supabaseClient';
import type { Transaction } from '$lib/database';

export const load: PageServerLoad = async () => {
	const { data, error } = await supabase.from('transactions').select<'transactions', Transaction>();

	if (error) {
		console.error('Error loading data:', error.message);
		return { transactions: [] };
	}

	return {
		transactions: data ?? []
	};
};
