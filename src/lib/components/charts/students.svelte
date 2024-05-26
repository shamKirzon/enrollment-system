<script lang="ts">
	import { COLORS, getGradient } from '$lib';
	import type { AcademicYearWithStudentCount } from '$lib/types/enrollment';
	import { Chart, registerables, type ChartArea } from 'chart.js';
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
						fill: true,
						backgroundColor: (context) => {
							const { chart } = context;
							const { ctx, chartArea } = chart;

							if (!chartArea) return;

							return getGradient(ctx, chartArea, COLORS.secondary(0.5));
						},
						borderColor: COLORS.secondary(0.6)
					}
				]
			},
			options: {
				responsive: true,
				plugins: {
					legend: {
						display: false
					}
				},
				scales: {
					y: {
						min: 0,
						suggestedMax: 3
					}
				}
			}
		});
	});
</script>

<div>
	<canvas bind:this={canvasEl}> </canvas>
</div>
