export default function initOrR<T>(field: T | undefined, initializer: () => T) {
	field ??= initializer();
	return field;
}
