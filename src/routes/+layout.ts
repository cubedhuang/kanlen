import type { WordData } from '$lib/types';

import type { LayoutLoad } from './$types';

export const load = (({ fetch }) => {
	return {
		words: fetch('/api/everything').then(res => res.json()) as Promise<
			WordData[]
		>
	};
}) satisfies LayoutLoad;
