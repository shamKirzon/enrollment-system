<script lang="ts">
	import { family, officeWork } from '$lib/assets/images';
</script>

<div class="flex flex-col flex-1 sm:px-6 lg:px-8 py-12 h-full gap-2">
	<div class="flex flex-col h-full gap-2 items-center justify-center">
		<h2 class="text-2xl md:text-3xl lg:text-4xl font-inter-bold text-center">I am a...</h2>
		<a
			href="/register/parent"
			class="bg-background px-10 py-6 text-foreground shadow rounded-lg border flex flex-col gap-2 items-center w-full max-w-xl transition-all ease-in-out hover:bg-secondary/5 hover:border-secondary/50"
		>
			<img src={family} alt="Family" class="w-60" />

			<p class="font-inter-semibold">Parent enrolling for my child</p>
		</a>

		<a
			href="/register/student"
			class="bg-background px-10 py-6 text-foreground shadow rounded-lg border flex flex-col gap-2 items-center w-full max-w-xl transition-all ease-in-out hover:bg-secondary/5 hover:border-secondary/50"
		>
			<img src={officeWork} alt="Student" class="w-60" />

			<p class="font-inter-semibold">Student enrolling for myself</p>
		</a>
	</div>
</div>
