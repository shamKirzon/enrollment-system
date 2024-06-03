<script lang="ts">
	import { pcsLogo } from '$lib/assets/images';
	import { cn } from '$lib/utils';

	export let className: string;

	export { className as class };
</script>

<div class={cn(`flex justify-center items-center min-h-screen h-screen ${className}`)}>
	<div
		class="h-full flex flex-col flex-1 relative bg-pcs-bg-brown bg-cover bg-center justify-center items-center gap-4"
	>
		<!-- <img src={pcsBgBrown} alt="PCS backgorund" class="object-cover"> -->
		<img src={pcsLogo} alt="PCS logo" class="w-40 h-40" />
		<div>
			<p class="text-4xl text-background font-inter-semibold">Pateros Catholic School</p>
			<p class="text-background tracking-widest text-center">Men and Women of Noble Character</p>
		</div>

		<!-- <img src={pcsAnnex} alt="PCS Annex" class="absolute left-0 bottom-0 w-3/4" /> -->
	</div>
	<slot />
</div>
