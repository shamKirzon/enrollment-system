<script lang="ts">
	import { Sidebar } from '$lib/components';
	import { Toaster } from '$lib/components/ui/sonner';
	import '../app.pcss';

	export let data;
</script>

<Toaster richColors />

{#if data.session && data.user}
	<Sidebar user={data.user} />
{/if}

<main class={`min-h-screen h-screen bg-gray-100 ${data.session ? 'pl-60' : ''}`}>
	<slot />
</main>
