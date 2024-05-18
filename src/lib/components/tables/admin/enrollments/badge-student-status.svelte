<script lang="ts">
	import { Badge } from '$lib/components/ui/badge';

	export let name: string;
</script>

<div class="space-x-1">
	<span>
		{name}
	</span>
	<Badge class={`text-xs`}>New</Badge>
</div>
