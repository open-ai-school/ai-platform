import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock fs/promises before importing the module
vi.mock('fs/promises', () => ({
  default: {
    mkdir: vi.fn().mockResolvedValue(undefined),
    readFile: vi.fn(),
    writeFile: vi.fn(),
  },
}));

import fs from 'fs/promises';
import { readJsonFile, writeJsonFile } from '@/lib/fileStore';

beforeEach(() => {
  vi.clearAllMocks();
});

describe('readJsonFile', () => {
  it('returns parsed JSON when file exists', async () => {
    const mockData = { name: 'test', value: 42 };
    vi.mocked(fs.readFile).mockResolvedValue(JSON.stringify(mockData));

    const result = await readJsonFile('test.json', {});
    expect(result).toEqual(mockData);
  });

  it('returns fallback when file does not exist', async () => {
    vi.mocked(fs.readFile).mockRejectedValue(new Error('ENOENT'));

    const fallback = { default: true };
    const result = await readJsonFile('missing.json', fallback);
    expect(result).toEqual(fallback);
  });

  it('returns fallback when file contains invalid JSON', async () => {
    vi.mocked(fs.readFile).mockResolvedValue('not valid json {{{');

    const fallback: string[] = [];
    const result = await readJsonFile('bad.json', fallback);
    expect(result).toEqual(fallback);
  });

  it('ensures the data directory exists before reading', async () => {
    vi.mocked(fs.readFile).mockResolvedValue('{}');

    await readJsonFile('test.json', {});
    expect(fs.mkdir).toHaveBeenCalledWith(expect.stringContaining('data'), { recursive: true });
  });
});

describe('writeJsonFile', () => {
  it('writes JSON data to the specified file', async () => {
    vi.mocked(fs.writeFile).mockResolvedValue(undefined);

    const data = { users: ['alice', 'bob'] };
    await writeJsonFile('users.json', data);

    expect(fs.writeFile).toHaveBeenCalledWith(
      expect.stringContaining('users.json'),
      JSON.stringify(data, null, 2),
      'utf-8',
    );
  });

  it('ensures the data directory exists before writing', async () => {
    vi.mocked(fs.writeFile).mockResolvedValue(undefined);

    await writeJsonFile('test.json', {});
    expect(fs.mkdir).toHaveBeenCalledWith(expect.stringContaining('data'), { recursive: true });
  });

  it('handles read-only filesystem gracefully without throwing', async () => {
    vi.mocked(fs.writeFile).mockRejectedValue(new Error('EROFS: read-only file system'));
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    await expect(writeJsonFile('test.json', { key: 'value' })).resolves.toBeUndefined();
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Cannot write'));

    consoleSpy.mockRestore();
  });
});
