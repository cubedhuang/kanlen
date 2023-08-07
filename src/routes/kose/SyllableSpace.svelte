<script lang="ts">
	export let syllable: string;
	export let count: number;
</script>

<p
	class="px-2 py-1 flex gap-2 justify-between rounded-xl
		{count === 0 ? 'bg-gray-300' : 'bg-green-200'}"
>
	{syllable}

	<span class="text-gray-500 tabular-nums">
		{count}
	</span>
</p>
