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
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import {
  CHANNEL_ADMIN_LIFECYCLE_FAST,
  CHANNEL_ADMIN_LIFECYCLE_LONG,
  CHANNEL_ADMIN_LIFECYCLE_OPTIONS,
  CHANNEL_ADMIN_MODEL_SERIES_OPTIONS,
  CHANNEL_ADMIN_RESOURCE_OPTIONS,
  composeChannelAdminName,
  isCompleteChannelAdminName,
  parseChannelAdminName,
} from '../../lib/channel-admin-name'

type ChannelAdminNameFieldsProps = {
  username: string
  value: string
  onChange: (name: string) => void
  disabled?: boolean
}

function Hyphen() {
  return (
    <span
      className='text-muted-foreground shrink-0 select-none px-0.5'
      aria-hidden='true'
    >
      -
    </span>
  )
}

export function ChannelAdminNameFields({
  username,
  value,
  onChange,
  disabled = false,
}: ChannelAdminNameFieldsProps) {
  const { t } = useTranslation()
  const parsed = parseChannelAdminName(value, username)

  const [resource, setResource] = useState(parsed?.resource ?? '')
  const [modelSeries, setModelSeries] = useState(parsed?.modelSeries ?? '')
  const [lifecycle, setLifecycle] = useState(parsed?.lifecycle ?? '')
  const [rate, setRate] = useState(parsed?.rate ?? '')
  const onChangeRef = useRef(onChange)
  const valueRef = useRef(value)
  onChangeRef.current = onChange
  valueRef.current = value

  useEffect(() => {
    const parts = {
      username,
      resource,
      modelSeries,
      lifecycle,
      rate,
    }
    const nextName = isCompleteChannelAdminName(parts)
      ? composeChannelAdminName(parts)
      : ''
    if (nextName !== valueRef.current) {
      onChangeRef.current(nextName)
    }
  }, [username, resource, modelSeries, lifecycle, rate])

  const preview = isCompleteChannelAdminName({
    username,
    resource,
    modelSeries,
    lifecycle,
    rate,
  })
    ? composeChannelAdminName({
        username,
        resource,
        modelSeries,
        lifecycle,
        rate: rate.trim(),
      })
    : ''

  const resourceItems = CHANNEL_ADMIN_RESOURCE_OPTIONS.map((option) => ({
    value: option,
    label: option,
  }))
  const modelSeriesItems = CHANNEL_ADMIN_MODEL_SERIES_OPTIONS.map((option) => ({
    value: option,
    label: option,
  }))
  const lifecycleItems = CHANNEL_ADMIN_LIFECYCLE_OPTIONS.map((option) => ({
    value: option,
    label:
      option === CHANNEL_ADMIN_LIFECYCLE_FAST
        ? t('Fast refresh')
        : option === CHANNEL_ADMIN_LIFECYCLE_LONG
          ? t('Long-term')
          : option,
  }))

  const usernameWidthCh = Math.min(Math.max(username.length, 8), 16) + 2.5

  return (
    <div className='flex flex-col gap-2'>
      <div className='flex w-full min-w-0 flex-nowrap items-center gap-1'>
        <Input
          readOnly
          disabled={disabled}
          value={username}
          title={t('Channel vendor')}
          aria-label={t('Channel vendor')}
          style={{ width: `${usernameWidthCh}ch` }}
          className='h-8 shrink-0 bg-muted/50'
        />
        <Hyphen />
        <Select
          items={resourceItems}
          value={resource || undefined}
          onValueChange={setResource}
          disabled={disabled}
        >
          <SelectTrigger
            className='h-8 w-0 min-w-0 flex-1 px-2'
            aria-label={t('Resource composition')}
          >
            <SelectValue placeholder={t('Resource composition')} />
          </SelectTrigger>
          <SelectContent alignItemWithTrigger={false}>
            <SelectGroup>
              {CHANNEL_ADMIN_RESOURCE_OPTIONS.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Hyphen />
        <Select
          items={modelSeriesItems}
          value={modelSeries || undefined}
          onValueChange={setModelSeries}
          disabled={disabled}
        >
          <SelectTrigger
            className='h-8 w-0 min-w-0 flex-1 px-2'
            aria-label={t('Model series')}
          >
            <SelectValue placeholder={t('Model series')} />
          </SelectTrigger>
          <SelectContent alignItemWithTrigger={false}>
            <SelectGroup>
              {CHANNEL_ADMIN_MODEL_SERIES_OPTIONS.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Hyphen />
        <Select
          items={lifecycleItems}
          value={lifecycle || undefined}
          onValueChange={setLifecycle}
          disabled={disabled}
        >
          <SelectTrigger
            className='h-8 w-0 min-w-0 flex-1 px-2'
            aria-label={t('Lifecycle')}
          >
            <SelectValue placeholder={t('Lifecycle')} />
          </SelectTrigger>
          <SelectContent alignItemWithTrigger={false}>
            <SelectGroup>
              {lifecycleItems.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Hyphen />
        <Input
          type='text'
          inputMode='decimal'
          disabled={disabled}
          value={rate}
          onChange={(event) => setRate(event.target.value)}
          placeholder={t('Rate multiplier')}
          aria-label={t('Rate multiplier')}
          className='h-8 w-[4.75rem] shrink-0 px-2'
        />
      </div>
      {preview ? (
        <p className='text-muted-foreground text-xs'>
          {t('Channel name will be: {{name}}', { name: preview })}
        </p>
      ) : (
        <p className='text-muted-foreground text-xs'>
          {t(
            'Please select resource composition, model series, lifecycle, and enter a rate.'
          )}
        </p>
      )}
    </div>
  )
}
