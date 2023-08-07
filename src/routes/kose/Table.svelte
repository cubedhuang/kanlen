<script lang="ts">
	import { selectedWord } from './selectedWord';

	export let items: Map<string, string[]>;

	$: sorted = [...items.entries()].sort((a, b) => a[0].localeCompare(b[0]));
</script>

<table class="w-full">
	{#each sorted as [title, words]}
		<tr class="border-b-2 last:border-0">
			<th class="py-1 font-semibold text-left align-text-top">
				{title}
			</th>

			<td class="pr-2 py-1 text-right align-text-top text-gray-500">
				{words.length}
			</td>

			<td class="pl-2 py-1 border-l-2 align-text-top">
				<ul class="flex flex-wrap gap-x-2">
					{#each words as word}
						<li>
							<button
								class="link font-normal"
								on:click={() => {
									if ($selectedWord === word) {
										$selectedWord = '';
									} else {
										$selectedWord = word;
									}
								}}
							>
								{word}
							</button>
						</li>
					{/each}
				</ul>
			</td>
		</tr>
	{/each}
</table>
