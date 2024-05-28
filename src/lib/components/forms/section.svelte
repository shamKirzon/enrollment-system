<script lang="ts">
	import * as Select from '$lib/components/ui/select';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { sectionSchema, type SectionSchema } from '$lib/schemas/enrollment';
	import { toast } from 'svelte-sonner';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import {
		EducationLevel,
		type SectionLevelDetails,
		type Strand,
		type YearLevel
	} from '$lib/types/enrollment';
	import type { Teacher } from '$lib/types/user';
	import { formatName } from '$lib';
	import { getContext } from 'svelte';

	export let mode: 'create' | 'update' = 'create';
	export let section: SectionLevelDetails | undefined = undefined;

	const data = getContext<SuperValidated<Infer<SectionSchema>>>('formSection');
	const yearLevels = getContext<YearLevel[]>('yearLevels');
	const strands = getContext<Strand[]>('strands');
	const teachers = getContext<Teacher[]>('teachers');

	let loadingToast: string | number | undefined;

	const form = superForm(data, {
		validators: zodClient(sectionSchema),
		resetForm: false,
		onSubmit: () => {
			loadingToast = toast.loading('Creating sections...');
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
			}
		}
	});

	const { form: formData, enhance } = form;

	if (section) {
		$formData = {
			section_name: section.section_name,
			adviser_id: section.adviser_id,
			year_level_id: section.year_level_id,
			strand_id: section.strand_id
		};
	}

	$: selectedYearLevel = yearLevels.find((y) => y.id === $formData.year_level_id);

	const action = mode === 'create' ? '?/create' : '?/update';
</script>

<form method="POST" {action} use:enhance>
	<Form.Field {form} name="section_name">
		<Form.Control let:attrs>
			<Form.Label>Name</Form.Label>
			<Input {...attrs} bind:value={$formData.section_name} />
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="year_level_id">
		<Form.Control let:attrs>
			<Form.Label>Year Level</Form.Label>
			<Select.Root
				onSelectedChange={(v) => {
					v && ($formData.year_level_id = v.value);

					if (selectedYearLevel?.education_level !== EducationLevel.SeniorHighSchool) {
						$formData.strand_id = undefined;
					}
				}}
				selected={{ value: section?.year_level_id, label: section?.year_level_name }}
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

	<Form.Field {form} name="strand_id">
		<Form.Control let:attrs>
			<Form.Label>Strand</Form.Label>
			<Select.Root
				onSelectedChange={(v) => {
					v && ($formData.strand_id = v.value);
				}}
				selected={{ value: section?.strand_id, label: section?.strand_name }}
			>
				<Select.Trigger
					{...attrs}
					disabled={selectedYearLevel?.education_level !== EducationLevel.SeniorHighSchool}
				>
					<Select.Value placeholder="Select a strand" />
				</Select.Trigger>
				<Select.Content>
					<Select.Item value={undefined} label="None" />
					{#each strands as strand (strand.id)}
						<Select.Item value={strand.id} label={strand.name} />
					{/each}
				</Select.Content>
			</Select.Root>
			<input hidden bind:value={$formData.strand_id} name={attrs.name} />
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="adviser_id">
		<Form.Control let:attrs>
			<Form.Label>Adviser</Form.Label>
			<Select.Root
				onSelectedChange={(v) => {
					v && ($formData.adviser_id = v.value);
				}}
				selected={{
					value: section?.adviser_id,
					label: section?.adviser_id
						? formatName({
								first_name: section?.adviser_first_name || '',
								middle_name: section?.adviser_middle_name,
								last_name: section?.adviser_last_name || '',
								suffix_name: section?.adviser_suffix_name
							})
						: undefined
				}}
			>
				<Select.Trigger {...attrs}>
					<Select.Value placeholder="Select an adviser" />
				</Select.Trigger>
				<Select.Content>
					<Select.Item value={undefined} label="None" />
					{#each teachers as teacher (teacher.id)}
						{@const { first_name, middle_name, last_name, suffix_name } = teacher}
						{@const name = formatName({ first_name, middle_name, last_name, suffix_name })}

						<Select.Item value={teacher.id} label={name} />
					{/each}
				</Select.Content>
			</Select.Root>
			<input hidden bind:value={$formData.adviser_id} name={attrs.name} />
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Button>Submit</Form.Button>
</form>
