<script lang="ts">
	import * as Drawer from '$lib/components/ui/drawer';

	export let studentName: string;
	export let paymentReceiptUrl: string;
	export let isOpen: boolean = false;
</script>

<Drawer.Root shouldScaleBackground bind:open={isOpen}>
	<Drawer.Content class="max-h-[75svh] h-full">
		<Drawer.Header>
			<Drawer.Title>Enrollment</Drawer.Title>
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
