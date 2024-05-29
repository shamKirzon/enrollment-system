<script lang="ts">
	import { cn } from '$lib/utils';

	export let className: string;

	export { className as class };
</script>

<div
	class={cn(
		`flex justify-center items-center min-h-screen bg-pcs-bg-brown bg-center bg-cover ${className}`
	)}
>
	<slot />
</div>
