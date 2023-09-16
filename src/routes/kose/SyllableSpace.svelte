<script lang="ts">
	export let syllable: string;
	export let count: number;
	export let maxCount: number;
</script>

<p
	class="px-2 py-1 flex gap-2 justify-between rounded-xl {!count
		? 'bg-gray-100 text-gray-500'
		: ''}"
	style:background={count
		? `hsl(120, 50%, ${90 - (count / maxCount) * 40}%)`
		: ''}
>
	{syllable}

	{#if count}
		<span class="tabular-nums">
			{count}
		</span>
	{/if}
</p>
