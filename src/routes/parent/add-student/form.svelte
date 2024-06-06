<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { addStudentSchema, type AddStudentSchema } from '$lib/schemas/user';
	import { type SuperValidated, type Infer, superForm, fileProxy } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import * as Popover from '$lib/components/ui/popover';
	import * as Select from '$lib/components/ui/select';
	import { Button } from '$lib/components/ui/button';
	import { Calendar } from '$lib/components/ui/calendar';
	import {
		DateFormatter,
		parseDate,
		type DateValue,
		getLocalTimeZone,
		today
	} from '@internationalized/date';
	import CalendarIcon from 'virtual:icons/radix-icons/calendar';
	import { cn } from '$lib/utils';
	import { capitalizeFirstLetter } from '$lib';
	import { Sex } from '$lib/types/user';
	import { toast } from 'svelte-sonner';

	export let data: SuperValidated<Infer<AddStudentSchema>>;

	let loadingToast: string | number | undefined;

	const form = superForm(data, {
		validators: zodClient(addStudentSchema),
		resetForm: false,
		onSubmit: () => {
			loadingToast = toast.loading('Creating student...');
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
			}
		}
	});

	const { form: formData, enhance } = form;

	const df = new DateFormatter('en-US', {
		dateStyle: 'long'
	});

	let value: {
		birth_date: DateValue | undefined;
	};

	$: value = {
		birth_date: $formData.birth_date ? parseDate($formData.birth_date) : undefined
	};

	let placeholder: DateValue = today(getLocalTimeZone());
	const items = [
		{ value: 0, label: 'Today' },
		{ value: 7, label: 'In a week' },
		{ value: 30, label: 'In a month' },
		{ value: 365, label: 'In a year' }
	];

	$: selectedSex = $formData.sex
		? {
				label: capitalizeFirstLetter($formData.sex),
				value: $formData.sex
			}
		: undefined;
</script>

<form method="POST" enctype="multipart/form-data" class="space-y-5" use:enhance>
	<Form.Field {form} name="first_name">
		<Form.Control let:attrs>
			<Form.Label>First Name</Form.Label>
			<Input {...attrs} bind:value={$formData.first_name}  />
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
			<Input {...attrs} bind:value={$formData.last_name}  />
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
			<Input {...attrs} bind:value={$formData.email} type="email"  />
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="contact_number">
		<Form.Control let:attrs>
			<Form.Label>Contact Number</Form.Label>
			<Input {...attrs} bind:value={$formData.contact_number} type="tel"  />
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="password">
		<Form.Control let:attrs>
			<Form.Label>Account Password</Form.Label>
			<Input {...attrs} bind:value={$formData.password} type="password"  />
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="country">
		<Form.Control let:attrs>
			<Form.Label>Country</Form.Label>
			<Input {...attrs} bind:value={$formData.country}  />
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="region">
		<Form.Control let:attrs>
			<Form.Label>Region</Form.Label>
			<Input {...attrs} bind:value={$formData.region}  />
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="province">
		<Form.Control let:attrs>
			<Form.Label>Province</Form.Label>
			<Input {...attrs} bind:value={$formData.province}  />
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="city">
		<Form.Control let:attrs>
			<Form.Label>City</Form.Label>
			<Input {...attrs} bind:value={$formData.city}  />
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="barangay">
		<Form.Control let:attrs>
			<Form.Label>Barangay</Form.Label>
			<Input {...attrs} bind:value={$formData.barangay}  />
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="street">
		<Form.Control let:attrs>
			<Form.Label>Street</Form.Label>
			<Input {...attrs} bind:value={$formData.street}  />
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="lrn">
		<Form.Control let:attrs>
			<Form.Label>Learning Reference Number (LRN)</Form.Label>
			<Input {...attrs} bind:value={$formData.lrn}  />
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="birth_date" class="flex flex-col">
		<Form.Control let:attrs>
			<Form.Label>Birth Date</Form.Label>

			<Popover.Root openFocus>
				<Popover.Trigger asChild let:builder {...attrs}>
					<Button
						variant="outline"
						class={cn('text-left font-normal justify-between', !value && 'text-muted-foreground')}
						builders={[builder]}
					>
						{value.birth_date
							? df.format(value.birth_date.toDate(getLocalTimeZone()))
							: 'Pick a date'}
						<CalendarIcon class="mr-2 h-4 w-4" />
					</Button>
				</Popover.Trigger>

				<Popover.Content class="flex w-auto flex-col space-y-2 p-2">
					<Select.Root
						{items}
						onSelectedChange={(v) => {
							if (!v) return;
							value.birth_date = today(getLocalTimeZone()).add({ days: v.value });
							$formData.birth_date = value.birth_date.toString();
						}}
					>
						<Select.Trigger>
							<Select.Value placeholder="Select" />
						</Select.Trigger>
						<Select.Content>
							{#each items as item}
								<Select.Item value={item.value}>{item.label}</Select.Item>
							{/each}
						</Select.Content>
					</Select.Root>

					<div class="rounded-md border">
						<Calendar
							bind:value={value.birth_date}
							bind:placeholder
							initialFocus
							onValueChange={(v) => {
								if (v) {
									$formData.birth_date = v.toString();
								} else {
									$formData.birth_date = '';
								}
							}}
						/>
					</div>
				</Popover.Content>
			</Popover.Root>

			<input hidden value={$formData.birth_date} name={attrs.name} />
		</Form.Control>
		<Form.Description>The start of the academic year.</Form.Description>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="birth_place">
		<Form.Control let:attrs>
			<Form.Label>Birth Place</Form.Label>
			<Input {...attrs} bind:value={$formData.birth_place}  />
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="sex">
		<Form.Control let:attrs>
			<Form.Label>Sex</Form.Label>
			<Select.Root
				selected={selectedSex}
				onSelectedChange={(v) => {
					v && ($formData.sex = v.value);
				}}
			>
				<Select.Trigger {...attrs}>
					<Select.Value placeholder="Select a sex" />
				</Select.Trigger>
				<Select.Content>
					<Select.Item value={Sex.Male} label="Male" />
					<Select.Item value={Sex.Female} label="Female" />
				</Select.Content>
			</Select.Root>
			<input hidden bind:value={$formData.sex} name={attrs.name} />
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="citizenship">
		<Form.Control let:attrs>
			<Form.Label>Citizenship</Form.Label>
			<Input {...attrs} bind:value={$formData.citizenship}  />
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="religion">
		<Form.Control let:attrs>
			<Form.Label>Religion</Form.Label>
			<Input {...attrs} bind:value={$formData.religion}  />
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="parent_contact_number">
		<Form.Control let:attrs>
			<Form.Label>Preferred Parent Contact Number</Form.Label>
			<Input {...attrs} bind:value={$formData.parent_contact_number}  />
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="landline">
		<Form.Control let:attrs>
			<Form.Label>Preferred Landline</Form.Label>
			<Input {...attrs} bind:value={$formData.landline}  />
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="birth_certificate">
		<Form.Control let:attrs>
			<Form.Label>Birth Certificate</Form.Label>
			<Input
				{...attrs}
				type="file"
				accept="image/*"
				on:change={(e) => {
					$formData.birth_certificate = e.currentTarget.files ? e.currentTarget.files[0] : undefined;
				}}
			/>
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="baptismal_certificate">
		<Form.Control let:attrs>
			<Form.Label>Baptismal Certificate</Form.Label>
			<Input
				{...attrs}
				type="file"
				accept="image/*"
				on:change={(e) => {
					$formData.baptismal_certificate = e.currentTarget.files ? e.currentTarget.files[0] : undefined;
				}}
			/>
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Button>Submit</Form.Button>
</form>
