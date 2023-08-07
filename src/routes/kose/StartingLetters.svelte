<script lang="ts">
	import type { WordData } from '$lib/types';

	import Separator from './Separator.svelte';
	import Table from './Table.svelte';

	export let words: WordData[];

	$: startingLetterGroups = words.reduce((acc, word) => {
		const letter = word.word[0];

		if (acc.has(letter)) {
			acc.get(letter)!.push(word.word);
		} else {
			acc.set(letter, [word.word]);
		}

		return acc;
	}, new Map<string, string[]>());
</script>

<Separator>starting letters</Separator>
<Table items={startingLetterGroups} />
