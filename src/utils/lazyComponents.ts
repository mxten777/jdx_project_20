import { lazy } from 'react';

// 지연 로딩 컴포넌트들
export const LazyHistoryView = lazy(() => import('../components/HistoryView'));
export const LazyGenerateView = lazy(() => import('../components/GenerateView'));
export const LazySettingsModal = lazy(() => import('../components/SettingsModal'));
export const LazySocialShareModal = lazy(() => import('../components/SocialShareModal'));
export const LazyPremiumPlanModal = lazy(() => import('../components/PremiumPlanModal'));
export const LazyQRCodeModal = lazy(() => import('../components/QRCodeModal'));
export const LazyCopyFormatModal = lazy(() => import('../components/CopyFormatModal'));

// 프리로딩 함수들
export const preloadHistoryView = () => import('../components/HistoryView');
export const preloadGenerateView = () => import('../components/GenerateView');
export const preloadSettingsModal = () => import('../components/SettingsModal');
export const preloadSocialShareModal = () => import('../components/SocialShareModal');
export const preloadPremiumPlanModal = () => import('../components/PremiumPlanModal');