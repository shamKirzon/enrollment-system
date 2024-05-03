<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { type LoginSchema, loginSchema } from '$lib/schemas/auth';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { toast } from 'svelte-sonner';

	export let data: SuperValidated<Infer<LoginSchema>>;

	let loadingToast: string | number | undefined;

	const form = superForm(data, {
		validators: zodClient(loginSchema),
		onSubmit: () => {
			loadingToast = toast.loading('Logging in...');
		},
		onError: ({ result }) => {
			toast.error(result.error.message);
		},
		onResult: ({ result }) => {
			toast.dismiss(loadingToast);

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
				case 'redirect':
					toast.success('Successfully logged in.');
					break;
			}
		}
	});

	const { form: formData, enhance } = form;
</script>

<form method="POST" use:enhance>
	<Form.Field {form} name="email">
		<Form.Control let:attrs>
			<Form.Label>Email</Form.Label>
			<Input {...attrs} bind:value={$formData.email} type="email" required />
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="password">
		<Form.Control let:attrs>
			<Form.Label>Password</Form.Label>
			<Input {...attrs} bind:value={$formData.password} type="password" required />
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<a href="/register" class="underline text-xs">Don't have an account?</a>
	<Form.Button class="mt-4">Submit</Form.Button>
</form>
