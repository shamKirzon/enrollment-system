<script lang="ts">
	import { ContentLayout } from '$lib/components/layouts';
	import { buttonVariants } from '$lib/components/ui/button';
</script>

<ContentLayout class="flex-col">
	<div class="flex gap-1 items-center">
		<a href="/admin/sections" class={buttonVariants({ variant: 'default' })}> Sections </a>
		<a href="/admin/sections/assignments" class={buttonVariants({ variant: 'default' })}>
			Assignments
		</a>
	</div>

	<slot />
</ContentLayout>
