<script lang="ts">
	import { Button } from '$lib/components/ui/button';

	export let url: string;
	export let label: string;
</script>

<Button variant="link" class="p-0 h-auto underline text-amber-700" href={url}>
	{label}
</Button>
