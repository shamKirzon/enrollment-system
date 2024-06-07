<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { getContext } from 'svelte';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { feeSchema, type FeeSchema } from '$lib/schemas/enrollment';
	import { toast } from 'svelte-sonner';
	import type { EnrollmentFeeLevelDetails } from '$lib/types/enrollment';

	export let fee: EnrollmentFeeLevelDetails;
	const data = getContext<SuperValidated<Infer<FeeSchema>>>('feeForm');

	let loadingToast: string | number | undefined;

	const form = superForm(data, {
		validators: zodClient(feeSchema),
		resetForm: false,
		onSubmit: () => {
			loadingToast = toast.loading('Creating academic year...');
		},
		onError: ({ result }) => {
			toast.error(result.error.message);
		},
		onResult: ({ result }) => {
			toast.dismiss(loadingToast);

			console.log(result);
			switch (result.type) {
				case 'success':
					{
						const message: string = result.data?.message;
						toast.success(message);
					}
					break;
				case 'failure':
					{
						const message: string = result.data?.message || 'Invalid form data.';
						toast.error(message);
					}
					break;
			}
		}
	});

	const { form: formData, enhance } = form;

	console.log(fee)
	$formData = {
		id: fee.enrollment_fee_level_id,
		amount: Number(fee.amount)
	}
</script>

<form method="POST" action="?/update" use:enhance>
	<input type="text" hidden name="id" bind:value={$formData.id}>

	<Form.Field {form} name="amount">
		<Form.Control let:attrs>
			<Form.Label>Amount</Form.Label>
			<Input {...attrs} bind:value={$formData.amount} type="number" />
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Button>Submit</Form.Button>
</form>
