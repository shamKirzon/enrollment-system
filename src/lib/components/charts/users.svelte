<script lang="ts">
	import { capitalizeFirstLetter } from '$lib';
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
						backgroundColor: ['rgb(255, 99, 132)', 'rgb(54, 162, 235)', 'rgb(255, 205, 86)'],
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
