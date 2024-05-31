<script lang="ts">
	import { YearLevelCombobox } from '$lib/components/combobox';
	import { ContentLayout } from '$lib/components/layouts';
	import { goto } from '$app/navigation';
	import * as Tabs from '$lib/components/ui/tabs';
	import { Semester } from '$lib/types/enrollment';

	export let data;

	console.log(data.yearLevels);

	function updateSemester(semester: number) {
		const url = new URL(window.location.href);
		const params = new URLSearchParams(url.search);

		params.set('semester', semester.toString());

		goto(`${url.pathname}?${params.toString()}`);
	}
</script>

<ContentLayout class="flex-col">
	<div class="flex items-center gap-2 justify-between">
		<YearLevelCombobox yearLevels={data.yearLevels || []} includeSemester={true} />

		<Tabs.Root value={Semester.First}>
			<Tabs.List class="bg-background border shadow-sm">
				<Tabs.Trigger on:click={() => updateSemester(1)} value={Semester.First} class="data-[state=active]:bg-muted data-[state=active]:text-secondary-foreground">
					1st Semester
				</Tabs.Trigger>
				<Tabs.Trigger on:click={() => updateSemester(2)} value={Semester.Second} class="data-[state=active]:bg-muted data-[state=active]:text-secondary-foreground">
					2nd Semester
				</Tabs.Trigger>
			</Tabs.List>
		</Tabs.Root>
	</div>
</ContentLayout>
