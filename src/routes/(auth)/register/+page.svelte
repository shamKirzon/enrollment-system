<script lang="ts">
	import { RegisterForm } from '$lib/components/forms';
	import { GuestLayout } from '$lib/components/layouts';
	import * as Card from '$lib/components/ui/card';
	import { family, officeWork } from '$lib/assets/images';

	export let data;
</script>

<GuestLayout>
	<div class="flex flex-col flex-1 sm:px-6 lg:px-8 py-12 h-full gap-2">
		<div class="flex flex-col h-full gap-2 items-center justify-center">
			<h2 class="text-2xl md:text-3xl lg:text-4xl font-inter-bold text-center">I am a...</h2>
			<a
				href="/register/parent"
				class="bg-background px-10 py-6 text-foreground  shadow rounded-lg border flex flex-col gap-2 items-center w-full max-w-xl transition-all ease-in-out hover:bg-secondary/5 hover:border-secondary/50"
			>
				<img src={family} alt="Family" class="w-60" />

				<p class="font-inter-semibold">Parent enrolling for my child</p>
			</a>

			<a
				href="/register/student"
				class="bg-background px-10 py-6 text-foreground  shadow rounded-lg border flex flex-col gap-2 items-center w-full max-w-xl transition-all ease-in-out hover:bg-secondary/5 hover:border-secondary/50"
			>
				<img src={officeWork} alt="Student" class="w-60" />

				<p class="font-inter-semibold">Student enrolling for myself</p>
			</a>
			<!-- <a href="/register/parent" class="bg-background px-10 py-6 text-foreground font-inter-medium shadow rounded-lg border flex flex-col gap-2 items-center w-full"> -->
			<!-- 	<img src={family} alt="Family" /> -->
			<!---->
			<!-- 	A parent enrolling for my child -->
			<!-- </a> -->

			<!-- <Card.Root class="w-full max-w-md"> -->
			<!-- 	<Card.Header> -->
			<!-- 		<Card.Title class="text-2xl">Register</Card.Title> -->
			<!-- 		<Card.Description>Enter your details below to create an account.</Card.Description> -->
			<!-- 	</Card.Header> -->
			<!-- 	<Card.Content class="grid gap-4"> -->
			<!-- 		<RegisterForm data={data.form} /> -->
			<!-- 	</Card.Content> -->
			<!-- </Card.Root> -->
		</div>
	</div>
</GuestLayout>
