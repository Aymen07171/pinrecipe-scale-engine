import React from 'react';
import { Sparkles, Globe, Play, Plus, RefreshCw, Layers } from 'lucide-react';
import { WordPressConfig } from '../types/pipeline';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  wpConfig: WordPressConfig;
  onToggleWpModal: () => void;
  onRunPipeline: () => void;
  onOpenIngestModal: () => void;
  isRunningPipeline: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  wpConfig,
  onToggleWpModal,
  onRunPipeline,
  onOpenIngestModal,
  isRunningPipeline,
}) => {
  const navTabs = [
    { id: 'italian_hub', label: '🇮🇹 Italian Recipes Hub' },
    { id: 'dashboard', label: 'Dashboard & Queue' },
    { id: 'pipeline', label: '5-in-1 Pipeline' },
    { id: 'recipe_studio', label: 'AI Recipe Studio' },
    { id: 'wp_theme', label: 'WordPress Theme' },
    { id: 'pin_studio', label: 'Macro & Pin Studio' },
    { id: 'wordpress', label: 'WordPress CMS' },
    { id: 'pinterest', label: 'Pinterest Scheduler' },
    { id: 'health', label: 'Health & Logs' },
  ];

  return (
    <header className="border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand & Version Badge */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-pink-500 via-purple-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-pink-500/20 text-white">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-white tracking-tight">
                PinRecipe Scale Engine
              </span>
              <span className="bg-pink-950/60 text-pink-400 border border-pink-500/30 px-2 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap">
                Scale v4.0
              </span>
              <span className="hidden lg:inline text-xs text-slate-500 font-mono">
                · AYMAN 100%
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navTabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                    isActive
                      ? 'bg-slate-800 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </nav>

          {/* Action Zone */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* WordPress Status Button */}
            <button
              onClick={onToggleWpModal}
              title="Click to configure WordPress integration"
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium transition-colors ${
                wpConfig.isConnected
                  ? 'bg-emerald-950/40 border-emerald-700/50 text-emerald-300 hover:bg-emerald-900/40'
                  : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  wpConfig.isConnected ? 'bg-emerald-400 animate-pulse' : 'bg-red-500'
                }`}
              />
              <span className="whitespace-nowrap">
                {wpConfig.isConnected ? 'WordPress Online' : 'WordPress Offline'}
              </span>
            </button>

            {/* Ingest Button */}
            <button
              onClick={onOpenIngestModal}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900 text-slate-200 text-xs font-medium hover:bg-slate-800 hover:border-slate-700 transition-colors"
            >
              <Plus className="w-3.5 h-3.5 text-pink-400" />
              <span>Ingest</span>
            </button>

            {/* Run Pipeline CTA */}
            <button
              onClick={onRunPipeline}
              disabled={isRunningPipeline}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium text-white shadow-md transition-all ${
                isRunningPipeline
                  ? 'bg-indigo-600/60 cursor-not-allowed'
                  : 'bg-gradient-to-r from-pink-600 to-indigo-600 hover:from-pink-500 hover:to-indigo-500 shadow-indigo-500/20 active:scale-95'
              }`}
            >
              {isRunningPipeline ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Run Pipeline</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Row */}
        <div className="md:hidden flex overflow-x-auto py-2 gap-1 border-t border-slate-900 scrollbar-none">
          {navTabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1 text-xs font-medium rounded-md whitespace-nowrap shrink-0 ${
                  isActive ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
