/**
 * Workaround for https://github.com/microsoft/TypeScript/issues/17002
 *
 * @param x
 */
export function isArray(x: any): x is any[] | readonly any[] {
	return Array.isArray(x)
}
