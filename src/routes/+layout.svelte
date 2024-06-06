<script lang="ts">
	import { Toaster } from '$lib/components/ui/sonner';
	import { Sidebar } from '$lib/components';
	import '../app.pcss';
	import { LayoutDrawerScale } from '$lib/components/layouts';

	export let data;

	console.log(data);
</script>

<LayoutDrawerScale>
	<Toaster richColors closeButton />

	{#if data.session && data.user}
		<Sidebar user={data.user} />
	{/if}

	<main class={`h-full min-h-screen bg-primary/5 ${data.session ? 'pl-60' : ''}`}>
		<!-- <div class="h-screen"> -->
		<slot />
		<!-- </div> -->
	</main>
</LayoutDrawerScale>
