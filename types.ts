import React from 'react';

export type GameState = 'LOBBY' | 'PLAYING' | 'ENDED';

export interface Player {
  id: string;
  name: string;
  score: number;
  time: number; // 총 소요 시간 (초)
}

export interface AppInfo {
  id: string;
  names: string[];
  component: React.FC;
}

export interface HOFEntry {
  id: string;
  name: string;
  score: number;
  time: number;
  date: string;
}