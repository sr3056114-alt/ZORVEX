
export interface Game {
  id: string;
  title: string;
  image: string;
  badge?: string;
}

export enum Category {
  ALL = 'All',
  TRADING = 'Trading',
  POPULAR = 'Popular',
  SLOTS = 'Slots'
}

export interface UserStats {
  balance: number;
  referralCode: string;
}

export interface DepositTransaction {
  id: string;
  amount: number;
  method: string;
  subMethod?: string;
  status: 'To be paid' | 'Processing' | 'Completed' | 'Failed' | 'Cancelled';
  date: string;
  time: string;
  timestamp?: number;
}
