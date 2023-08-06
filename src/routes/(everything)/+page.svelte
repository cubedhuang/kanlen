<script lang="ts">
	import Popup from '$lib/components/Popup.svelte';
	import WordDetails from '$lib/components/WordDetails.svelte';
	import type { WordData } from '$lib/types';

	export let data;

	let detailed = false;
	let search = '';

	$: searchNorm = search
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.toLowerCase()
		.trim();

	function scoreSearch(word: WordData) {
		let score = 0;

		if (word.word.includes(searchNorm)) score += 10;
		if (word.meaning.includes(searchNorm)) score += 5;
		if (word.pos.some(pos => pos.includes(searchNorm))) score += 5;
		if (word.originLanguage.includes(searchNorm)) score += 2;
		if (word.originWord.includes(searchNorm)) score += 2;
		if (word.originTransliteration.includes(searchNorm)) score += 2;
		if (word.originDefinition.includes(searchNorm)) score += 2;

		return score;
	}

	$: filtered = data.words
		.filter(word => {
			return (
				word.word.includes(searchNorm) ||
				word.meaning.includes(searchNorm) ||
				word.pos.some(pos => pos.includes(searchNorm)) ||
				word.originLanguage.includes(searchNorm) ||
				word.originWord.includes(searchNorm) ||
				word.originTransliteration.includes(searchNorm) ||
				word.originDefinition.includes(searchNorm)
			);
		})
		.sort((a, b) => {
			return (
				scoreSearch(b) - scoreSearch(a) || a.word.localeCompare(b.word)
			);
		});

	let selectedWord: WordData | null = null;
</script>

<h1 class="text-4xl font-black">kanlen</h1>

<p class="mt-4">
	This is a dictionary for my constructed language,
	<a
		href="https://docs.google.com/document/d/1bisigRAq7EnbC_hIu_nylNh1TqLxwxbKWummodtNw5U/edit?usp=sharing"
		target="_blank"
		rel="noopener noreferrer"
		class="link"
	>
		kanlen</a
	>.
</p>

<p class="mt-8 font-semibold">
	<button
		class="border-2 px-3 py-1.5 rounded-xl bg-white hocus-visible:border-gray-400 transition"
		on:click={() => (detailed = !detailed)}
	>
		{#if detailed}
			meka
		{:else}
			sisa
		{/if}
	</button>
</p>

<p class="mt-2">
	<input
		type="text"
		placeholder="Search..."
		class="px-4 py-2 border-2 rounded-xl outline-none focus:border-gray-400 transition"
		bind:value={search}
	/>
</p>

<div class="mt-4 grid gap-4">
	{#each filtered as word}
		<button
			class="p-6 flex flex-col items-start text-left border-2 rounded-xl bg-white hocus-visible:border-gray-400 hocus-visible:shadow-lg transition"
			on:click={() => {
				if (selectedWord === word) {
					selectedWord = null;
				} else {
					selectedWord = word;
				}
			}}
		>
			<h2 class="text-2xl font-bold">{word.word}</h2>

			<WordDetails {word} {detailed} />
		</button>
	{/each}
</div>

<Popup bind:value={selectedWord} let:value>
	<h2 class="text-2xl font-bold">{value.word}</h2>

	<WordDetails word={value} detailed />
</Popup>

<style lang="postcss">
	.grid {
		grid-template-columns: repeat(auto-fill, minmax(16rem, 1fr));
	}
</style>
