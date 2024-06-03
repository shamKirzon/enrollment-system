<script lang="ts">
	import { pcsAnnex, pcsBgBrown, pcsLogo } from '$lib/assets/images';
	import { LoginForm } from '$lib/components/forms';
	import { GuestLayout } from '$lib/components/layouts';
	import * as Card from '$lib/components/ui/card';

	export let data;
</script>

<GuestLayout>
	<div class="flex h-full flex-1 text-foreground sm:px-6 lg:px-8 py-12  justify-center items-center">
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
