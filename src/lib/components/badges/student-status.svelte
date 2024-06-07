<script lang="ts">
	import { capitalizeFirstLetter } from '$lib';
	import { Badge } from '$lib/components/ui/badge';

	export let status: 'old' | 'new' = 'new';
</script>

<Badge class={`text-xs`} variant={status === 'new' ? 'default' : 'secondary'}>{capitalizeFirstLetter(status)}</Badge>
