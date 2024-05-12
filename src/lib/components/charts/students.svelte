<script lang="ts">
	import { COLORS } from '$lib';
	import type { AcademicYearWithStudentCount } from '$lib/types/enrollment';
	import { Chart, registerables } from 'chart.js';
	import { format } from 'date-fns';
	import { onMount } from 'svelte';

	export let data: AcademicYearWithStudentCount[];

	let canvasEl: HTMLCanvasElement;

	Chart.register(...registerables);

	onMount(() => {
		new Chart(canvasEl, {
			type: 'line',
			data: {
				labels: data
					.sort((a, b) => new Date(a.start_at) - new Date(b.start_at))
					.map((ay) => `${format(ay.start_at, 'yyyy')}-${format(ay.end_at, 'yyyy')}`),
				datasets: [
					{
						label: 'Students',
						data: data.map((ay) => ay.student_count),
						backgroundColor: COLORS.secondary,
						borderColor: 'rgba(205, 127, 0, 0.4)'
					}
				]
			},
			options: {
				responsive: true,
				plugins: {
					legend: {
						display: false
					}
				}
			}
		});
	});
</script>

<div>
	<canvas bind:this={canvasEl}> </canvas>
</div>
