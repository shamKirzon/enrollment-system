<script lang="ts">
	import * as Table from '$lib/components/ui/table';
	import { EducationLevel } from '$lib/types/enrollment';
	import { roundNumber } from '$lib';
	import type { SubjectGradeDetails } from '$lib/types/subject';
	import { getContext } from 'svelte';
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { gradesSchema, type GradesSchema } from '$lib/schemas/subject';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { toast } from 'svelte-sonner';

	export let data: SubjectGradeDetails;
	export let interactive: boolean = false;
	export let submit: (() => Promise<void>) | undefined = undefined;

	const gradesForm = getContext<SuperValidated<Infer<GradesSchema>>>('gradesForm');

	let loadingToast: string | number | undefined;

	const { form, errors, enhance } = superForm(gradesForm, {
		dataType: 'json',
		validators: zodClient(gradesSchema),
		invalidateAll: "force",
		resetForm: false,
		onSubmit: ({jsonData, formData}) => {
			console.log("Submitting grades...")
			console.log(jsonData)
			console.log(formData)
			loadingToast = toast.loading('Submitting grades...');
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
		},
	});
</script>

<form method="POST" class="contents" use:enhance>
	<Table.Root>
		<Table.Header>
			<Table.Row>
				<Table.Head>Subjects</Table.Head>
				<Table.Head>1st</Table.Head>
				<Table.Head>2nd</Table.Head>
				{#if data.education_level !== EducationLevel.SeniorHighSchool}
					<Table.Head>3rd</Table.Head>
					<Table.Head>4th</Table.Head>
				{/if}
				<Table.Head>Final Rating</Table.Head>
			</Table.Row>
		</Table.Header>
		<Table.Body>
			{#if interactive}
				{#each $form.subject_grades as { grades, subject_name, average_grade }, i (i)}
					<Table.Row>
						<Table.Cell class="w-2/5">{subject_name}</Table.Cell>

						{#each grades as { grade, period }, j (j)}
							<Table.Cell>
								<input
									class="w-full bg-transparent"
									data-invalid={$errors.subject_grades?.[i].grades?.[j].grade}
									bind:value={$form.subject_grades[i].grades[j].grade}
								/>
							</Table.Cell>
						{/each}

						<Table.Cell>{average_grade ? roundNumber(average_grade, 3) : '---'}</Table.Cell>
					</Table.Row>
				{/each}
			{:else}
				{#each data.subject_grades as { subject_name, grades, average_grade }, i (i)}
					<Table.Row>
						<Table.Cell class="w-2/5">{subject_name}</Table.Cell>

						{#each grades as { grade, period }, j (j)}
							<Table.Cell>{grade ? roundNumber(grade, 0) : '---'}</Table.Cell>
						{/each}

						<Table.Cell>{average_grade ? roundNumber(average_grade, 3) : '---'}</Table.Cell>
					</Table.Row>
				{/each}
			{/if}
		</Table.Body>
	</Table.Root>

		<input type="submit" hidden />
</form>
