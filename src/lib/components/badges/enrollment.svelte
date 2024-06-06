<script lang="ts">
	import { capitalizeFirstLetter } from '$lib';
	import { Badge } from '$lib/components/ui/badge';
	import type { EnrollmentStatus } from '$lib/types/enrollment';
	import { enrollmentStatusMap } from '../tables/admin/enrollments/utils';

	export let value: EnrollmentStatus;

	$: status = enrollmentStatusMap.get(value);
</script>

<Badge class={`text-xs space-x-1 ${status?.color}`} variant={status?.variant}>
	<svelte:component this={status?.icon} />
	<span>
		{capitalizeFirstLetter(value)}
	</span>
</Badge>
