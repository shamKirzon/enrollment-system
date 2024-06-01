<script lang="ts">
	import { ContentLayout } from '$lib/components/layouts';
	import * as Card from '$lib/components/ui/card';
	import * as Avatar from '$lib/components/ui/avatar';
	import { capitalizeFirstLetter, formatName } from '$lib';
	import * as Tabs from '$lib/components/ui/tabs';
	import { TableEnrollment } from '$lib/components/tables';
	import { Pagination } from '$lib/components/index.js';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	export let data;

	const initials = `${data.studentUserData.first_name[0].toUpperCase()}${data.studentUserData.last_name[0].toUpperCase()}`;

	const name = formatName({
		last_name: data.studentUserData.last_name,
		first_name: data.studentUserData.first_name,
		middle_name: data.studentUserData.middle_name,
		suffix_name: data.studentUserData.suffix_name
	});

	let tabs = ['enrollments', 'transactions', 'grades'];

	function replaceSearchParam(k: string, v: string | number) {
		let query = new URLSearchParams($page.url.searchParams.toString());

		query.set(k, v.toString());

		goto(`?${query.toString()}`);
	}
</script>

<ContentLayout>
	<Card.Root class="h-full">
		<Card.Header class="items-center w-full">
			<!-- <Card.Title>Card Title</Card.Title> -->
			<!-- <Card.Description>Card Description</Card.Description> -->
			<Avatar.Root class="w-40 h-40">
				<Avatar.Image src={data.studentUserData.avatar_url} alt="@shadcn" />
				<Avatar.Fallback class="text-3xl">{initials}</Avatar.Fallback>
			</Avatar.Root>
		</Card.Header>
		<Card.Content>
			<h2 class="font-bold text-center">
				{name}
			</h2>
			<br />

			<h3 class="font-bold">Personal</h3>
			<p>Sex: {capitalizeFirstLetter(data.studentProfile.sex)}</p>
			<p>LRN: {data.studentProfile.lrn}</p>
			<p>Birth Date: {data.studentProfile.birth_date}</p>
			<p>Birth Place: {data.studentProfile.birth_place}</p>
			<p>Citizenship: {data.studentProfile.citizenship}</p>
			<p>Address: {data.studentProfile.city}</p>
			<p>Religion: {data.studentProfile.religion}</p>

			<br />
			<h3 class="font-bold">Family</h3>

			{#each data.studentFamilyMembers as { first_name, middle_name, last_name, suffix_name, ...familyMember } (familyMember.id)}
				{@const familyMemberName = formatName({ first_name, middle_name, last_name, suffix_name })}

				<p>Name: {familyMemberName}</p>
				<p>Relationship: {familyMember.relationship}</p>
				<p>Occupation: {familyMember.occupation}</p>
			{/each}
		</Card.Content>
	</Card.Root>

	<div class="flex flex-col gap-2 flex-[2_2_0%] h-full">
		<Tabs.Root value={tabs[0]}>
			<Tabs.List class="bg-background border shadow-sm">
				{#each tabs as tab (tab)}
					<Tabs.Trigger
						on:click={() => replaceSearchParam('tab', tab)}
						value={tab}
						class="data-[state=active]:bg-muted data-[state=active]:text-secondary-foreground"
					>
						{capitalizeFirstLetter(tab)}
					</Tabs.Trigger>
				{/each}
			</Tabs.List>

			{#each tabs as tab (tab)}
				<Tabs.Content value={tab}>
					{#if tab === 'enrollments'}
						<Card.Root class="w-full h-full">
							<Card.Header>
								<Card.Title>Enrollments</Card.Title>
								<Card.Description>Previously enrolled academic years.</Card.Description>
							</Card.Header>

							<Card.Content>
								<TableEnrollment enrollments={data.studentEnrollments.academic_year_enrollments} />
							</Card.Content>
						</Card.Root>
					{/if}
				</Tabs.Content>
			{/each}
		</Tabs.Root>

		<Pagination count={data.studentEnrollments.count} />
	</div>
</ContentLayout>
