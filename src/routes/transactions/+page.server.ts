import type { PageServerLoad } from './$types';
import { supabase } from '$lib/supabaseClient';
import type { Category, SubCategory, Transaction } from '$lib/database';

export const load: PageServerLoad = async () => {
	const transactionsQuery = supabase
		.from('transactions')
		.select()
		.order('date', { ascending: false });
	const categoriesQuery = supabase.from('categories').select('id, name');
	const subcategoriesQuery = supabase.from('subcategories').select('id, name, category_id');

	const [transactionsResult, categoriesResult, subcategoriesResult] = await Promise.all([
		transactionsQuery,
		categoriesQuery,
		subcategoriesQuery
	]);

	const transactions: Transaction[] = transactionsResult.data || [];
	const categories: Category[] = categoriesResult.data || [];
	const subcategories: SubCategory[] = subcategoriesResult.data || [];

	return {
		transactions,
		categories,
		subcategories
	};
};
