<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import { academicYearSchema, type AcademicYearSchema } from '$lib/schemas/enrollment';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import * as Popover from '$lib/components/ui/popover';
	import { Button } from '$lib/components/ui/button';
	import * as Select from '$lib/components/ui/select';
	import { Calendar } from '$lib/components/ui/calendar';
	import { cn } from '$lib/utils';
	import {
		DateFormatter,
		parseDate,
		type DateValue,
		getLocalTimeZone,
		today
	} from '@internationalized/date';
	import CalendarIcon from 'virtual:icons/radix-icons/calendar';
	import { AcademicYearStatus, type AcademicYear } from '$lib/types/enrollment';
	import { toast } from 'svelte-sonner';
	import { capitalizeFirstLetter } from '$lib';

	export let data: SuperValidated<Infer<AcademicYearSchema>>;
	export let academicYear: AcademicYear | undefined = undefined;
	export let mode: 'create' | 'update' = 'create';

	let loadingToast: string | number | undefined;
	const form = superForm(data, {
		validators: zodClient(academicYearSchema),
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
				case 'redirect':
					toast.warning('Unexpected result type: ' + result.type);
					break;
			}
		}
	});

	const { form: formData, enhance } = form;

	$formData = {
		status: academicYear?.status || AcademicYearStatus.Upcoming,
		start_at: academicYear?.start_at || '',
		end_at: academicYear?.end_at || ''
	};

	const df = new DateFormatter('en-US', {
		dateStyle: 'long'
	});

	let value: {
		start_at: DateValue | undefined;
		end_at: DateValue | undefined;
	};

	$: value = {
		start_at: $formData.start_at ? parseDate($formData.start_at) : undefined,
		end_at: $formData.end_at ? parseDate($formData.end_at) : undefined
	};

	let placeholder: DateValue = today(getLocalTimeZone());

	const items = [
		{ value: 0, label: 'Today' },
		{ value: 7, label: 'In a week' },
		{ value: 30, label: 'In a month' },
		{ value: 365, label: 'In a year' }
	];

	const action =
		mode === 'create' ? '?/create_academic_year' : `?/update_academic_year&id=${academicYear?.id}`;
</script>

<form {action} method="POST" use:enhance class="space-y-8">
	<Form.Field {form} name="start_at" class="flex flex-col">
		<Form.Control let:attrs>
			<Form.Label>Start</Form.Label>

			<Popover.Root openFocus>
				<Popover.Trigger asChild let:builder {...attrs}>
					<Button
						variant="outline"
						class={cn('text-left font-normal justify-between', !value && 'text-muted-foreground')}
						builders={[builder]}
					>
						{value.start_at ? df.format(value.start_at.toDate(getLocalTimeZone())) : 'Pick a date'}
						<CalendarIcon class="mr-2 h-4 w-4" />
					</Button>
				</Popover.Trigger>

				<Popover.Content class="flex w-auto flex-col space-y-2 p-2">
					<Select.Root
						{items}
						onSelectedChange={(v) => {
							if (!v) return;
							value.start_at = today(getLocalTimeZone()).add({ days: v.value });
							$formData.start_at = value.start_at.toString();
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
							bind:value={value.start_at}
							bind:placeholder
							initialFocus
							onValueChange={(v) => {
								if (v) {
									console.log(v.toString());
									$formData.start_at = v.toString();
								} else {
									$formData.start_at = '';
								}
							}}
						/>
					</div>
				</Popover.Content>
			</Popover.Root>

			<input hidden value={$formData.start_at} name={attrs.name} />
		</Form.Control>
		<Form.Description>The start of the academic year.</Form.Description>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="end_at" class="flex flex-col">
		<Form.Control let:attrs>
			<Form.Label>End</Form.Label>

			<Popover.Root openFocus>
				<Popover.Trigger asChild let:builder {...attrs}>
					<Button
						variant="outline"
						class={cn('text-left font-normal justify-between', !value && 'text-muted-foreground')}
						builders={[builder]}
					>
						{value.end_at ? df.format(value.end_at.toDate(getLocalTimeZone())) : 'Pick a date'}
						<CalendarIcon class="mr-2 h-4 w-4" />
					</Button>
				</Popover.Trigger>

				<Popover.Content class="flex w-auto flex-col space-y-2 p-2">
					<Select.Root
						{items}
						onSelectedChange={(v) => {
							if (!v) return;
							value.end_at = today(getLocalTimeZone()).add({ days: v.value });
							$formData.end_at = value.end_at.toString();
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
							bind:value={value.end_at}
							bind:placeholder
							initialFocus
							onValueChange={(v) => {
								if (v) {
									console.log(v.toString());
									$formData.end_at = v.toString();
								} else {
									$formData.end_at = '';
								}
							}}
						/>
					</div>
				</Popover.Content>
			</Popover.Root>

			<input hidden value={$formData.end_at} name={attrs.name} />
		</Form.Control>
		<Form.Description>The end of the academic year.</Form.Description>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="status">
		<Form.Control let:attrs>
			<Form.Label>Status</Form.Label>
			<Select.Root
				selected={{
					label: capitalizeFirstLetter(academicYear?.status || AcademicYearStatus.Upcoming),
					value: academicYear?.status || AcademicYearStatus.Upcoming
				}}
				onSelectedChange={(v) => {
					v && ($formData.status = v.value);
				}}
				required
			>
				<Select.Trigger {...attrs}>
					<Select.Value placeholder="Select a status" />
				</Select.Trigger>
				<Select.Content>
					<Select.Item value={AcademicYearStatus.Upcoming} label="Upcoming" />
					<Select.Item value={AcademicYearStatus.Open} label="Open" />
					<Select.Item value={AcademicYearStatus.Ongoing} label="Ongoing" />
					<Select.Item value={AcademicYearStatus.Finished} label="Finished" />
				</Select.Content>
			</Select.Root>

			<input hidden bind:value={$formData.status} name={attrs.name} />
		</Form.Control>
		<Form.Description>The academic year's current status.</Form.Description>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Button>Submit</Form.Button>
</form>
