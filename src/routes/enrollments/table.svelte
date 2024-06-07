<script lang="ts">
	import type { EnrollmentFeeLevelDetails } from '$lib/types/enrollment';
	import * as Table from '$lib/components/ui/table';

	export let data: EnrollmentFeeLevelDetails[];

// Extract unique year levels
  let yearLevels = [...new Set(data.map(fee => fee.year_level_name))];

  // Group data by fee name
  let groupedData = data.reduce((acc, fee) => {
    if (!acc[fee.enrollment_fee_name]) {
      acc[fee.enrollment_fee_name] = {};
    }
    acc[fee.enrollment_fee_name][fee.year_level_name] = fee.amount;
    return acc;
  }, {});
</script>

<!-- <Table.Root> -->
<!--   <Table.Header> -->
<!--     <Table.Row> -->
<!--       <Table.Head>Name</Table.Head> -->
<!--       {#each yearLevels as yearLevel} -->
<!--         <Table.Head>{yearLevel}</Table.Head> -->
<!--       {/each} -->
<!--     </Table.Row> -->
<!--   </Table.Header> -->
<!--   <Table.Body> -->
<!--     {#each Object.entries(groupedData) as [name, amounts]} -->
<!--       <Table.Row> -->
<!--         <Table.Cell>{name}</Table.Cell> -->
<!--         {#each yearLevels as yearLevel} -->
<!--           <Table.Cell>{amounts[yearLevel] || '-'}</Table.Cell> -->
<!--         {/each} -->
<!--       </Table.Row> -->
<!--     {/each} -->
<!--   </Table.Body> -->
<!-- </Table.Root> -->

<Table.Root>
	<Table.Header>
		<Table.Row>
			<Table.Head>Name</Table.Head>
			<Table.Head>Amount</Table.Head>
			<Table.Head>Year Level</Table.Head>
		</Table.Row>
	</Table.Header>
	<Table.Body>
		{#each data as fee (fee.enrollment_fee_level_id)}
			<Table.Row>
				<Table.Cell>{fee.enrollment_fee_name}</Table.Cell>
				<Table.Cell>{fee.amount}</Table.Cell>
				<Table.Cell>{fee.year_level_name}</Table.Cell>
			</Table.Row>
		{/each}
	</Table.Body>
</Table.Root>
