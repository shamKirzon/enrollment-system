<script lang="ts">
	import { subjectSchema, type SubjectSchema } from '$lib/schemas/enrollment';
	import type { Strand, YearLevel } from '$lib/types/enrollment';
	import { toast } from 'svelte-sonner';
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import * as Form from '$lib/components/ui/form';
	import * as Select from '$lib/components/ui/select';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { Button } from '$lib/components/ui/button';

	import { Input } from '$lib/components/ui/input';
	import { getContext } from 'svelte';
	import type { Selected } from 'bits-ui';

	// export let data: SuperValidated<Infer<SubjectSchema>>;
	// export let yearLevels: YearLevel[];
	// export let strands: Strand[];
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

	function addStrand(id: string) {
		$formData.strand_ids = [...$formData.strand_ids, id];
	}

	function removeStrand(id: string) {
		$formData.strand_ids = $formData.strand_ids.filter((i) => i !== id);
	}

	function addYearLevel(id: string) {
		$formData.year_level_ids = [...$formData.year_level_ids, id];
	}

	function removeYearLevel(id: string) {
		$formData.year_level_ids = $formData.year_level_ids.filter((i) => i !== id);
	}

	function getValues(selected: Selected<unknown>[]) {
		return selected.map((v) => v.value);
	}

	// const action = mode === 'create' ? '?/create' : `?/update&id=${subject.id}`;
</script>

<form method="POST" action="?/create" class="space-y-8" use:enhance>
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
					console.log($formData);
					console.log(v);
					v && ($formData.year_level_ids = getValues(v));
				}}
			>
				<Select.Trigger {...attrs}>
					<div class="justify-between flex w-full pr-4">
						<Select.Value placeholder="Select year levels" asChild let:attrs let:label>
							<div {...attrs}>
								{#if label.split(',').length > 3}
									{label.split(',').slice(0, 3).join(',')}
								{:else}
									{label}
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
						<Select.Item value={yearLevel.id} label={yearLevel.name} />
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

	<Form.Fieldset {form} name="strand_ids" class="space-y-2">
		<div>
			<Form.Legend>Strands</Form.Legend>
			<Form.Description>Select the strands for this subject.</Form.Description>
		</div>

		<div class="space-y-2">
			{#each strands as strand (strand.id)}
				{@const checked = $formData.strand_ids.includes(strand.id)}

				<div class="flex flex-row items-start space-x-3">
					<Form.Control let:attrs>
						<Checkbox
							{...attrs}
							{checked}
							onCheckedChange={(v) => {
								if (v) {
									addStrand(strand.id);
								} else {
									removeStrand(strand.id);
								}
							}}
						/>
						<Form.Label class="text-sm font-normal">
							{strand.name}
						</Form.Label>
						<input hidden type="checkbox" name={attrs.name} value={strand.id} {checked} />
					</Form.Control>
				</div>
			{/each}
			<Form.FieldErrors />
		</div>
	</Form.Fieldset>

	<Form.Button>Submit</Form.Button>
</form>
