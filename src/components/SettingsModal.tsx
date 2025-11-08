import React, { useState } from 'react';

interface SettingsModalProps {
  open: boolean;
  onClose: () => void;
  settings: AppSettings;
  onSettingsChange: (settings: AppSettings) => void;
}

import type { AppSettings } from '../types/lotto';

const SettingsModal: React.FC<SettingsModalProps> = ({
  open,
  onClose,
  settings,
  onSettingsChange
}) => {
  const [localSettings, setLocalSettings] = useState<AppSettings>(settings);

  if (!open) return null;

  const handleSave = () => {
    onSettingsChange(localSettings);
    onClose();
  };

  const handleReset = () => {
    const defaultSettings: AppSettings = {
      theme: 'auto',
      animations: true,
      sound: true,
      notifications: true,
      autoSave: true,
      language: 'ko',
      defaultGenerationMethod: 'random',
      numberDisplayStyle: 'circle',
      colorScheme: 'default'
    };
    setLocalSettings(defaultSettings);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-fade-in p-2 sm:p-4">
      <div className="glass-card rounded-2xl p-4 sm:p-6 shadow-premium relative w-full max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto premium-float">
        <button
          className="absolute top-3 right-3 sm:top-4 sm:right-4 text-white/70 hover:text-white text-2xl sm:text-3xl transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
          onClick={onClose}
          aria-label="설정 창 닫기"
        >
          ×
        </button>
        
        <div className="mb-6 sm:mb-8 pr-8">
          <h2 className="text-xl sm:text-2xl font-bold text-hero-gradient mb-2">
            ⚙️ 고급 설정
          </h2>
          <p className="text-white/70">
            개인 취향에 맞게 앱을 커스터마이즈하세요
          </p>
        </div>

        <div className="space-y-6">
          {/* 테마 설정 */}
          <div className="bg-white/5 rounded-xl p-4">
            <h3 className="text-lg font-semibold text-white mb-4">🎨 테마 설정</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-white/80 mb-2">테마 모드</label>
                <select
                  value={localSettings.theme}
                  onChange={(e) => setLocalSettings({...localSettings, theme: e.target.value as AppSettings['theme']})}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                >
                  <option value="light">라이트</option>
                  <option value="dark">다크</option>
                  <option value="auto">시스템 설정</option>
                </select>
              </div>
              
              <div>
                <label className="block text-white/80 mb-2">색상 테마</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {['default', 'neon', 'classic', 'minimal'].map((scheme) => (
                    <button
                      key={scheme}
                      onClick={() => setLocalSettings({...localSettings, colorScheme: scheme as AppSettings['colorScheme']})}
                      className={`p-3 rounded-lg border-2 transition-colors ${
                        localSettings.colorScheme === scheme
                          ? 'border-gold-400 bg-gold-400/20'
                          : 'border-white/20 bg-white/5 hover:border-white/40'
                      }`}
                    >
                      <div className="w-full h-8 rounded flex">
                        {scheme === 'default' && <div className="w-1/3 bg-violet-500 rounded-l"></div>}
                        {scheme === 'neon' && <div className="w-1/3 bg-cyan-400 rounded-l"></div>}
                        {scheme === 'classic' && <div className="w-1/3 bg-blue-600 rounded-l"></div>}
                        {scheme === 'minimal' && <div className="w-1/3 bg-gray-600 rounded-l"></div>}
                        <div className="w-1/3 bg-gold-400"></div>
                        <div className="w-1/3 bg-emerald-500 rounded-r"></div>
                      </div>
                      <span className="text-xs text-white/70 mt-1 block capitalize">{scheme}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 번호 표시 설정 */}
          <div className="bg-white/5 rounded-xl p-4">
            <h3 className="text-lg font-semibold text-white mb-4">🎯 번호 표시</h3>
            <div>
              <label className="block text-white/80 mb-2">번호 스타일</label>
              <div className="grid grid-cols-3 gap-2">
                {['circle', 'square', 'diamond'].map((style) => (
                  <button
                    key={style}
                    onClick={() => setLocalSettings({...localSettings, numberDisplayStyle: style as AppSettings['numberDisplayStyle']})}
                    className={`p-4 rounded-lg border-2 transition-colors ${
                      localSettings.numberDisplayStyle === style
                        ? 'border-gold-400 bg-gold-400/20'
                        : 'border-white/20 bg-white/5 hover:border-white/40'
                    }`}
                  >
                    <div className="flex justify-center mb-2">
                      {style === 'circle' && <div className="w-8 h-8 bg-gold-400 rounded-full"></div>}
                      {style === 'square' && <div className="w-8 h-8 bg-gold-400 rounded"></div>}
                      {style === 'diamond' && <div className="w-8 h-8 bg-gold-400 transform rotate-45"></div>}
                    </div>
                    <span className="text-xs text-white/70 capitalize">{style}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 기능 설정 */}
          <div className="bg-white/5 rounded-xl p-4">
            <h3 className="text-lg font-semibold text-white mb-4">🔧 기능 설정</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-white/80 mb-2">기본 생성 방식</label>
                <select
                  value={localSettings.defaultGenerationMethod}
                  onChange={(e) => setLocalSettings({...localSettings, defaultGenerationMethod: e.target.value as AppSettings['defaultGenerationMethod']})}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                >
                  <option value="random">완전 랜덤</option>
                  <option value="balanced">균형 생성</option>
                  <option value="statistics">통계 기반</option>
                  <option value="custom">커스텀</option>
                  <option value="ai">AI 추천</option>
                  <option value="hot-cold">핫/콜드</option>
                  <option value="pattern">패턴</option>
                  <option value="history">히스토리</option>
                  <option value="recommend">추천</option>
                </select>
              </div>
              
              <div className="space-y-3">
                {[
                  { key: 'animations', label: '애니메이션 효과', icon: '✨' },
                  { key: 'sound', label: '사운드 효과', icon: '🔊' },
                  { key: 'notifications', label: '알림', icon: '🔔' },
                  { key: 'autoSave', label: '자동 저장', icon: '💾' },
                ].map(({ key, label, icon }) => (
                  <label key={key} className="flex items-center justify-between">
                    <span className="text-white/80 flex items-center gap-2">
                      <span>{icon}</span>
                      {label}
                    </span>
                    <button
                      onClick={() => setLocalSettings({...localSettings, [key]: !localSettings[key as keyof AppSettings]})}
                      className={`relative w-12 h-6 rounded-full transition-colors ${
                        localSettings[key as keyof AppSettings] ? 'bg-gold-400' : 'bg-white/20'
                      }`}
                    >
                      <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                        localSettings[key as keyof AppSettings] ? 'translate-x-6' : ''
                      }`}></div>
                    </button>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 버튼 영역 */}
        <div className="flex flex-col sm:flex-row gap-3 mt-8">
          <button
            onClick={handleReset}
            className="btn-premium-secondary flex-1 py-3"
          >
            🔄 초기화
          </button>
          <button
            onClick={onClose}
            className="btn-premium-secondary flex-1 py-3"
          >
            취소
          </button>
          <button
            onClick={handleSave}
            className="btn-premium-main flex-1 py-3"
          >
            💾 저장
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;