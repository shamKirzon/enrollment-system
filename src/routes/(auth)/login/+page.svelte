<script lang="ts">
	import { pcsAnnex, pcsBgBrown, pcsLogo } from '$lib/assets/images';
	import { LoginForm } from '$lib/components/forms';
	import { GuestLayout } from '$lib/components/layouts';
	import * as Card from '$lib/components/ui/card';

	export let data;
</script>

<GuestLayout>
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

	<div class="flex h-full flex-1 text-foreground p-4 justify-center items-center">
		<Card.Root class="w-full max-w-xl">
			<Card.Header>
				<Card.Title class="text-4xl font-inter-semibold">Login</Card.Title>
				<Card.Description>Enter your email and password.</Card.Description>
			</Card.Header>
			<Card.Content class="grid gap-4">
				<LoginForm data={data.form} />
			</Card.Content>
		</Card.Root>
	</div>
</GuestLayout>
