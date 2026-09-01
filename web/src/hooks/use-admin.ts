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
import { canManageApiKeys, ROLE } from '@/lib/roles'
import { useAuthStore } from '@/stores/auth-store'

/**
 * Check if current user has full admin privileges (admin or root).
 */
export function useIsAdmin(): boolean {
  const { user } = useAuthStore((state) => state.auth)
  return (user?.role ?? 0) >= ROLE.ADMIN
}

/**
 * Check if current user is a channel admin (owned-channel staff, not full admin).
 */
export function useIsChannelAdmin(): boolean {
  const { user } = useAuthStore((state) => state.auth)
  return user?.role === ROLE.CHANNEL_ADMIN
}

/**
 * Check if current user is a readonly admin (group-scoped channel read).
 */
export function useIsReadonlyAdmin(): boolean {
  const { user } = useAuthStore((state) => state.auth)
  return user?.role === ROLE.READONLY_ADMIN
}

/**
 * Channel admins are blocked from /api/token; other signed-in roles may manage keys.
 */
export function useCanManageApiKeys(): boolean {
  const role = useAuthStore((state) => state.auth.user?.role)
  return canManageApiKeys(role)
}
