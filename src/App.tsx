import { useState, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { Header } from './components/Header';
import { PlayerList } from './components/PlayerList';
import { Footer } from './components/Footer';
import { SettingsWindow } from './components/SettingsWindow';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ResizeHandle } from './components/ResizeHandle';
import { AggroList } from './components/AggroList';
import { SpellTimers } from './components/SpellTimers';
import { useAggroData } from './hooks/useAggroData';
import { useSpellTimers } from './hooks/useSpellTimers';
import { useOverlayLock } from './hooks/useOverlayLock';
import { useDemoMode } from './hooks/useDemoMode';
import { useSettings } from './hooks/useSettings';
import { useAlertProcessing } from './hooks/useAlertProcessing';
import overlayPlugin from './services/OverlayPlugin';
import { DEMO_DATA } from './data/demoData';

import type { RawCombatData, ViewType, PrimaryPlayerData } from './types';
import { VIEW } from './types';

import './styles/App.css';

const MAX_PLAYERS_STANDARD = 9;
const MAX_PLAYERS_RAID = 24;

function App() {
  const { t } = useTranslation();

  // Core state
  const [combatData, setCombatData] = useState<RawCombatData | null>(null);
  const [currentView, setCurrentView] = useState<ViewType>(VIEW.DPS);
  const [showSettings, setShowSettings] = useState(false);
  const [initError, setInitError] = useState<string | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [detectedPlayerName, setDetectedPlayerName] = useState<string | null>(null);

  // Custom hooks
  const { settings, saveSettings, effectivePlayerName } = useSettings(detectedPlayerName);
  const { entries: aggroEntries, target: aggroTarget, handleAggroList } = useAggroData();
  const { activeTimers, handleLogLine } = useSpellTimers(settings.timers, effectivePlayerName);
  const isLocked = useOverlayLock();
  const [demoMode] = useDemoMode();

  // Process alerts when combat data changes
  useAlertProcessing(combatData, settings.alerts, effectivePlayerName);

  // Apply opacity to container
  useEffect(() => {
    const container = document.querySelector('.overlay-container') as HTMLElement;
    if (container) {
      container.style.opacity = String(settings.general.opacity / 100);
    }
  }, [settings.general.opacity]);

  // Compute max players based on view
  const maxPlayers = currentView === VIEW.RAID ? MAX_PLAYERS_RAID : MAX_PLAYERS_STANDARD;

  // Stable callbacks
  const handleCombatData = useCallback((data: RawCombatData) => {
    if (data && data.Combatant) setCombatData(data);
  }, []);

  const handlePrimaryPlayer = useCallback((data: PrimaryPlayerData) => {
    setDetectedPlayerName(data.charName);
  }, []);

  const handleOpenSettings = useCallback(() => setShowSettings(true), []);
  const handleCloseSettings = useCallback(() => setShowSettings(false), []);

  // Initialize OverlayPlugin
  useEffect(() => {
    const logLineHandler = (data: { line: string[] }) => handleLogLine(data);

    try {
      overlayPlugin.initialize(handleCombatData, undefined, {
        onPrimaryPlayer: handlePrimaryPlayer,
        onAggroList: handleAggroList,
        onLogLine: logLineHandler,
      });
    } catch (error) {
      setInitError(error instanceof Error ? error.message : 'Failed to initialize');
    }

    return () => overlayPlugin.cleanup();
  }, [handleCombatData, handlePrimaryPlayer, handleAggroList, handleLogLine]);

  // Use demo data when in demo mode
  const displayData = demoMode ? DEMO_DATA : combatData;

  if (initError) {
    return (
      <div className="overlay-container">
        <div className="error-boundary">
          <span>Initialization Error</span>
          <span>{initError}</span>
        </div>
      </div>
    );
  }

  const containerClasses = [
    'overlay-container',
    `theme-${settings.general.theme}`,
    `layout-${settings.display.layout}`,
    isCollapsed ? 'collapsed' : '',
    settings.display.footerPosition === 'top' ? 'footer-top' : '',
  ]
    .filter(Boolean)
    .join(' ');

  const handleToggleCollapse = useCallback(() => setIsCollapsed((p) => !p), []);

  const footerProps = {
    currentView,
    onViewChange: setCurrentView,
    onSettingsClick: handleOpenSettings,
    onToggleCollapse: settings.behavior.collapsible ? handleToggleCollapse : undefined,
    isCollapsed,
  };

  return (
    <ErrorBoundary>
      <div className={containerClasses}>
        {settings.display.footerPosition === 'top' && <Footer {...footerProps} />}

        {!isCollapsed && (
          <>
            <Header combatData={displayData} currentView={currentView} settings={settings} />
            {currentView === VIEW.AGGRO ? (
              <AggroList entries={aggroEntries} target={aggroTarget} settings={settings} />
            ) : (
              <PlayerList
                combatData={displayData}
                currentView={currentView}
                settings={settings}
                maxPlayers={maxPlayers}
                playerName={effectivePlayerName}
              />
            )}
            {settings.timers.enabled && activeTimers.length > 0 && (
              <SpellTimers timers={activeTimers} playerName={effectivePlayerName} />
            )}
          </>
        )}

        {isCollapsed && (
          <div className="collapsed-summary">
            <span className="collapsed-label">{t('collapsed.label')}</span>
          </div>
        )}

        {settings.display.footerPosition === 'bottom' && <Footer {...footerProps} />}

        <SettingsWindow
          isOpen={showSettings}
          settings={settings}
          onSave={saveSettings}
          onClose={handleCloseSettings}
          detectedPlayerName={detectedPlayerName}
        />

        {!isLocked && <ResizeHandle />}
      </div>
    </ErrorBoundary>
  );
}

export default App;
