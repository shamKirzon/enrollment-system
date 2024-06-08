<script lang="ts">
	import { ContentLayout } from '$lib/components/layouts';
	import DataTable from './data-table.svelte';
	import * as Card from '$lib/components/ui/card';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import CirclePlusOutline from 'virtual:icons/flowbite/circle-plus-outline';
	import { ProfileParent } from '$lib/components/profiles';

	export let data;
</script>

<ContentLayout class="flex-col xl:flex-row">
	<ProfileParent props={{ user: data.user }} />

	<div class="flex flex-col gap-2 flex-[2_2_0%] h-full">
		<Card.Root class="w-full">
			<Card.Header class="flex flex-row items-center justify-between">
				<div>
					<Card.Title>Students</Card.Title>
					<Card.Description>Your registered children</Card.Description>
				</div>

				<a href="/parent/dashboard/add-student" class={`${buttonVariants({ variant: 'default' })} space-x-1`}>
					<CirclePlusOutline />
					<span>Create</span>
				</a>
			</Card.Header>
			<Card.Content>
				<DataTable data={data.students} />
			</Card.Content>
		</Card.Root>
	</div>
</ContentLayout>
