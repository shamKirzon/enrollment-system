<script lang="ts">
	import { cn } from '$lib/utils';

	export let className: string;

	export { className as class };
</script>

<div class={cn(`max-w-7xl mx-auto sm:px-6 lg:px-8 py-12 flex w-full gap-2 h-full ${className}`)}>
	<slot />
</div>
