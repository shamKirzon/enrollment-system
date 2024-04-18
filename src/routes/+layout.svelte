<script lang="ts">
	import { Toaster } from '$lib/components/ui/sonner';
	import '../app.pcss';
</script>

<Toaster richColors />

<main>
	<slot />
</main>
