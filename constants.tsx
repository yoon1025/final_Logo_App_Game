import React from 'react';
import { AppInfo } from './types';

// Hand-crafted SVG components for popular apps to ensure they don't break
export const InstaLogo: React.FC = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xl">
    <defs>
      <linearGradient id="ig-grad" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#f09433" />
        <stop offset="25%" stopColor="#e6683c" />
        <stop offset="50%" stopColor="#dc2743" />
        <stop offset="75%" stopColor="#cc2366" />
        <stop offset="100%" stopColor="#bc1888" />
      </linearGradient>
    </defs>
    <rect width="100" height="100" rx="24" fill="url(#ig-grad)" />
    <rect x="20" y="20" width="60" height="60" rx="16" stroke="white" strokeWidth="6" fill="none" />
    <circle cx="50" cy="50" r="14" stroke="white" strokeWidth="6" fill="none" />
    <circle cx="68" cy="32" r="4" fill="white" />
  </svg>
);

export const YoutubeLogo: React.FC = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xl">
    <rect width="100" height="100" rx="24" fill="white" />
    <rect x="10" y="25" width="80" height="50" rx="12" fill="#FF0000" />
    <polygon points="40,40 40,60 65,50" fill="white" />
  </svg>
);

export const KakaoLogo: React.FC = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xl">
    <rect width="100" height="100" rx="24" fill="#FEE500" />
    <path d="M50 25C30 25 15 37 15 52C15 61 20 68 28 73L24 85L36 79C40 80 45 81 50 81C70 81 85 69 85 52C85 37 70 25 50 25Z" fill="#371D1E" />
    <text x="50" y="58" fontFamily="sans-serif" fontSize="20" fontWeight="bold" fill="#FEE500" textAnchor="middle">TALK</text>
  </svg>
);

export const TiktokLogo: React.FC = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xl">
    <rect width="100" height="100" rx="24" fill="black" />
    <path d="M50 15 v45 a12 12 0 1 1 -12 -12 v-12 a24 24 0 1 0 24 24 v-35 a24 24 0 0 0 24 24 v-12 a12 12 0 0 1 -12 -12 z" fill="#25F4EE" transform="translate(-3, -3)" />
    <path d="M50 15 v45 a12 12 0 1 1 -12 -12 v-12 a24 24 0 1 0 24 24 v-35 a24 24 0 0 0 24 24 v-12 a12 12 0 0 1 -12 -12 z" fill="#FE2C55" transform="translate(3, 3)" />
    <path d="M50 15 v45 a12 12 0 1 1 -12 -12 v-12 a24 24 0 1 0 24 24 v-35 a24 24 0 0 0 24 24 v-12 a12 12 0 0 1 -12 -12 z" fill="white" />
  </svg>
);

export const XLogo: React.FC = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xl">
    <rect width="100" height="100" rx="24" fill="black" />
    <polygon points="20,20 45,55 20,80 35,80 52,62 70,80 80,80 55,45 80,20 65,20 48,38 30,20" fill="white" />
  </svg>
);

export const NetflixLogo: React.FC = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xl">
    <rect width="100" height="100" rx="24" fill="black" />
    <path d="M30 15 v70 h12 L60 35 v50 h12 v-70 h-12 L42 65 v-50 z" fill="#E50914" />
  </svg>
);

export const SpotifyLogo: React.FC = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xl">
    <rect width="100" height="100" rx="24" fill="black" />
    <circle cx="50" cy="50" r="40" fill="#1DB954" />
    <path d="M25 65 Q 50 55 75 65" stroke="black" strokeWidth="5" strokeLinecap="round" fill="none" />
    <path d="M22 50 Q 50 35 78 50" stroke="black" strokeWidth="7" strokeLinecap="round" fill="none" />
    <path d="M18 32 Q 50 12 82 32" stroke="black" strokeWidth="9" strokeLinecap="round" fill="none" />
  </svg>
);

export const NaverLogo: React.FC = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xl">
    <rect width="100" height="100" rx="24" fill="#03C75A" />
    <rect x="25" y="25" width="16" height="50" fill="white" />
    <rect x="59" y="25" width="16" height="50" fill="white" />
    <polygon points="25,25 41,25 75,75 59,75" fill="white" />
  </svg>
);

export const RobloxLogo: React.FC = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xl">
    <rect width="100" height="100" rx="24" fill="#3565F0" />
    <g transform="translate(50, 50) rotate(14) translate(-50, -50)">
      <rect x="20" y="20" width="60" height="60" rx="3" fill="white" />
      <rect x="40" y="40" width="20" height="20" rx="1" fill="#3565F0" />
    </g>
  </svg>
);

export const DiscordLogo: React.FC = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xl">
    <rect width="100" height="100" rx="24" fill="#5865F2" />
    <path d="M68 32 C68 32 58 26 48 26 C38 26 28 32 28 32 C28 32 18 50 18 68 C28 80 40 80 40 80 L44 74 C36 72 32 66 32 66 C40 72 56 72 64 66 C64 66 60 72 52 74 L56 80 C56 80 68 80 78 68 C78 50 68 32 68 32 Z" fill="white" />
    <circle cx="36" cy="54" r="5" fill="#5865F2" />
    <circle cx="60" cy="54" r="5" fill="#5865F2" />
  </svg>
);

export const APPS_DATA: AppInfo[] = [
  { id: 'insta', names: ['인스타그램', '인스타', 'instagram', 'insta'], component: InstaLogo },
  { id: 'youtube', names: ['유튜브', '유툽', 'youtube'], component: YoutubeLogo },
  { id: 'kakao', names: ['카카오톡', '카톡', 'kakaotalk', 'kakao'], component: KakaoLogo },
  { id: 'tiktok', names: ['틱톡', 'tiktok'], component: TiktokLogo },
  { id: 'x', names: ['엑스', '트위터', 'x', 'twitter'], component: XLogo },
  { id: 'netflix', names: ['넷플릭스', '넷플', 'netflix'], component: NetflixLogo },
  { id: 'spotify', names: ['스포티파이', 'spotify'], component: SpotifyLogo },
  { id: 'naver', names: ['네이버', 'naver'], component: NaverLogo },
  { id: 'roblox', names: ['로블록스', 'roblox'], component: RobloxLogo },
  { id: 'discord', names: ['디스코드', '디코', 'discord'], component: DiscordLogo },
];