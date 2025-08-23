import type { PageServerLoad } from './$types';
import { supabase } from '$lib/supabaseClient';
import type { Category, SubCategory, Transaction } from '$lib/database';
import { fail } from '@sveltejs/kit';
import { USER_ID } from '$env/static/private';

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

	return {
		transactions,
		categories,
		subcategories
	};
};

export const actions = {
	create: async ({ request }) => {
		const formData = await request.formData();

		const date = formData.get('date') as string;
		const description = formData.get('description') as string;
		const categoryId = formData.get('categoryId') as string;
		const subcategoryId = formData.get('subcategoryId') as string;
		const amount = formData.get('amount') as string;

		if (!date || !description || !amount || !categoryId || !subcategoryId) {
			return fail(401, {
				error: 'Date, description, amount, group, and category are required',
				date,
				description,
				amount,
				categoryId,
				subcategoryId
			});
		}

		const amountNumber = parseFloat(amount.substring(1));
		const categoryIdNumber = parseFloat(categoryId);
		const subcategoryIdNumber = parseFloat(subcategoryId);

		if (isNaN(amountNumber) || isNaN(categoryIdNumber) || isNaN(subcategoryIdNumber)) {
			return fail(402, {
				error: 'Amount, Category Id, & Sub Category Id must be valid numbers',
				amount,
				categoryId,
				subcategoryId
			});
		}

		const { data, error } = await supabase.from('transactions').insert([
			{
				date,
				description,
				amount: amountNumber,
				category_id: categoryIdNumber,
				subcategory_id: subcategoryIdNumber,
				user_id: USER_ID
			}
		]);

		if (error) {
			return fail(500, {
				error: 'Failed to create transaction. Try again.',
				date,
				description,
				amount,
				categoryId,
				subcategoryId
			});
		}

		return {
			success: true,
			transaction: {
				date: date,
				description: description,
				amount: amount,
				category_id: categoryId,
				subcategory_id: subcategoryId
			}
		};
	}
};
