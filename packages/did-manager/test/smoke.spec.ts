import { describe, it, expect } from 'vitest'

describe('setup smoke', () => {
  it('should run basic assertions', () => {
    expect(1 + 1).toBe(2)
    const div = document.createElement('div')
    div.id = 'root'
    document.body.appendChild(div)
    expect(document.getElementById('root')).toBe(div)
  })
})
