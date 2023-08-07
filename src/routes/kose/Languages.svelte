<script lang="ts">
	import type { WordData } from '$lib/types';

	import Separator from './Separator.svelte';
	import Table from './Table.svelte';

	export let words: WordData[];

	$: languageGroups = words.reduce((acc, word) => {
		const name = word.originLanguage;

		if (acc.has(name)) {
			acc.get(name)!.push(word.word);
		} else {
			acc.set(name, [word.word]);
		}

		return acc;
	}, new Map<string, string[]>());
</script>

<Separator>languages</Separator>
<Table items={languageGroups} />
