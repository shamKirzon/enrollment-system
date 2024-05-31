<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import * as Select from '$lib/components/ui/select';
	import { Input } from '$lib/components/ui/input';
	import { enrollmentSchema, type EnrollmentSchema } from '$lib/schemas/enrollment';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { toast } from 'svelte-sonner';
	import {
		EducationLevel,
		StudentStatus,
		type AcademicYear,
		type Strand,
		type YearLevel
	} from '$lib/types/enrollment';
	import { format } from 'date-fns';
	import type { PaymentMode, TuitionPlan } from '$lib/types/payment';
	import { Separator } from '$lib/components/ui/separator';

	export let data: SuperValidated<Infer<EnrollmentSchema>>;
	export let academicYears: AcademicYear[];
	export let yearLevels: YearLevel[];
	export let strands: Strand[];
	export let paymentModes: PaymentMode[];
	export let tuitionPlans: TuitionPlan[];
	export let studentStatus: StudentStatus;

	let loadingToast: string | number | undefined;

	const form = superForm(data, {
		validators: zodClient(enrollmentSchema),
		resetForm: false,
		onSubmit: () => {
			loadingToast = toast.loading('Submitting enrollment...');
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

	$formData.student_status = studentStatus;

	$: shsSelected = yearLevels.some(({ id, education_level }) => {
		return id === $formData.year_level_id && education_level === EducationLevel.SeniorHighSchool;
	});
</script>

<form method="POST" enctype="multipart/form-data" class="space-y-8" use:enhance>
	<!-- <Form.Field {form} name="year_level_id"> -->
	<!-- 	<Form.Control let:attrs> -->
	<!-- 		<Form.Label>Year Level</Form.Label> -->
	<!-- 		<Input {...attrs} bind:value={$formData.year_level_id} /> -->
	<!-- 	</Form.Control> -->
	<!-- 	<Form.FieldErrors /> -->
	<!-- </Form.Field> -->

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

					if (!shsSelected) {
						$formData.strand_id = undefined;
					}
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

	<Form.Field {form} name="strand_id">
		<Form.Control let:attrs>
			<Form.Label class={!shsSelected ? 'text-muted-foreground' : ''}>Strand</Form.Label>
			<Select.Root
				onSelectedChange={(v) => {
					v && ($formData.strand_id = v.value);
				}}
				disabled={!shsSelected}
			>
				<Select.Trigger {...attrs}>
					<Select.Value placeholder="Select a strand" />
				</Select.Trigger>
				<Select.Content>
					{#each strands as strand (strand.id)}
						<Select.Item value={strand.id} label={strand.name} />
					{/each}
				</Select.Content>
			</Select.Root>
			<input hidden bind:value={$formData.strand_id} name={attrs.name} />
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<input hidden bind:value={$formData.student_status} name="student_status" />

	{#if studentStatus === StudentStatus.New}
		<Separator />

		<Form.Field {form} name="report_card">
			<Form.Control let:attrs>
				<Form.Label>Report Card</Form.Label>
				<Input
					{...attrs}
					type="file"
					accept="image/*"
					on:change={(e) => {
						$formData.report_card = e.currentTarget.files ? e.currentTarget.files[0] : undefined;
					}}
					required
				/>
			</Form.Control>
			<Form.Description>Your previous report card.</Form.Description>
			<Form.FieldErrors />
		</Form.Field>
	{/if}

	<Separator />

	<Form.Field {form} name="payment_method">
		<Form.Control let:attrs>
			<Form.Label>Payment Method</Form.Label>
			<Select.Root
				onSelectedChange={(v) => {
					v && ($formData.payment_method = v.value);
				}}
			>
				<Select.Trigger {...attrs}>
					<Select.Value placeholder="Select a payment method" />
				</Select.Trigger>
				<Select.Content>
					<Select.Item value="cash" label="Cash" />
					<Select.Item value="installment" label="Installment" />
				</Select.Content>
			</Select.Root>
			<input hidden bind:value={$formData.payment_method} name={attrs.name} />
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	{#if $formData.payment_method === 'installment'}
		<Form.Field {form} name="tuition_plan_id">
			<Form.Control let:attrs>
				<Form.Label>Tuition Plan</Form.Label>
				<Select.Root
					onSelectedChange={(v) => {
						v && ($formData.tuition_plan_id = v.value);
					}}
				>
					<Select.Trigger {...attrs}>
						<Select.Value placeholder="Select a tuition plan" />
					</Select.Trigger>
					<Select.Content>
						{#each tuitionPlans as tuitionPlan, idx (idx)}
							<Select.Item value={tuitionPlan.id} label={tuitionPlan.name} />
						{/each}
					</Select.Content>
				</Select.Root>
				<input hidden bind:value={$formData.tuition_plan_id} name={attrs.name} />
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>
	{/if}

	<Form.Field {form} name="transaction_number">
		<Form.Control let:attrs>
			<Form.Label>Transaction Number</Form.Label>
			<Input {...attrs} bind:value={$formData.transaction_number} />
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="payment_amount">
		<Form.Control let:attrs>
			<Form.Label>Payment Amount</Form.Label>
			<Input {...attrs} bind:value={$formData.payment_amount} type="number" />
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="payment_mode_id">
		<Form.Control let:attrs>
			<Form.Label>Payment Method</Form.Label>
			<Select.Root
				onSelectedChange={(v) => {
					v && ($formData.payment_mode_id = v.value);
				}}
			>
				<Select.Trigger {...attrs}>
					<Select.Value placeholder="Select a payment method" />
				</Select.Trigger>
				<Select.Content>
					{#each paymentModes as paymentMode (paymentMode.id)}
						<Select.Item value={paymentMode.id} label={paymentMode.payment_channel} />
					{/each}
				</Select.Content>
			</Select.Root>
			<input hidden bind:value={$formData.payment_mode_id} name={attrs.name} />
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="payment_receipt">
		<Form.Control let:attrs>
			<Form.Label>Payment Receipt</Form.Label>
			<!-- <Input {...attrs} bind:value={$formData.payment_receipt} type="file" accept="image/*" /> -->
			<Input
				{...attrs}
				type="file"
				accept="image/*"
				on:change={(e) => {
					$formData.payment_receipt = e.currentTarget.files ? e.currentTarget.files[0] : undefined;
				}}
			/>
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Button>Submit</Form.Button>
</form>
