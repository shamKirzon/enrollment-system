<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import * as Select from '$lib/components/ui/select';
	import { Input } from '$lib/components/ui/input';
	import { userSchema, type UserSchema } from '$lib/schemas/user';
	import { toast } from 'svelte-sonner';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { Role, type User } from '$lib/types/user';
	import { capitalizeFirstLetter } from '$lib';
	import { getContext } from 'svelte';

	export let user: User | undefined = undefined;
	export let mode: 'create' | 'update' = 'create';

	const data = getContext<SuperValidated<Infer<UserSchema>>>('formUser');

	let loadingToast: string | number | undefined;

	const form = superForm(data, {
		validators: zodClient(userSchema),
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

	$formData = {
		avatar_url: user?.avatar_url,
		role: user?.role || Role.Student,
		email: user?.email || '',
		first_name: user?.first_name || '',
		middle_name: user?.middle_name,
		last_name: user?.last_name || '',
		suffix_name: user?.suffix_name,
		contact_number: user?.contact_number || '',
		password: ''
	};

	const action = mode === 'create' ? '?/create' : `?/update&id=${user?.id}`;
</script>

<form method="POST" {action} use:enhance>
	<Form.Field {form} name="first_name">
		<Form.Control let:attrs>
			<Form.Label>First Name</Form.Label>
			<Input {...attrs} bind:value={$formData.first_name} />
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
			<Input {...attrs} bind:value={$formData.last_name} />
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
			<Input {...attrs} bind:value={$formData.email} type="email" />
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="contact_number">
		<Form.Control let:attrs>
			<Form.Label>Contact Number</Form.Label>
			<Input {...attrs} bind:value={$formData.contact_number} type="tel" />
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="password">
		<Form.Control let:attrs>
			<Form.Label>Password</Form.Label>
			<Input {...attrs} bind:value={$formData.password} type="password" />
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="role">
		<Form.Control let:attrs>
			<Form.Label>Role</Form.Label>
			<Select.Root
				selected={{
					label: capitalizeFirstLetter(user?.role || Role.Student),
					value: Role.Student
				}}
				onSelectedChange={(v) => {
					v && ($formData.role = v.value);
				}}
				required
			>
				<Select.Trigger {...attrs}>
					<Select.Value placeholder="Select a role" />
				</Select.Trigger>
				<Select.Content>
					<Select.Item value={Role.Student} label="Student" />
					<Select.Item value={Role.Parent} label="Parent" />
					<Select.Item value={Role.Admin} label="Admin" />
				</Select.Content>
			</Select.Root>

			<input hidden bind:value={$formData.role} name={attrs.name} />
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Button>Submit</Form.Button>
</form>
