import type { PageServerLoad } from './$types';
import { supabase } from '$lib/supabaseClient';
import type { Category, SubCategory, Transaction } from '$lib/database';

export const load: PageServerLoad = async () => {
	const transactionsQuery = supabase
		.from('transactions')
		.select()
		.order('date', { ascending: false })
		.order('created_at', { ascending: false });
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

	const months = Array.from(
		new Set(
			transactions.map((t) => {
				const date = new Date(t.date);
				return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
			})
		)
	)
		.sort((a, b) => b.localeCompare(a)) // most recent first
		.map((key) => {
			const [year, month] = key.split('-');
			const date = new Date(+year, +month - 1);
			return {
				key,
				name: date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
			};
		});

	return {
		transactions,
		categories,
		subcategories,
		months
	};
};
