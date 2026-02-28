export default function initOrR<T>(field: T, initializer: () => T) {
	field ??= initializer();
	return field;
}
