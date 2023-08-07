<script lang="ts">
	import type { WordData } from '$lib/types';

	import Separator from './Separator.svelte';
	import Table from './Table.svelte';

	export let words: WordData[];

	$: posGroups = words.reduce((acc, word) => {
		const partsOfSpeech = word.pos;

		for (const pos of partsOfSpeech) {
			if (acc.has(pos)) {
				acc.get(pos)!.push(word.word);
			} else {
				acc.set(pos, [word.word]);
			}
		}

		return acc;
	}, new Map<string, string[]>());
</script>

<Separator>parts of speech</Separator>
<Table items={posGroups} />
