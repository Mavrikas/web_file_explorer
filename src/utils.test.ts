import { isJson } from './utils';

describe('isJson', () => {
    test('should return true for valid JSON string', () => {
        const validJson = '{"name": "John", "age": 30}';
        expect(isJson(validJson)).toBe(true);
    });

    test('should return false for invalid JSON string', () => {
        const invalidJson = '{"name": "John", "age": 30';
        expect(isJson(invalidJson)).toBe(false);
    });

    test('should return false for non-JSON string', () => {
        const nonJson = 'Hello, World!';
        expect(isJson(nonJson)).toBe(false);
    });

    test('should return true for empty JSON object', () => {
        const emptyJsonObject = '{}';
        expect(isJson(emptyJsonObject)).toBe(true);
    });

    test('should return true for empty JSON array', () => {
        const emptyJsonArray = '[]';
        expect(isJson(emptyJsonArray)).toBe(true);
    });
});
