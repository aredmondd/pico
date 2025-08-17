export type Category = {
	id: number;
	name: string;
};

export type SubCategory = {
	id: number;
	category_id: number;
	name: string;
};

export type Transaction = {
	id: number;
	date: string;
	description: string;
	amount: number;
	category_id: number;
	subcategory_id: number;
};
