<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Drawer from '$lib/components/ui/drawer';

	export let paymentReceiptUrl: string;
	export let studentName: string;
</script>

<!-- <Dialog.Root> -->
<!-- 	<Dialog.Trigger> -->
<!-- 		<p class="line-clamp-1 max-w-40 text-start underline text-blue-600"> -->
<!-- 			{paymentReceiptUrl} -->
<!-- 		</p> -->
<!-- 	</Dialog.Trigger> -->
<!-- 	<Dialog.Content> -->
<!-- 		<Dialog.Header> -->
<!-- 			<Dialog.Title>Payment Receipt</Dialog.Title> -->
<!-- 			<Dialog.Description>{studentName}</Dialog.Description> -->
<!-- 		</Dialog.Header> -->
<!---->
<!-- 		<img src={paymentReceiptUrl} alt="Payment Receipt" class="object-cover w-full rounded-md" /> -->
<!-- 	</Dialog.Content> -->
<!-- </Dialog.Root> -->

<Drawer.Root shouldScaleBackground>
	<Drawer.Trigger>Open</Drawer.Trigger>
	<Drawer.Content class="max-h-[75svh] h-full">
		<Drawer.Header>
			<Drawer.Title>Payment Receipt</Drawer.Title>
			<Drawer.Description>{studentName}</Drawer.Description>
		</Drawer.Header>
		<!-- <Drawer.Footer> -->
		<!--   <Button>Submit</Button> -->
		<!--   <Drawer.Close>Cancel</Drawer.Close> -->
		<!-- </Drawer.Footer> -->

		<div class="max-w-40">
			<img src={paymentReceiptUrl} alt="Payment Receipt" class="object-cover w-full rounded-md" />
		</div>
	</Drawer.Content>
</Drawer.Root>
