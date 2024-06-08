<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import * as Avatar from '$lib/components/ui/avatar';
	import type { StudentFamilyMember, StudentProfile, User } from '$lib/types/user';
	import { capitalizeFirstLetter, formatName } from '$lib';
	import * as Table from '$lib/components/ui/table';
	import { format } from 'date-fns';

	export let props: {
		profile: StudentProfile;
		user: User;
		familyMembers: StudentFamilyMember[];
	};

	$: ({ profile, user, familyMembers } = props);

	$: name = formatName({
		last_name: user.last_name,
		first_name: user.first_name,
		middle_name: user.middle_name,
		suffix_name: user.suffix_name
	});

	$: initials = `${user.first_name[0].toUpperCase()}${user.last_name[0].toUpperCase()}`;
</script>

<Card.Root class="h-full w-full xl:w-96">
	<Card.Header class="items-center w-full">
		<!-- <Card.Title>Card Title</Card.Title> -->
		<!-- <Card.Description>Card Description</Card.Description> -->
		<Avatar.Root class="w-40 h-40">
			<Avatar.Image src={user.avatar_url} alt="Avatar" />
			<Avatar.Fallback class="text-3xl">{initials}</Avatar.Fallback>
		</Avatar.Root>

		<h2 class="font-inter-bold text-center text-xl">
			{name}
		</h2>
	</Card.Header>

	<Card.Content class="space-y-4">
		<Table.Root>
			<Table.Header>
				<Table.Row>
					<Table.Head class="w-40">Name</Table.Head>
					<Table.Cell>{name}</Table.Cell>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				<Table.Row>
					<Table.Head>Email</Table.Head>
					<Table.Cell>{user.email}</Table.Cell>
				</Table.Row>
				<Table.Row>
					<Table.Head>Contact Number</Table.Head>
					<Table.Cell>{user.contact_number}</Table.Cell>
				</Table.Row>
				<Table.Row>
					<Table.Head>Registered At</Table.Head>
					<Table.Cell>{format(user.created_at, 'MMMM d, yyyy - h:mm a')}</Table.Cell>
				</Table.Row>
				<Table.Row>
					<Table.Head>Sex</Table.Head>
					<Table.Cell>{capitalizeFirstLetter(profile.sex)}</Table.Cell>
				</Table.Row>
				<Table.Row>
					<Table.Head>
						<a
							href="https://www.teachpinas.com/deped-lrn-learner-reference-number/"
							target="_blank"
							rel="noreferrer"
							class="underline">LRN</a
						>
					</Table.Head>
					<Table.Cell>{profile.lrn}</Table.Cell>
				</Table.Row>
				<Table.Row>
					<Table.Head>Birth Date</Table.Head>
					<Table.Cell>{profile.birth_date}</Table.Cell>
				</Table.Row>
				<Table.Row>
					<Table.Head>Birth Place</Table.Head>
					<Table.Cell>{profile.birth_place}</Table.Cell>
				</Table.Row>
				<Table.Row>
					<Table.Head>Citizenship</Table.Head>
					<Table.Cell>{profile.citizenship}</Table.Cell>
				</Table.Row>
				<Table.Row>
					<Table.Head>Address</Table.Head>
					<Table.Cell>{profile.city}</Table.Cell>
				</Table.Row>
				<Table.Row>
					<Table.Head>Religion</Table.Head>
					<Table.Cell>{profile.religion}</Table.Cell>
				</Table.Row>
				<Table.Row>
					<Table.Head>Birth Certificate</Table.Head>
					<Table.Cell>
						<a
							href={profile.birth_certificate_url}
							target="_blank"
							rel="noreferrer"
							class="underline line-clamp-1">{profile.birth_certificate_url}</a>
					</Table.Cell>
				</Table.Row>
				<Table.Row>
					<Table.Head>Baptismal Certificate</Table.Head>
					<Table.Cell>
						<a
							href={profile.baptismal_certificate_url}
							target="_blank"
							rel="noreferrer"
							class="underline line-clamp-1">{profile.baptismal_certificate_url}</a>
					</Table.Cell>
				</Table.Row>
			</Table.Body>
		</Table.Root>

		<!-- {#each familyMembers as { first_name, middle_name, last_name, suffix_name, ...familyMember } (familyMember.id)} -->
		<!-- 	{@const familyMemberName = formatName({ first_name, middle_name, last_name, suffix_name })} -->
		<!---->
		<!-- 	<Table.Root> -->
		<!-- 		<Table.Header> -->
		<!-- 			<Table.Row> -->
		<!-- 				<Table.Head class="w-28 text-foreground font-inter-semibold">Family</Table.Head> -->
		<!-- 			</Table.Row> -->
		<!-- 		</Table.Header> -->
		<!-- 		<Table.Body> -->
		<!-- 			<Table.Row> -->
		<!-- 				<Table.Head>Name</Table.Head> -->
		<!-- 				<Table.Cell>{familyMemberName}</Table.Cell> -->
		<!-- 			</Table.Row> -->
		<!-- 			<Table.Row> -->
		<!-- 				<Table.Head>Relationship</Table.Head> -->
		<!-- 				<Table.Cell>{familyMember.relationship}</Table.Cell> -->
		<!-- 			</Table.Row> -->
		<!-- 			<Table.Row> -->
		<!-- 				<Table.Head>Occupation</Table.Head> -->
		<!-- 				<Table.Cell>{familyMember.occupation}</Table.Cell> -->
		<!-- 			</Table.Row> -->
		<!-- 		</Table.Body> -->
		<!-- 	</Table.Root> -->
		<!-- {/each} -->
	</Card.Content>
</Card.Root>
