<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { registerSchema, type RegisterSchema } from '$lib/schemas/auth';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { toast } from 'svelte-sonner';

	export let data: SuperValidated<Infer<RegisterSchema>>;

	let loadingToast: string | number | undefined;

	const form = superForm(data, {
		validators: zodClient(registerSchema),
		onSubmit: () => {
			loadingToast = toast.loading('Creating user...');
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
					toast.success('Successfully registered. You may now log in.');
					break;
			}
		}
	});

	const { form: formData, enhance } = form;
</script>

<form method="POST" use:enhance>
	<Form.Field {form} name="first_name">
		<Form.Control let:attrs>
			<Form.Label>First Name</Form.Label>
			<Input {...attrs} bind:value={$formData.first_name} required />
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="middle_name">
		<Form.Control let:attrs>
			<Form.Label>Middle Name</Form.Label>
			<Input {...attrs} bind:value={$formData.middle_name} />
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="last_name">
		<Form.Control let:attrs>
			<Form.Label>Last Name</Form.Label>
			<Input {...attrs} bind:value={$formData.last_name} required />
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="suffix_name">
		<Form.Control let:attrs>
			<Form.Label>Suffix Name</Form.Label>
			<Input {...attrs} bind:value={$formData.suffix_name} />
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="email">
		<Form.Control let:attrs>
			<Form.Label>Email</Form.Label>
			<Input {...attrs} bind:value={$formData.email} required />
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="contact_number">
		<Form.Control let:attrs>
			<Form.Label>Contact Number</Form.Label>
			<Input {...attrs} bind:value={$formData.contact_number} type="tel" required />
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="password">
		<Form.Control let:attrs>
			<Form.Label>Password</Form.Label>
			<Input {...attrs} type="password" bind:value={$formData.password} required />
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="confirm_password">
		<Form.Control let:attrs>
			<Form.Label>Confirm Password</Form.Label>
			<Input {...attrs} type="password" bind:value={$formData.confirm_password} required />
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<a href="/login" class="underline text-sm">Already have an account?</a>
	<Form.Button class="mt-4">Submit</Form.Button>
</form>
