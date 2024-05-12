<script lang="ts">
	import * as Table from '$lib/components/ui/table';
	import * as Card from '$lib/components/ui/card';
</script>

<Card.Root>
	<Card.Header>
		<Card.Title>Academic Years</Card.Title>
		<Card.Description>Your previously enrolled academic years.</Card.Description>
	</Card.Header>
	<Card.Content>
		<Table.Root>
			<Table.Header>
				<Table.Row>
					<Table.Head>Year</Table.Head>
					<Table.Head>Level</Table.Head>
					<Table.Head>Section</Table.Head>
					<Table.Head>Tuition Plan</Table.Head>
					<Table.Head>Enrollment Status</Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				<Table.Row>
					<Table.Cell class="font-medium">year</Table.Cell>
					<Table.Cell>Level</Table.Cell>
					<Table.Cell>Section</Table.Cell>
					<Table.Cell>A</Table.Cell>
					<Table.Cell>badge</Table.Cell>
				</Table.Row>
			</Table.Body>
		</Table.Root>
	</Card.Content>
</Card.Root>
