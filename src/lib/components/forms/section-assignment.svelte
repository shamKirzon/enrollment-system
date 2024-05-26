<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import * as Select from '$lib/components/ui/select';
	import { sectionAssignmentSchema, type SectionAssignmentSchema } from '$lib/schemas/enrollment';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { format } from 'date-fns';
	import type { AcademicYear, YearLevel } from '$lib/types/enrollment';
	import { toast } from 'svelte-sonner';

	export let data: SuperValidated<Infer<SectionAssignmentSchema>>;
	export let academicYears: AcademicYear[];
	export let yearLevels: YearLevel[];

	let loadingToast: string | number | undefined;

	const form = superForm(data, {
		validators: zodClient(sectionAssignmentSchema),
		resetForm: false,
		onSubmit: () => {
			loadingToast = toast.loading('Assigning sections...');
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

						console.log(result.data?.sectionAssignments);
					}
					break;
				case 'failure':
					{
						const message: string = result.data?.message || 'Invalid form data.';
						toast.error(message);
					}
					break;
				case 'redirect':
					{
						toast.success('Successfully assigned sections to students.');
					}
					break;
			}
		}
	});

	const { form: formData, enhance } = form;
</script>

<form method="POST" use:enhance>
	<Form.Field {form} name="academic_year_id">
		<Form.Control let:attrs>
			<Form.Label>Academic Year</Form.Label>
			<Select.Root
				onSelectedChange={(v) => {
					v && ($formData.academic_year_id = v.value);
				}}
			>
				<Select.Trigger {...attrs}>
					<Select.Value placeholder="Select an academic year" />
				</Select.Trigger>
				<Select.Content>
					{#each academicYears as academicYear (academicYear.id)}
						{@const year = `${format(academicYear.start_at, 'yyyy')} - ${format(academicYear.end_at, 'yyyy')}`}

						<Select.Item value={academicYear.id} label={year} />
					{/each}
				</Select.Content>
			</Select.Root>
			<input hidden bind:value={$formData.academic_year_id} name={attrs.name} />
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="year_level_id">
		<Form.Control let:attrs>
			<Form.Label>Year Level</Form.Label>
			<Select.Root
				onSelectedChange={(v) => {
					v && ($formData.year_level_id = v.value);
				}}
			>
				<Select.Trigger {...attrs}>
					<Select.Value placeholder="Select a year level" />
				</Select.Trigger>
				<Select.Content>
					{#each yearLevels as yearLevel (yearLevel.id)}
						<Select.Item value={yearLevel.id} label={yearLevel.name} />
					{/each}
				</Select.Content>
			</Select.Root>
			<input hidden bind:value={$formData.year_level_id} name={attrs.name} />
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Button>Submit</Form.Button>
</form>
