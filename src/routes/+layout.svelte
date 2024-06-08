<script lang="ts">
	import { Toaster } from '$lib/components/ui/sonner';
	import { Sidebar } from '$lib/components';
	import '../app.pcss';
	import { LayoutAuthenticated, GuestLayout, LayoutDrawerScale } from '$lib/components/layouts';

	export let data;

	console.log(data);
</script>

<LayoutDrawerScale>
	<Toaster richColors closeButton />

	{#if data.session && data.user}
		<Sidebar user={data.user} />
	{/if}

	<main class={`h-full min-h-screen bg-primary/5 ${data.session ? 'px-4 md:pl-64' : ''}`}>
		{#if data.session && data.user}
			<LayoutAuthenticated user={data.user}>
				<slot />
			</LayoutAuthenticated>
		{:else}
			<GuestLayout>
				<slot />
			</GuestLayout>
		{/if}
	</main>
</LayoutDrawerScale>
