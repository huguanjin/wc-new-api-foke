/*
Copyright (C) 2023-2026 QuantumNous

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.

For commercial licensing, please contact support@quantumnous.com
*/
import assert from 'node:assert/strict'
import { describe, test } from 'node:test'

import {
  CHANNEL_ADMIN_LIFECYCLE_FAST,
  composeChannelAdminName,
  parseChannelAdminName,
} from '../channel-admin-name'

describe('channel admin name', () => {
  test('joins username, resource, series, lifecycle, and rate with hyphens', () => {
    const name = composeChannelAdminName({
      username: 'wangchuanyun',
      resource: 'official',
      modelSeries: 'gpt',
      lifecycle: CHANNEL_ADMIN_LIFECYCLE_FAST,
      rate: '0.85',
    })
    assert.equal(name, 'wangchuanyun-official-gpt-速刷-0.85')
  })

  test('parses a composed name back into parts', () => {
    const parts = parseChannelAdminName(
      'wangchuanyun-official-gpt-速刷-0.85',
      'wangchuanyun'
    )
    assert.deepEqual(parts, {
      username: 'wangchuanyun',
      resource: 'official',
      modelSeries: 'gpt',
      lifecycle: '速刷',
      rate: '0.85',
    })
  })

  test('rejects unknown options and invalid rates', () => {
    assert.equal(
      parseChannelAdminName('wangchuanyun-unknown-gpt-速刷-0.85', 'wangchuanyun'),
      null
    )
    assert.equal(
      parseChannelAdminName('wangchuanyun-official-gpt-速刷-abc', 'wangchuanyun'),
      null
    )
  test('parses names when username itself contains hyphens', () => {
    const parts = parseChannelAdminName(
      'wang-chuan-official-gpt-速刷-0.85',
      'wang-chuan'
    )
    assert.equal(parts?.resource, 'official')
    assert.equal(parts?.rate, '0.85')
  })
})
