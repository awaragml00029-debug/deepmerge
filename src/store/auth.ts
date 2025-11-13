import { create } from "zustand";
import { persist } from "zustand/middleware";

export type KeyStatus = 'unset' | 'validating' | 'validated' | 'failed';

interface TokenInfo {
  name: string;
  status: number; // 1=enabled, 2=disabled
  remain_quota: number; // in 1/1000 dollar
  used_quota: number;
  expired_time: number; // -1 = never expires
}

interface AuthStore {
  // Token management
  token: string;
  setToken: (token: string) => void;

  // Validation status
  keyStatus: KeyStatus;
  setKeyStatus: (status: KeyStatus) => void;

  // Balance information
  balance: number; // in dollars
  usedBalance: number; // in dollars
  setBalance: (remain: number, used: number) => void;

  // Token info
  tokenInfo: TokenInfo | null;
  setTokenInfo: (info: TokenInfo | null) => void;

  // Helpers
  isFeatureEnabled: () => boolean;
  getBalanceInDollars: () => number;
  isBalanceLow: () => boolean; // < $10
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // Initial state
      token: '',
      keyStatus: 'unset',
      balance: 0,
      usedBalance: 0,
      tokenInfo: null,

      // Setters
      setToken: (token: string) => {
        set({ token });
      },

      setKeyStatus: (status: KeyStatus) => {
        set({ keyStatus: status });
      },

      setBalance: (remain: number, used: number) => {
        // Convert from 1/1000 dollar to dollars
        set({
          balance: remain / 1000,
          usedBalance: used / 1000,
        });
      },

      setTokenInfo: (info: TokenInfo | null) => {
        set({ tokenInfo: info });
        if (info) {
          get().setBalance(info.remain_quota, info.used_quota);
        }
      },

      // Helpers
      isFeatureEnabled: () => {
        return get().keyStatus === 'validated';
      },

      getBalanceInDollars: () => {
        return get().balance;
      },

      isBalanceLow: () => {
        return get().balance <= 10;
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
