/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { Plus, Save, Trash2, UserCog, KeyRound } from 'lucide-react';
import { AdminAccount } from '../types';

const API_BASE = import.meta.env.DEV ? (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/$/, '') : '';
const ADMIN_STORAGE_KEY = 'gmm_admin_token';
const getAdminToken = () => localStorage.getItem(ADMIN_STORAGE_KEY) ?? '';

interface AdminAccessManagerProps {
  onLogActivity: (type: 'general', action: string, details: string) => void;
}

type EditableAdminAccount = AdminAccount & {
  passwordHint?: string;
};

export default function AdminAccessManager({ onLogActivity }: AdminAccessManagerProps) {
  const [accounts, setAccounts] = useState<EditableAdminAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadAccounts = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE}/api/admin/accounts`, {
          headers: {
            Authorization: `Bearer ${getAdminToken()}`
          }
        });

        if (!response.ok) {
          throw new Error(`Unable to load admin accounts (${response.status})`);
        }

        const payload = await response.json();
        const normalized = Array.isArray(payload)
          ? payload.map((account: AdminAccount) => ({
              ...account,
              password: '',
              passwordHint: 'Set a new password to change this account'
            }))
          : [];
        setAccounts(normalized.length > 0 ? normalized : [{
          id: `admin-${Date.now()}`,
          username: 'gmmadmin',
          password: 'gmmadmin123',
          role: 'administrator',
          passwordHint: 'Default seeded account'
        }]);
      } catch (err) {
        console.error(err);
        setError('Unable to load admin access data.');
      } finally {
        setLoading(false);
      }
    };

    void loadAccounts();
  }, []);

  const updateAccount = (index: number, patch: Partial<EditableAdminAccount>) => {
    setAccounts(prev => prev.map((account, idx) => (idx === index ? { ...account, ...patch } : account)));
  };

  const addAccount = () => {
    setAccounts(prev => [
      ...prev,
      {
        id: `admin-${Date.now()}`,
        username: '',
        password: '',
        role: 'administrator',
        passwordHint: ''
      }
    ]);
  };

  const removeAccount = (index: number) => {
    setAccounts(prev => prev.filter((_, idx) => idx !== index));
  };

  const saveAccounts = async () => {
    setError('');
    if (accounts.length === 0) {
      setError('At least one admin account is required.');
      return;
    }

    const normalized = accounts.map((account) => ({
      id: account.id,
      username: account.username.trim(),
      password: account.password?.trim() || '',
      role: 'administrator' as const
    }));

    if (normalized.some((account) => !account.username || !account.password)) {
      setError('Every admin account needs both a username and password.');
      return;
    }

    try {
      setSaving(true);
      const response = await fetch(`${API_BASE}/api/admin/accounts`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getAdminToken()}`
        },
        body: JSON.stringify({ accounts: normalized })
      });

      if (!response.ok) {
        throw new Error(`Unable to save admin accounts (${response.status})`);
      }

      const payload = await response.json();
      setAccounts(
        Array.isArray(payload.accounts)
          ? payload.accounts.map((account: AdminAccount) => ({
              ...account,
              password: '',
              passwordHint: 'Saved successfully'
            }))
          : []
      );
      onLogActivity('general', 'update', 'Updated admin login accounts');
    } catch (err) {
      console.error(err);
      setError('Could not save admin access settings.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white font-sans flex items-center gap-2">
            <UserCog className="w-5 h-5 text-emerald-400" />
            Admin Access
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Seeded default login is available immediately. You can update usernames or passwords here.
          </p>
        </div>
        <button
          type="button"
          onClick={addAccount}
          className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs py-2 px-4 rounded-xl transition-all shadow-md active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Add Admin
        </button>
      </div>

      {loading ? (
        <div className="rounded-2xl border border-zinc-800 bg-zinc-950/40 p-8 text-sm text-zinc-400">
          Loading admin accounts...
        </div>
      ) : (
        <div className="space-y-4">
          {accounts.map((account, index) => (
            <div key={account.id} className="rounded-2xl border border-zinc-800 bg-zinc-950/40 p-5 space-y-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-zinc-200 font-semibold text-sm">
                  <KeyRound className="w-4 h-4 text-emerald-400" />
                  Account {index + 1}
                </div>
                <button
                  type="button"
                  onClick={() => removeAccount(index)}
                  className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1"
                  disabled={accounts.length === 1}
                >
                  <Trash2 className="w-4 h-4" />
                  Remove
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="space-y-1 text-xs text-zinc-400">
                  <span>Username</span>
                  <input
                    type="text"
                    value={account.username}
                    onChange={(e) => updateAccount(index, { username: e.target.value })}
                    className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-4 py-3 text-sm text-white outline-none focus:border-emerald-500"
                    placeholder="gmmadmin"
                  />
                </label>

                <label className="space-y-1 text-xs text-zinc-400">
                  <span>Password</span>
                  <input
                    type="text"
                    value={account.password}
                    onChange={(e) => updateAccount(index, { password: e.target.value })}
                    className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-4 py-3 text-sm text-white outline-none focus:border-emerald-500"
                    placeholder="Type a new password"
                  />
                </label>
              </div>

              <p className="text-[11px] text-zinc-500">{account.passwordHint ?? 'Current account'}</p>
            </div>
          ))}
        </div>
      )}

      {error ? <p className="text-sm text-rose-400">{error}</p> : null}

      <div className="flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={saveAccounts}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white transition disabled:opacity-60"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Saving...' : 'Save Admin Accounts'}
        </button>
      </div>
    </div>
  );
}
