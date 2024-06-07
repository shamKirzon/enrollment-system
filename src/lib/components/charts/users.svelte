<script lang="ts">
	import { COLORS, capitalizeFirstLetter } from '$lib';
	import type { UserCount } from '$lib/types/user';
	import { Chart, registerables } from 'chart.js';
	import { onMount } from 'svelte';

	export let data: UserCount[];

	let usersEl: HTMLCanvasElement;

	Chart.register(...registerables);

	onMount(() => {
		new Chart(usersEl, {
			type: 'doughnut',
			data: {
				labels: data.map((u) => capitalizeFirstLetter(u.role)),
				datasets: [
					{
						label: 'Users',
						data: data.map((u) => u.value),
						backgroundColor: [COLORS.secondary(), COLORS.amber2(), COLORS.amber()],
						hoverOffset: 4
					}
				]
			}
		});
	});
</script>

<div>
	<canvas bind:this={usersEl}> </canvas>
</div>
