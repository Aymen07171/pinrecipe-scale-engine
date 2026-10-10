import React from 'react';
import { Database, Sparkles, Camera, Globe, Share2, CheckCircle2, ArrowRight } from 'lucide-react';
import { PipelineStepId } from '../types/pipeline';

interface PipelineStepperProps {
  currentStepId?: PipelineStepId;
  isProcessing?: boolean;
  onStepClick?: (stepIndex: number) => void;
}

export const PipelineStepper: React.FC<PipelineStepperProps> = ({
  currentStepId,
  isProcessing = false,
  onStepClick,
}) => {
  const steps = [
    {
      id: 'ingestion',
      name: '1. Ingestion Engine',
      label: 'Topic & Keyword Queue',
      desc: 'Raw niche inputs & CSV parser',
      icon: Database,
    },
    {
      id: 'synthesis',
      name: '2. Gemini Synthesis',
      label: 'Recipe & Schema LD',
      desc: 'LLM culinary & SEO copy',
      icon: Sparkles,
    },
    {
      id: 'media_gen',
      name: '3. Macro Photography',
      label: '2:3 Vertical Visuals',
      desc: 'Gemini visual synthesis',
      icon: Camera,
    },
    {
      id: 'wp_publish',
      name: '4. WordPress Sync',
      label: 'Gutenberg CMS Post',
      desc: 'REST API draft or publish',
      icon: Globe,
    },
    {
      id: 'pin_schedule',
      name: '5. Pinterest Scheduler',
      label: 'Bulk Timed Syndication',
      desc: 'Paced traffic distribution',
      icon: Share2,
    },
  ];

  return (
    <div className="bg-[#0f172a]/70 border border-slate-800/80 rounded-xl p-4 sm:p-5 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800/60 mb-4 gap-2">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold text-white">
              Programmatic 5-in-1 Automated Pipeline
            </h2>
            <span className="text-[11px] font-mono text-pink-400 bg-pink-950/40 border border-pink-500/30 px-2 py-0.5 rounded-full">
              Linear Execution
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Ingests culinary keywords, structures schema, synthesizes macro visuals, creates WordPress posts, and queues Pinterest pins.
          </p>
        </div>
        {isProcessing && (
          <div className="flex items-center gap-2 text-xs text-indigo-400 font-mono animate-pulse">
            <span className="w-2 h-2 rounded-full bg-indigo-400" />
            <span>Worker Active</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = currentStepId === step.id && isProcessing;

          return (
            <div
              key={step.id}
              onClick={() => onStepClick?.(index)}
              className={`relative p-3.5 rounded-lg border text-left cursor-pointer transition-all ${
                isActive
                  ? 'bg-indigo-950/50 border-indigo-500/80 shadow-md shadow-indigo-500/10 ring-1 ring-indigo-500/40'
                  : 'bg-slate-900/50 border-slate-800/70 hover:border-slate-700/80 hover:bg-slate-900'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div
                  className={`w-7 h-7 rounded-md flex items-center justify-center text-xs ${
                    isActive
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <span className="text-[10px] font-mono text-slate-500">
                  Step 0{index + 1}
                </span>
              </div>
              <div className="font-medium text-xs text-slate-200 truncate">
                {step.name}
              </div>
              <div className="text-[11px] font-medium text-slate-400 truncate mt-0.5">
                {step.label}
              </div>
              <div className="text-[10px] text-slate-500 mt-1 line-clamp-1">
                {step.desc}
              </div>

              {index < steps.length - 1 && (
                <div className="hidden md:block absolute -right-2 top-1/2 -translate-y-1/2 z-10 text-slate-700">
                  <ArrowRight className="w-3 h-3" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
