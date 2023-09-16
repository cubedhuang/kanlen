<script lang="ts">
	import type { WordData } from '$lib/types';
	import Separator from './Separator.svelte';
	import SyllableSpace from './SyllableSpace.svelte';

	export let words: WordData[];

	const syllable = /[fhjklmnpstw]?(?=[aeiou])[aeiou]n?(?![aeiou])/g;

	$: syllableGroups = words.reduce((acc, word) => {
		const syllables = word.word.match(syllable);

		if (syllables) {
			for (const syllable of syllables) {
				if (acc.has(syllable)) {
					acc.set(syllable, acc.get(syllable)! + 1);
				} else {
					acc.set(syllable, 1);
				}
			}
		}

		return acc;
	}, new Map<string, number>());

	$: maxCount = [...syllableGroups.values()].reduce(
		(acc, count) => Math.max(acc, count),
		0
	);

	const consonants = [
		'',
		'f',
		'h',
		'j',
		'k',
		'l',
		'm',
		'n',
		'p',
		's',
		't',
		'w'
	];
	const otherConsonants = consonants.slice(1);
	const vowels = ['a', 'e', 'i', 'o', 'u'];

	function consonantCount(consonant: string) {
		if (consonant === '') {
			return [...syllableGroups.keys()].reduce((acc, syllable) => {
				if (!otherConsonants.some(c => syllable.startsWith(c))) {
					return acc + syllableGroups.get(syllable)!;
				}

				return acc;
			}, 0);
		}

		return [...syllableGroups.keys()].reduce((acc, syllable) => {
			if (syllable.startsWith(consonant)) {
				return acc + syllableGroups.get(syllable)!;
			}

			return acc;
		}, 0);
	}

	function vowelCount(vowel: string) {
		return [...syllableGroups.keys()].reduce((acc, syllable) => {
			if (syllable.includes(vowel)) {
				return acc + syllableGroups.get(syllable)!;
			}

			return acc;
		}, 0);
	}
</script>

<Separator>syllables</Separator>

<div class="w-full overflow-x-auto">
	<div class="grid w-max mx-auto gap-2">
		<div />

		{#each consonants as consonant}
			<p class="px-2 flex justify-between">
				<span class="font-bold">
					{consonant || '∅'}
				</span>

				<span class="text-gray-500 tabular-nums">
					{consonantCount(consonant)}
				</span>
			</p>
		{/each}

		{#each vowels as vowel}
			<p class="px-2 flex justify-between">
				<span class="font-bold">
					{vowel}
				</span>

				<span class="text-gray-500 tabular-nums">
					{vowelCount(vowel)}
				</span>
			</p>

			{#each consonants as consonant}
				<div class="flex flex-col gap-1">
					<SyllableSpace
						syllable="{consonant}{vowel}"
						count={syllableGroups.get(`${consonant}${vowel}`) ?? 0}
						{maxCount}
					/>
					<SyllableSpace
						syllable="{consonant}{vowel}n"
						count={syllableGroups.get(`${consonant}${vowel}n`) ?? 0}
						{maxCount}
					/>
				</div>
			{/each}
		{/each}
	</div>
</div>

<style lang="postcss">
	.grid {
		grid-template-columns: repeat(13, minmax(0, 1fr));
	}
</style>
