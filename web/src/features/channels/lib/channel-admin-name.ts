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

export const CHANNEL_ADMIN_RESOURCE_OPTIONS = [
  'official',
  'awsp',
  'awsb',
  'azure',
  'openrouter',
  'gcp',
  'vertexai',
  'maas',
  'ccmax',
  'codex',
  'gcppt',
  'tengxun',
  'cloudfare',
  'byteplus',
  'vercel',
] as const

export const CHANNEL_ADMIN_MODEL_SERIES_OPTIONS = [
  'gemini',
  'gpt',
  'gptimage',
  'claude',
  'geminiimage',
  'minimax',
  'kimi',
  'deepseek',
  'glm',
  'grok',
  'seedream',
  'seed',
  'seedance',
  'qwen',
  'veo',
] as const

export const CHANNEL_ADMIN_LIFECYCLE_FAST = '速刷'
export const CHANNEL_ADMIN_LIFECYCLE_LONG = '长效'

export const CHANNEL_ADMIN_LIFECYCLE_OPTIONS = [
  CHANNEL_ADMIN_LIFECYCLE_FAST,
  CHANNEL_ADMIN_LIFECYCLE_LONG,
] as const

const RESOURCE_SET = new Set<string>(CHANNEL_ADMIN_RESOURCE_OPTIONS)
const MODEL_SERIES_SET = new Set<string>(CHANNEL_ADMIN_MODEL_SERIES_OPTIONS)
const LIFECYCLE_SET = new Set<string>(CHANNEL_ADMIN_LIFECYCLE_OPTIONS)
const RATE_PATTERN = /^[0-9]+(\.[0-9]+)?$/

export type ChannelAdminNameParts = {
  username: string
  resource: string
  modelSeries: string
  lifecycle: string
  rate: string
}

export function isChannelAdminResource(value: string): boolean {
  return RESOURCE_SET.has(value)
}

export function isChannelAdminModelSeries(value: string): boolean {
  return MODEL_SERIES_SET.has(value)
}

export function isChannelAdminLifecycle(value: string): boolean {
  return LIFECYCLE_SET.has(value)
}

export function isChannelAdminRate(value: string): boolean {
  const trimmed = value.trim()
  if (!RATE_PATTERN.test(trimmed)) return false
  return Number.isFinite(Number(trimmed))
}

export function composeChannelAdminName(
  parts: ChannelAdminNameParts
): string {
  return [
    parts.username.trim(),
    parts.resource,
    parts.modelSeries,
    parts.lifecycle,
    parts.rate.trim(),
  ].join('-')
}

export function isCompleteChannelAdminName(
  parts: Partial<ChannelAdminNameParts>
): parts is ChannelAdminNameParts {
  const username = parts.username?.trim() ?? ''
  const resource = parts.resource ?? ''
  const modelSeries = parts.modelSeries ?? ''
  const lifecycle = parts.lifecycle ?? ''
  const rate = parts.rate?.trim() ?? ''
  return (
    username.length > 0 &&
    isChannelAdminResource(resource) &&
    isChannelAdminModelSeries(modelSeries) &&
    isChannelAdminLifecycle(lifecycle) &&
    isChannelAdminRate(rate)
  )
}

export function parseChannelAdminName(
  name: string,
  username: string
): ChannelAdminNameParts | null {
  const trimmedName = name.trim()
  const trimmedUsername = username.trim()
  if (!trimmedName || !trimmedUsername) return null

  const prefix = `${trimmedUsername}-`
  if (!trimmedName.startsWith(prefix)) return null

  const rest = trimmedName.slice(prefix.length)
  const segments = rest.split('-')
  if (segments.length !== 4) return null

  const [resource, modelSeries, lifecycle, rate] = segments
  const parts: ChannelAdminNameParts = {
    username: trimmedUsername,
    resource,
    modelSeries,
    lifecycle,
    rate,
  }
  if (!isCompleteChannelAdminName(parts)) return null
  return parts
}
