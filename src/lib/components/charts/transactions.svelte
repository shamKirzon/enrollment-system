<script lang="ts">
	import { COLORS, getGradient } from '$lib';
	import type { TransactionYearly } from '$lib/types/payment';
	import { Chart, registerables } from 'chart.js';
	import { format } from 'date-fns';
	import { onMount } from 'svelte';

	export let data: TransactionYearly[];

	let canvasEl: HTMLCanvasElement;

	Chart.register(...registerables);

	onMount(() => {
		new Chart(canvasEl, {
			type: 'line',
			data: {
				labels: data.map(
					(t) =>
						`${format(t.academic_year_start_at, 'yyyy')}-${format(t.academic_year_end_at, 'yyyy')}`
				),
				datasets: [
					{
						label: 'Transactions',
						data: data.map((t) => t.total_payment_amount),
						fill: true,
						backgroundColor: (context) => {
							const { chart } = context;
							const { ctx, chartArea } = chart;

							if (!chartArea) return;

							return getGradient(ctx, chartArea, COLORS.secondary(0.5));
						},
						borderColor: COLORS.secondary(0.6),
						pointBackgroundColor: COLORS.secondary(1)
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
						suggestedMax: 10000
					}
				}
			}
		});
	});
</script>

<div>
	<canvas bind:this={canvasEl}> </canvas>
</div>
