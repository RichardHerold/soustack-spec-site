declare module 'astro:content' {
	interface Render {
		'.mdx': Promise<{
			Content: import('astro').MarkdownInstance<{}>['Content'];
			headings: import('astro').MarkdownHeading[];
			remarkPluginFrontmatter: Record<string, any>;
			components: import('astro').MDXInstance<{}>['components'];
		}>;
	}
}

declare module 'astro:content' {
	interface RenderResult {
		Content: import('astro/runtime/server/index.js').AstroComponentFactory;
		headings: import('astro').MarkdownHeading[];
		remarkPluginFrontmatter: Record<string, any>;
	}
	interface Render {
		'.md': Promise<RenderResult>;
	}

	export interface RenderedContent {
		html: string;
		metadata?: {
			imagePaths: Array<string>;
			[key: string]: unknown;
		};
	}
}

declare module 'astro:content' {
	type Flatten<T> = T extends { [K: string]: infer U } ? U : never;

	export type CollectionKey = keyof AnyEntryMap;
	export type CollectionEntry<C extends CollectionKey> = Flatten<AnyEntryMap[C]>;

	export type ContentCollectionKey = keyof ContentEntryMap;
	export type DataCollectionKey = keyof DataEntryMap;

	type AllValuesOf<T> = T extends any ? T[keyof T] : never;
	type ValidContentEntrySlug<C extends keyof ContentEntryMap> = AllValuesOf<
		ContentEntryMap[C]
	>['slug'];

	/** @deprecated Use `getEntry` instead. */
	export function getEntryBySlug<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(
		collection: C,
		// Note that this has to accept a regular string too, for SSR
		entrySlug: E,
	): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;

	/** @deprecated Use `getEntry` instead. */
	export function getDataEntryById<C extends keyof DataEntryMap, E extends keyof DataEntryMap[C]>(
		collection: C,
		entryId: E,
	): Promise<CollectionEntry<C>>;

	export function getCollection<C extends keyof AnyEntryMap, E extends CollectionEntry<C>>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => entry is E,
	): Promise<E[]>;
	export function getCollection<C extends keyof AnyEntryMap>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => unknown,
	): Promise<CollectionEntry<C>[]>;

	export function getEntry<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(entry: {
		collection: C;
		slug: E;
	}): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof DataEntryMap,
		E extends keyof DataEntryMap[C] | (string & {}),
	>(entry: {
		collection: C;
		id: E;
	}): E extends keyof DataEntryMap[C]
		? Promise<DataEntryMap[C][E]>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(
		collection: C,
		slug: E,
	): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof DataEntryMap,
		E extends keyof DataEntryMap[C] | (string & {}),
	>(
		collection: C,
		id: E,
	): E extends keyof DataEntryMap[C]
		? Promise<DataEntryMap[C][E]>
		: Promise<CollectionEntry<C> | undefined>;

	/** Resolve an array of entry references from the same collection */
	export function getEntries<C extends keyof ContentEntryMap>(
		entries: {
			collection: C;
			slug: ValidContentEntrySlug<C>;
		}[],
	): Promise<CollectionEntry<C>[]>;
	export function getEntries<C extends keyof DataEntryMap>(
		entries: {
			collection: C;
			id: keyof DataEntryMap[C];
		}[],
	): Promise<CollectionEntry<C>[]>;

	export function render<C extends keyof AnyEntryMap>(
		entry: AnyEntryMap[C][string],
	): Promise<RenderResult>;

	export function reference<C extends keyof AnyEntryMap>(
		collection: C,
	): import('astro/zod').ZodEffects<
		import('astro/zod').ZodString,
		C extends keyof ContentEntryMap
			? {
					collection: C;
					slug: ValidContentEntrySlug<C>;
				}
			: {
					collection: C;
					id: keyof DataEntryMap[C];
				}
	>;
	// Allow generic `string` to avoid excessive type errors in the config
	// if `dev` is not running to update as you edit.
	// Invalid collection names will be caught at build time.
	export function reference<C extends string>(
		collection: C,
	): import('astro/zod').ZodEffects<import('astro/zod').ZodString, never>;

	type ReturnTypeOrOriginal<T> = T extends (...args: any[]) => infer R ? R : T;
	type InferEntrySchema<C extends keyof AnyEntryMap> = import('astro/zod').infer<
		ReturnTypeOrOriginal<Required<ContentConfig['collections'][C]>['schema']>
	>;

	type ContentEntryMap = {
		"spec": {
"SPEC.md": {
	id: "SPEC.md";
  slug: "spec";
  body: string;
  collection: "spec";
  data: any
} & { render(): Render[".md"] };
};
"stacks": {
"compute@1.md": {
	id: "compute@1.md";
  slug: "compute1";
  body: string;
  collection: "stacks";
  data: any
} & { render(): Render[".md"] };
"dietary@1.md": {
	id: "dietary@1.md";
  slug: "dietary1";
  body: string;
  collection: "stacks";
  data: any
} & { render(): Render[".md"] };
"equipment@1.md": {
	id: "equipment@1.md";
  slug: "equipment1";
  body: string;
  collection: "stacks";
  data: any
} & { render(): Render[".md"] };
"illustrated@1.md": {
	id: "illustrated@1.md";
  slug: "illustrated1";
  body: string;
  collection: "stacks";
  data: any
} & { render(): Render[".md"] };
"prep@1.md": {
	id: "prep@1.md";
  slug: "prep1";
  body: string;
  collection: "stacks";
  data: any
} & { render(): Render[".md"] };
"quantified@1.md": {
	id: "quantified@1.md";
  slug: "quantified1";
  body: string;
  collection: "stacks";
  data: any
} & { render(): Render[".md"] };
"referenced@1.md": {
	id: "referenced@1.md";
  slug: "referenced1";
  body: string;
  collection: "stacks";
  data: any
} & { render(): Render[".md"] };
"scaling@1.md": {
	id: "scaling@1.md";
  slug: "scaling1";
  body: string;
  collection: "stacks";
  data: any
} & { render(): Render[".md"] };
"storage@1.md": {
	id: "storage@1.md";
  slug: "storage1";
  body: string;
  collection: "stacks";
  data: any
} & { render(): Render[".md"] };
"structured@1.md": {
	id: "structured@1.md";
  slug: "structured1";
  body: string;
  collection: "stacks";
  data: any
} & { render(): Render[".md"] };
"substitutions@1.md": {
	id: "substitutions@1.md";
  slug: "substitutions1";
  body: string;
  collection: "stacks";
  data: any
} & { render(): Render[".md"] };
"techniques@1.md": {
	id: "techniques@1.md";
  slug: "techniques1";
  body: string;
  collection: "stacks";
  data: any
} & { render(): Render[".md"] };
"timed@1.md": {
	id: "timed@1.md";
  slug: "timed1";
  body: string;
  collection: "stacks";
  data: any
} & { render(): Render[".md"] };
};

	};

	type DataEntryMap = {
		
	};

	type AnyEntryMap = ContentEntryMap & DataEntryMap;

	export type ContentConfig = never;
}
