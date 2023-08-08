import { browser } from '$app/environment';
import devalue from 'devalue';
import { get, writable, type Updater, type Writable } from 'svelte/store';

export function savedWritable<T>(key: string, initial: T): Writable<T> {
	const store = writable<T>(initial);
	const { subscribe, set, update } = store;

	if (browser) {
		const serial = localStorage.getItem(key);
		if (serial && serial !== 'undefined') {
			let value: T;

			try {
				value = devalue.parse(serial);
			} catch {
				value = initial;
				localStorage.setItem(key, devalue.stringify(value));
			}

			set(value);
		}
	}

	return {
		subscribe,
		set(value: T) {
			if (browser) localStorage.setItem(key, devalue.stringify(value));
			set(value);
		},
		update(updater: Updater<T>) {
			update(updater);

			if (browser) {
				localStorage.setItem(key, devalue.stringify(get(store)));
			}
		}
	};
}
