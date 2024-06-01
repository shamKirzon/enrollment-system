<script lang="ts">
	import { ContentLayout } from '$lib/components/layouts';
	import * as Card from '$lib/components/ui/card';
	import * as Avatar from '$lib/components/ui/avatar';
	import { capitalizeFirstLetter, formatName } from '$lib';

	export let data;

	const initials = `${data.studentUserData.first_name[0].toUpperCase()}${data.studentUserData.last_name[0].toUpperCase()}`;

	const name = formatName({
		last_name: data.studentUserData.last_name,
		first_name: data.studentUserData.first_name,
		middle_name: data.studentUserData.middle_name,
		suffix_name: data.studentUserData.suffix_name
	});
</script>

<ContentLayout>
	<Card.Root>
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
</ContentLayout>
