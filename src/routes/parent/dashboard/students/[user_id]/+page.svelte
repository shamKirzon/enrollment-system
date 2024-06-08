<script lang="ts">
	import { ContentLayout } from '$lib/components/layouts';
	import { TabsStudent } from '$lib/components/tabs';
	import { setContext } from 'svelte';
	import { ProfileStudent } from '$lib/components/profiles';

	export let data;

	$: setContext('gradesForm', data.gradesForm);
</script>

<ContentLayout class="flex-col xl:flex-row">
	<ProfileStudent
		props={{
			familyMembers: data.studentFamilyMembers,
			profile: data.studentProfile,
			user: data.studentUserData
		}}
	/>

	<div class="flex flex-col gap-2 flex-[2_2_0%] h-full">
		<TabsStudent
			props={{
				selected: data.tab,
				user: data?.user,
				studentId: data.studentId,
				yearLevels: data.yearLevels,
				subjectGrades: data.studentGrades,
				studentEnrollments: data.studentEnrollments,
				studentTransactions: data.studentTransactions,
				selectedYearLevel: data.yearLevelId
			}}
		/>
	</div>
</ContentLayout>
