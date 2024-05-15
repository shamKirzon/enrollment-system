<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import * as Select from '$lib/components/ui/select';
	import { Input } from '$lib/components/ui/input';
	import { enrollmentSchema, type EnrollmentSchema } from '$lib/schemas/enrollment';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	export let data: SuperValidated<Infer<EnrollmentSchema>>;

	const form = superForm(data, {
		validators: zodClient(enrollmentSchema)
	});

	const { form: formData, enhance } = form;

	const tuitionPlans = ['a', 'b'];
</script>

<form method="POST" use:enhance>
	<!-- <Form.Field {form} name="year_level_id"> -->
	<!-- 	<Form.Control let:attrs> -->
	<!-- 		<Form.Label>Year Level</Form.Label> -->
	<!-- 		<Input {...attrs} bind:value={$formData.year_level_id} /> -->
	<!-- 	</Form.Control> -->
	<!-- 	<Form.FieldErrors /> -->
	<!-- </Form.Field> -->

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
					<Select.Item value="1" label="Grade 11" />
					<Select.Item value="2" label="Grade 12" />
				</Select.Content>
			</Select.Root>
			<input hidden bind:value={$formData.year_level_id} name={attrs.name} />
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="tuition_plan">
		<Form.Control let:attrs>
			<Form.Label>Tuition Plan</Form.Label>
			<Select.Root
				onSelectedChange={(v) => {
					v && ($formData.tuition_plan = v.value);
				}}
			>
				<Select.Trigger {...attrs}>
					<Select.Value placeholder="Select a tuition plan" />
				</Select.Trigger>
				<Select.Content>
					{#each tuitionPlans as tuitionPlan, idx (idx)}
						<Select.Item value={tuitionPlan} label={tuitionPlan} />
					{/each}
				</Select.Content>
			</Select.Root>
			<input hidden bind:value={$formData.year_level_id} name={attrs.name} />
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Button>Submit</Form.Button>
</form>
