<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import * as Avatar from '$lib/components/ui/avatar';
	import type { User } from '$lib/types/user';
	import { formatName } from '$lib';
	import * as Table from '$lib/components/ui/table';
	import { format } from 'date-fns';

	export let props: {
		user: User;
	};

	$: ({ user } = props);

	$: name = formatName({
		last_name: user.last_name,
		first_name: user.first_name,
		middle_name: user.middle_name,
		suffix_name: user.suffix_name
	});

	$: initials = `${user.first_name[0].toUpperCase()}${user.last_name[0].toUpperCase()}`;
</script>

<Card.Root class="h-full w-96">
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
					<Table.Cell class="line-clamp-1">{user.email}</Table.Cell>
				</Table.Row>
				<Table.Row>
					<Table.Head>Contact Number</Table.Head>
					<Table.Cell>{user.contact_number}</Table.Cell>
				</Table.Row>
				<Table.Row>
					<Table.Head>Registered At</Table.Head>
					<Table.Cell>{format(user.created_at, 'MMMM d, yyyy - h:mm a')}</Table.Cell>
				</Table.Row>
			</Table.Body>
		</Table.Root>
	</Card.Content>
</Card.Root>
