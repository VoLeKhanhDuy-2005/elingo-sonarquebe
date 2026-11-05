import { afterEach, describe, expect, it, vi } from 'vitest'
import { formatRelativeTime } from '../../../src/utils/utils'

describe('formatRelativeTime', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('formats recent timestamps using the requested locale', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-10-31T12:00:00+07:00'))

    expect(formatRelativeTime('2026-10-31T11:55:00+07:00', 'vi')).toBe('5 phút trước')
    expect(formatRelativeTime('2026-10-31T11:55:00+07:00', 'en')).toBe('5 minutes ago')
  })

  it('localizes timestamps from just now', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-10-31T12:00:00+07:00'))

    expect(formatRelativeTime('2026-10-31T11:59:55+07:00', 'vi')).toBe('bây giờ')
    expect(formatRelativeTime('2026-10-31T11:59:55+07:00', 'en')).toBe('now')
  })

  it('returns an empty string for invalid dates', () => {
    expect(formatRelativeTime('not-a-date', 'en')).toBe('')
  })
})
