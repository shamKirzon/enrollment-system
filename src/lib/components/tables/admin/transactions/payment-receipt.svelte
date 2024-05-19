<script lang="ts">
	export let paymentReceiptUrl: string;
</script>

<a
	class="line-clamp-1 max-w-40 text-start underline text-blue-600"
	href={paymentReceiptUrl}
	target="_blank"
	rel="noreferrer"
>
	{paymentReceiptUrl}
</a>
