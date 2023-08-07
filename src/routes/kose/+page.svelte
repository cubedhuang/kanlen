<script lang="ts">
	import WordPopup from '$lib/components/WordPopup.svelte';
	import type { WordData } from '$lib/types';
	import type { PageData } from './$types';

	import Languages from './Languages.svelte';
	import PartsOfSpeech from './PartsOfSpeech.svelte';
	import StartingLetters from './StartingLetters.svelte';
	import Syllables from './Syllables.svelte';
	import { selectedWord } from './selectedWord';

	export let data: PageData;

	let selectedWordData: WordData | null = null;

	function setSelectedWordData() {
		selectedWordData =
			data.words.find(word => word.word === $selectedWord) ?? null;

		if (!selectedWordData) {
			$selectedWord = '';
		}
	}

	$: if ($selectedWord || !$selectedWord) {
		console.log('selectedWord changed');
		setSelectedWordData();
	}

	$: if (!selectedWordData) {
		console.log('removed selectedWord');
		$selectedWord = '';
	}
</script>

<h1 class="text-4xl font-black">sana kose</h1>

<p class="mt-4">
	<a href="/" class="link">back</a>
</p>

<PartsOfSpeech words={data.words} />
<Syllables words={data.words} />
<StartingLetters words={data.words} />
<Languages words={data.words} />

<WordPopup
	bind:word={selectedWordData}
	on:refer={e => {
		$selectedWord = e.detail.word;
	}}
/>
