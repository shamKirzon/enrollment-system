<script lang="ts">
	import { cn } from '$lib/utils';

	export let className: string;

	export { className as class };
</script>

<div
	class={cn(`flex w-full gap-2 h-full ${className}`)}
>
	<slot />
</div>
