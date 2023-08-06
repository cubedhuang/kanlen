import { Client } from '@notionhq/client';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

import { NOTION_SECRET } from '$env/static/private';

import type { WordData } from '$lib/types';

const databaseId = '5b399e18c920465bb8b14755c51f0de2';

const propertyMap: Record<string, keyof WordData> = {
	word: 'word',
	'part of speech': 'pos',
	meaning: 'meaning',
	'related words': 'relatedWords',

	'origin definition': 'originDefinition',
	'origin language': 'originLanguage',
	'origin word': 'originWord',
	transliteration: 'originTransliteration'
};

function pageToWordData(
	page: Awaited<ReturnType<Client['databases']['query']>>['results'][0]
) {
	if (page.object !== 'page' || !('parent' in page)) return null;

	const word: WordData = {
		id: page.id,
		word: '',
		pos: [],
		meaning: '',
		relatedWords: [],
		originDefinition: '',
		originLanguage: '',
		originWord: '',
		originTransliteration: ''
	};

	for (const [name, value] of Object.entries(page.properties)) {
		const key = propertyMap[name];

		if (key) {
			if (key === 'pos') {
				if (value.type === 'multi_select')
					word[key] = value.multi_select.map(({ name }) => name);
			} else if (key === 'relatedWords') {
				if (value.type === 'relation')
					word[key] = value.relation.map(({ id }) => id);
			} else {
				if (value.type === 'rich_text') {
					word[key] = value.rich_text[0]?.plain_text ?? '';

					if (value.rich_text.length > 1) {
						throw error(
							500,
							`Expected only one rich text value for property "${name}" on page "${
								// @ts-expect-error we know that word is the title field
								page.properties.word.title[0]?.plain_text ??
								'unknown'
							}"`
						);
					}
				} else if (value.type === 'title') {
					word[key] = value.title[0]?.plain_text ?? '';
				}
			}
		}
	}

	return word;
}

const posOrder: Record<string, number> = {
	particle: 1 << 5,
	emoticle: 1 << 4,
	postposition: 1 << 3,
	number: 1 << 2,
	pronoun: 1 << 1,
	content: 1 << 0
};

function sortWords(a: WordData, b: WordData) {
	const aPos = a.pos
		.map(pos => posOrder[pos] ?? 0)
		.reduce((a, b) => a | b, 0);
	const bPos = b.pos
		.map(pos => posOrder[pos] ?? 0)
		.reduce((a, b) => a | b, 0);

	return bPos - aPos || a.word.localeCompare(b.word);
}

let cachedWords: WordData[] | null = null;
let lastUpdated = 0;

export const GET = (async ({ fetch }) => {
	if (cachedWords && Date.now() < lastUpdated + 5 * 60 * 1000) {
		return json(cachedWords);
	}

	const notion = new Client({
		auth: NOTION_SECRET,
		fetch
	});

	const words: WordData[] = [];

	let data = await notion.databases.query({
		database_id: databaseId
	});

	for (const page of data.results) {
		const word = pageToWordData(page);

		if (word) words.push(word);
	}

	while (data.has_more && data.next_cursor) {
		data = await notion.databases.query({
			database_id: databaseId,
			start_cursor: data.next_cursor
		});

		for (const page of data.results) {
			const word = pageToWordData(page);

			if (word) words.push(word);
		}
	}

	const wordIdsToWord = new Map<string, string>(
		words.map(({ id, word }) => [id, word])
	);

	for (const word of words) {
		word.relatedWords = word.relatedWords
			.map(id => wordIdsToWord.get(id) ?? '')
			.filter(Boolean);
	}

	words.sort(sortWords);

	cachedWords = words;
	lastUpdated = Date.now();

	return json(words);
}) satisfies RequestHandler;
