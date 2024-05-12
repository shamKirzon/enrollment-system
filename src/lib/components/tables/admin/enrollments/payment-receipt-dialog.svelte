<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';

	export let paymentReceiptUrl: string;
	export let studentName: string;
</script>

<Dialog.Root>
	<Dialog.Trigger>
		<p class="line-clamp-1 max-w-40 text-start underline text-blue-600">
			{paymentReceiptUrl}
		</p>
	</Dialog.Trigger>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Payment Receipt</Dialog.Title>
			<Dialog.Description>{studentName}</Dialog.Description>
		</Dialog.Header>

		<img src={paymentReceiptUrl} alt="Payment Receipt" class="object-cover w-full rounded-md" />
	</Dialog.Content>
</Dialog.Root>
