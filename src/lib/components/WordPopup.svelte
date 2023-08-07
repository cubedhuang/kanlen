<script lang="ts">
	import type { WordData } from '$lib/types';
	import Popup from './Popup.svelte';
	import WordDetails from './WordDetails.svelte';

	export let word: WordData | null;
</script>

<Popup bind:value={word} let:value={word}>
	<h2 class="text-2xl font-bold">{word.word}</h2>

	<WordDetails {word} detailed on:refer />
</Popup>
