<script lang="ts">
	import type { WordData } from '$lib/types';
	import { createEventDispatcher } from 'svelte';

	export let word: WordData;
	export let detailed = false;

	const dispatch = createEventDispatcher<{
		refer: { word: string };
	}>();
</script>

<p class="text-gray-500">{word.pos.join(' · ')}</p>
<p class="mt-2">{word.meaning}</p>

{#if detailed}
	{#if word.relatedWords.length}
		<p class="mt-2">
			see
			{#each word.relatedWords as relatedWord, i}
				<button
					class="link"
					on:click={() => {
						dispatch('refer', { word: relatedWord });
					}}
				>
					{relatedWord}
				</button>{#if i < word.relatedWords.length - 1}, {/if}
			{/each}
		</p>
	{/if}

	<p class="mt-2">
		{word.originLanguage}

		{#if word.originWord}
			&middot;
			{word.originWord}
		{/if}

		{#if word.originTransliteration}
			{word.originTransliteration}
		{/if}

		{#if word.originDefinition}
			&lsquo;{word.originDefinition}&rsquo;
		{/if}
	</p>
{/if}
