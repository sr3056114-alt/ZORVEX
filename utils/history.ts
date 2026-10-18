export interface BetHistoryItem {
  id: string;
  game: string;
  amount: number;
  result: 'win' | 'loss' | 'pending';
  payout: number;
  timestamp: number;
  details?: any;
}

const STORAGE_KEY = 'rajadhan_bet_history';

export const addBetHistory = (item: Omit<BetHistoryItem, 'id' | 'timestamp'>) => {
  const history = getBetHistory();
  const newItem: BetHistoryItem = {
    ...item,
    id: Math.random().toString(36).substring(2, 9),
    timestamp: Date.now(),
  };
  
  if (item.result === 'win' || item.result === 'loss') {
    let currentWager = parseFloat(localStorage.getItem('rajadhan_wager_requirement') || '0');
    if (currentWager > 0) {
      currentWager -= Math.abs(item.amount);
      if (currentWager < 0) currentWager = 0;
      localStorage.setItem('rajadhan_wager_requirement', currentWager.toString());
      window.dispatchEvent(new Event('wager_updated'));
    }
  }

  const updatedHistory = [newItem, ...history];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
};

export const getBetHistory = (): BetHistoryItem[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return [];
    
    return JSON.parse(saved);
  } catch (e) {
    return [];
  }
};
