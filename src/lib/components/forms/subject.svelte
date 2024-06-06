<script lang="ts">
	import { subjectSchema, type SubjectSchema } from '$lib/schemas/enrollment';
	import { EducationLevel, type Strand, type YearLevel, Semester } from '$lib/types/enrollment';
	import { toast } from 'svelte-sonner';
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import * as Form from '$lib/components/ui/form';
	import * as Select from '$lib/components/ui/select';

	import { Input } from '$lib/components/ui/input';
	import { getContext } from 'svelte';
	import type { Selected } from 'bits-ui';
	import type { SubjectDetails } from '$lib/types/subject';

	export let subject: SubjectDetails | undefined = undefined;
	export let mode: 'create' | 'update' = 'create';

	const data = getContext<SuperValidated<Infer<SubjectSchema>>>('formSubject');
	const yearLevels = getContext<YearLevel[]>('yearLevels');
	const strands = getContext<Strand[]>('strands');

	let loadingToast: string | number | undefined;

	const form = superForm(data, {
		validators: zodClient(subjectSchema),
		resetForm: false,
		onSubmit: () => {
			loadingToast = toast.loading('Submitting subject...');
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

	$formData = {
		subject_id: subject?.subject_id || '',
		subject_name: subject?.subject_name || '',
		year_level_ids: subject?.year_levels.map(({ id }) => id) || [],
		strand_ids: subject?.strands.map(({ id }) => id) || [],
		semesters: []
	};

	function getValues<T>(selected: Selected<T>[]) {
		return selected.map((v) => v.value);
	}

	const action = mode === 'create' ? '?/create' : `?/update&id=${subject?.subject_id}`;

	$: shsSelected = $formData.year_level_ids.some((id) => {
		const yearLevel = yearLevels.find((yl) => yl.id === id);
		return yearLevel && yearLevel.education_level === EducationLevel.SeniorHighSchool;
	});

	$: shsUnselected = $formData.year_level_ids.some((id) => {
		const yearLevel = yearLevels.find((yl) => yl.id === id);
		return yearLevel && yearLevel.education_level !== EducationLevel.SeniorHighSchool;
	});

	function selectYearLevels(): Selected<string>[] {
		const items = subject?.year_levels.map(({ id, name }) => {
			return { label: name, value: id };
		});

		return items || [];
	}

	function selectStrands(): Selected<string>[] {
		const items = subject?.strands.map(({ id, name }) => {
			return { label: name, value: id };
		});

		return items || [];
	}

	function selectSemesters(): Selected<string>[] {
		return [
			{
				label: "First",
				value: Semester.First
			},
			{
				label: "Second",
				value: Semester.Second
			}
		];
	}
</script>

<form method="POST" {action} class="space-y-8" use:enhance>
	<Form.Field {form} name="subject_id">
		<Form.Control let:attrs>
			<Form.Label>Subject ID</Form.Label>
			<Input {...attrs} bind:value={$formData.subject_id} />
		</Form.Control>
		<Form.Description>The subject's unique identifier.</Form.Description>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="subject_name">
		<Form.Control let:attrs>
			<Form.Label>Subject Name</Form.Label>
			<Input {...attrs} bind:value={$formData.subject_name} />
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="year_level_ids">
		<Form.Control let:attrs>
			<Form.Label>Year Levels</Form.Label>
			<Select.Root
				multiple
				onSelectedChange={(v) => {
					v && ($formData.year_level_ids = getValues(v));
				}}
				selected={mode === 'update' ? selectYearLevels() : undefined}
			>
				<Select.Trigger {...attrs}>
					<div class="justify-between flex w-full pr-4">
						<Select.Value placeholder="Select year levels" asChild let:attrs let:label>
							<div {...attrs}>
								{#if label.split(',').length > 3}
									{label.split(',').slice(0, 3).join(',')}
								{:else if label}
									{label}
								{:else}
									Select year levels
								{/if}
							</div>
						</Select.Value>
						{#if $formData.year_level_ids.length > 3}
							<span>+{$formData.year_level_ids.length} more</span>
						{/if}
					</div>
				</Select.Trigger>
				<Select.Content class="max-w-full">
					{#each yearLevels as yearLevel (yearLevel.id)}
						<Select.Item
							value={yearLevel.id}
							label={yearLevel.name}
							disabled={(shsSelected &&
								yearLevel.education_level !== EducationLevel.SeniorHighSchool) ||
								(shsUnselected && yearLevel.education_level === EducationLevel.SeniorHighSchool)}
						/>
					{/each}
				</Select.Content>
			</Select.Root>

			{#each yearLevels as yearLevel (yearLevel.id)}
				{@const checked = $formData.year_level_ids.includes(yearLevel.id)}

				<input hidden type="checkbox" name={attrs.name} value={yearLevel.id} {checked} />
			{/each}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="strand_ids">
		<Form.Control let:attrs>
			<Form.Label
				class={shsUnselected || $formData.year_level_ids.length < 1 ? 'text-muted-foreground' : ''}
			>
				Strands
			</Form.Label>
			<Select.Root
				multiple
				onSelectedChange={(v) => {
					v && ($formData.strand_ids = getValues(v));
				}}
				disabled={shsUnselected || $formData.year_level_ids.length < 1}
				selected={mode === 'update' ? selectStrands() : undefined}
			>
				<Select.Trigger {...attrs}>
					<div class="justify-between flex w-full pr-4">
						<Select.Value placeholder="Select strands" asChild let:attrs let:label>
							<div {...attrs}>
								{#if $formData.strand_ids.length > 1}
									{label.split(',').slice(0, 1).join(',')}
								{:else if label}
									{label}
								{:else}
									Select strands
								{/if}
							</div>
						</Select.Value>

						{#if $formData.strand_ids.length > 1}
							<span>+{$formData.strand_ids.length} more</span>
						{/if}
					</div>
				</Select.Trigger>
				<Select.Content class="max-w-full">
					{#each strands as strand (strand.id)}
						<Select.Item value={strand.id} label={strand.name} />
					{/each}
				</Select.Content>
			</Select.Root>

			{#each strands as strand (strand.id)}
				{@const checked = $formData.strand_ids.includes(strand.id)}

				<input hidden type="checkbox" name={attrs.name} value={strand.id} {checked} />
			{/each}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="semesters">
		<Form.Control let:attrs>
			<Form.Label
				class={shsUnselected || $formData.year_level_ids.length < 1 ? 'text-muted-foreground' : ''}
			>
				Semesters
			</Form.Label>
			<Select.Root
				multiple
				onSelectedChange={(v) => {
					v && ($formData.semesters = getValues(v));
				}}
				disabled={shsUnselected || $formData.year_level_ids.length < 1}
				selected={mode === 'update' ? selectSemesters() : undefined}
			>
				<Select.Trigger {...attrs}>
					<div class="justify-between flex w-full pr-4">
						<Select.Value placeholder="Select semesters" />
					</div>
				</Select.Trigger>
				<Select.Content class="max-w-full">
					<Select.Item value={Semester.First} label="First" />
					<Select.Item value={Semester.Second} label="Second" />
				</Select.Content>
			</Select.Root>

			<input
				hidden
				type="checkbox"
				name={attrs.name}
				value={Semester.First}
				checked={$formData.semesters.includes(Semester.First)}
			/>
			<input
				hidden
				type="checkbox"
				name={attrs.name}
				value={Semester.Second}
				checked={$formData.semesters.includes(Semester.Second)}
			/>
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Button>Submit</Form.Button>
</form>
