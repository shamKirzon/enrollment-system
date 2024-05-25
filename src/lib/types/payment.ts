export type PaymentMode = {
	id: string;
	payment_channel: string;
	payment_account_id: string;
};

export type TuitionPlan = {
	id: string;
	name: string;
};

export type TransactionPayload = {
	transaction_number: string;
	payment_amount: number;
	payment_method: PaymentMethod;
	payment_receipt_url: string;
	payment_mode_id: string;
};

export enum PaymentMethod {
	Cash = 'cash',
	Installment = 'installment'
}
