import React, { useState } from 'react';
import { 
  X, 
  BookOpen, 
  Camera, 
  Layers, 
  ShieldCheck, 
  Globe2, 
  Users, 
  Clock, 
  CheckCircle2, 
  Play, 
  Sparkles,
  Palette,
  Award,
  Maximize2
} from 'lucide-react';
import { GameRuleConfig, GameId } from '../types';

interface GameDetailModalProps {
  game: GameRuleConfig | null;
  onClose: () => void;
  onLaunchMatch: (gameId: GameId) => void;
}

/**
 * GameDetailModal
 * High-density, professional rulebook, court layout, equipment guide,
 * and AI referee camera manual for every traditional game.
 * Styled rigorously using the official 5-color palette:
 * - #EAE0CC (Alabaster Pearl / Cream)
 * - #C9ADA1 (Desert Rose / Sand Blush)
 * - #A0A083 (Muted Sage)
 * - #798478 (Slate Moss / Mineral)
 * - #4D6A6D (Deep Gulf Teal)
 */
export const GameDetailModal: React.FC<GameDetailModalProps> = ({
  game,
  onClose,
  onLaunchMatch
}) => {
  if (!game) return null;

  const [activeTab, setActiveTab] = useState<'rules' | 'equipment' | 'ai_camera' | 'heritage'>('rules');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="navy-card rounded-3xl p-6 sm:p-8 border border-[#4D6A6D]/60 max-w-3xl w-full my-8 space-y-6 shadow-2xl bg-[#0a1224] relative">
        
        {/* Modal Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full bg-[#4D6A6D]/20 hover:bg-[#4D6A6D]/40 text-[#A0A083] hover:text-[#EAE0CC] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="space-y-3 border-b border-[#4D6A6D]/30 pb-5 pr-10">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full bg-[#4D6A6D]/30 text-[#EAE0CC] border border-[#798478]/40">
              {game.flagEmoji} {game.country || 'United Arab Emirates'}
            </span>
            <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#C9ADA1]/20 text-[#EAE0CC] border border-[#C9ADA1]/30">
              Energy: {game.energyLevel || 'Active'}
            </span>
            <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#A0A083]/20 text-[#EAE0CC] border border-[#A0A083]/30">
              Location: {game.locationType || 'Indoor/Outdoor'}
            </span>
          </div>

          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#EAE0CC] tracking-tight flex items-center gap-3">
              <span>{game.name}</span>
              <span className="text-lg font-bold font-arabic text-[#D4AF37]">
                ({game.arabicName})
              </span>
            </h2>
            <p className="text-sm text-[#A0A083] mt-1 italic">
              "{game.tagline}"
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs text-[#EAE0CC] pt-1">
            <span className="flex items-center gap-1.5">
              <Users className="w-4 h-4 text-[#A0A083]" />
              <strong>{game.playersPerTeam}</strong>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-[#A0A083]" />
              <strong>{game.durationMinutes || 15} min match</strong>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5 text-[#C9ADA1]">
              <Layers className="w-4 h-4 text-[#C9ADA1]" />
              <strong>Category: {game.category}</strong>
            </span>
          </div>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-[#060b18] border border-[#4D6A6D]/40 text-xs font-bold overflow-x-auto">
          <button
            onClick={() => setActiveTab('rules')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
              activeTab === 'rules'
                ? 'bg-[#4D6A6D] text-[#EAE0CC] shadow-md'
                : 'text-[#A0A083] hover:text-[#EAE0CC]'
            }`}
          >
            <BookOpen className="w-4 h-4 text-[#D4AF37]" />
            <span>Rules & Scoring</span>
          </button>

          <button
            onClick={() => setActiveTab('equipment')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
              activeTab === 'equipment'
                ? 'bg-[#4D6A6D] text-[#EAE0CC] shadow-md'
                : 'text-[#A0A083] hover:text-[#EAE0CC]'
            }`}
          >
            <Layers className="w-4 h-4 text-[#C9ADA1]" />
            <span>Equipment & Court</span>
          </button>

          <button
            onClick={() => setActiveTab('ai_camera')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
              activeTab === 'ai_camera'
                ? 'bg-[#4D6A6D] text-[#EAE0CC] shadow-md'
                : 'text-[#A0A083] hover:text-[#EAE0CC]'
            }`}
          >
            <Camera className="w-4 h-4 text-[#D4AF37]" />
            <span>AI Camera Guide</span>
          </button>

          <button
            onClick={() => setActiveTab('heritage')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
              activeTab === 'heritage'
                ? 'bg-[#4D6A6D] text-[#EAE0CC] shadow-md'
                : 'text-[#A0A083] hover:text-[#EAE0CC]'
            }`}
          >
            <Globe2 className="w-4 h-4 text-[#A0A083]" />
            <span>Heritage & History</span>
          </button>
        </div>

        {/* Modal Tab Content */}
        <div className="space-y-4 min-h-[220px]">
          
          {/* TAB 1: RULES & SCORING */}
          {activeTab === 'rules' && (
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-[#4D6A6D]/15 border border-[#4D6A6D]/30 space-y-2">
                <h4 className="font-extrabold text-sm text-[#EAE0CC] flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-[#D4AF37]" />
                  Game Summary & Objective
                </h4>
                <p className="text-[#A0A083] leading-relaxed">
                  {game.description}
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-extrabold text-xs uppercase text-[#EAE0CC] tracking-wider flex items-center gap-2">
                  <Award className="w-4 h-4 text-[#D4AF37]" />
                  Official Scoring Events Matrix
                </h4>

                <div className="space-y-2">
                  {game.scoringRules.map(rule => (
                    <div
                      key={rule.eventType}
                      className="p-3 rounded-xl bg-[#060b18] border border-[#4D6A6D]/30 flex items-start justify-between gap-3"
                    >
                      <div>
                        <div className="font-extrabold text-sm text-[#EAE0CC]">
                          {rule.label}
                        </div>
                        <p className="text-[#A0A083] text-[11px] mt-0.5">
                          {rule.description}
                        </p>
                      </div>
                      <span className="px-3 py-1 rounded-lg bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#EAE0CC] font-mono font-black text-xs shrink-0">
                        +{rule.points} pt
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {game.rulesPlaceholderNote && (
                <div className="p-3 rounded-xl bg-[#C9ADA1]/15 border border-[#C9ADA1]/30 text-[11px] text-[#EAE0CC] flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#C9ADA1] shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-[#C9ADA1]">Umpire Customization Note:</strong>
                    <span>{game.rulesPlaceholderNote}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: EQUIPMENT & COURT */}
          {activeTab === 'equipment' && (
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-[#060b18] border border-[#4D6A6D]/30 space-y-3">
                <h4 className="font-extrabold text-sm text-[#EAE0CC] flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#C9ADA1]" />
                  Required Playing Equipment
                </h4>
                <div className="p-3 rounded-xl bg-[#4D6A6D]/20 border border-[#4D6A6D]/40 text-[#EAE0CC] font-medium leading-relaxed">
                  {game.equipmentNeeded || 'Standard physical game items'}
                </div>
              </div>

              {/* Court Layout Visual Representation */}
              <div className="p-4 rounded-2xl bg-[#060b18] border border-[#4D6A6D]/30 space-y-3">
                <h4 className="font-extrabold text-sm text-[#EAE0CC] flex items-center gap-2">
                  <Maximize2 className="w-4 h-4 text-[#A0A083]" />
                  Arena Boundary & Playing Ring Layout
                </h4>

                <div className="p-6 rounded-xl bg-gradient-to-br from-[#0c162e] via-[#080f22] to-[#0c162e] border border-[#798478]/40 text-center space-y-3 relative overflow-hidden">
                  <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#4D6A6D_1px,transparent_1px)] [background-size:16px_16px]" />
                  
                  <div className="relative z-10 max-w-md mx-auto space-y-2">
                    <div className="inline-block px-4 py-1.5 rounded-full bg-[#4D6A6D]/40 border border-[#A0A083]/40 text-[#EAE0CC] font-mono text-xs">
                      {game.name} Official Field Area
                    </div>
                    <p className="text-[11px] text-[#A0A083]">
                      Recommended playing boundary size: 2m x 2m clear space with good lighting and unobstructed camera view.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: AI CAMERA GUIDE */}
          {activeTab === 'ai_camera' && (
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-[#4D6A6D]/20 border border-[#4D6A6D]/40 space-y-3">
                <h4 className="font-extrabold text-sm text-[#EAE0CC] flex items-center gap-2">
                  <Camera className="w-4 h-4 text-[#D4AF37]" />
                  Camera Tripod Placement Instructions
                </h4>
                <p className="text-[#A0A083] leading-relaxed">
                  {game.cameraSetupInstructions}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-[#060b18] border border-[#4D6A6D]/30 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-[#A0A083]">Optimal Camera Angle</span>
                  <p className="font-extrabold text-xs text-[#EAE0CC]">
                    {game.recommendedAngle}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-[#060b18] border border-[#4D6A6D]/30 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-[#A0A083]">CV Detector Protocol</span>
                  <p className="font-extrabold text-xs text-[#EAE0CC]">
                    Multi-frame boundary & velocity tracking
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#798478]/20 border border-[#798478]/40 text-[11px] text-[#EAE0CC] space-y-1">
                <span className="font-bold text-[#D4AF37] block">Refining Computer Vision Accuracy:</span>
                <p className="text-[#A0A083]">
                  Avoid harsh direct backlighting or moving background shadows. Ensure contrasting colors between game pieces, players, and the floor surface.
                </p>
              </div>
            </div>
          )}

          {/* TAB 4: HERITAGE & HISTORY */}
          {activeTab === 'heritage' && (
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-[#C9ADA1]/15 border border-[#C9ADA1]/30 space-y-2">
                <h4 className="font-extrabold text-sm text-[#EAE0CC] flex items-center gap-2">
                  <Globe2 className="w-4 h-4 text-[#C9ADA1]" />
                  Emirati Cultural History
                </h4>
                <p className="text-[#A0A083] leading-relaxed">
                  {game.culturalBackground}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#060b18] border border-[#4D6A6D]/30 space-y-2">
                <h4 className="font-extrabold text-sm text-[#EAE0CC] flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                  Global Cultural Connections
                </h4>
                <p className="text-[#A0A083] leading-relaxed">
                  {game.culturalConnections || 'Played across traditional communities around the world with identical dexterity and sportsmanship values.'}
                </p>
              </div>
            </div>
          )}

        </div>

        {/* Modal Action Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#4D6A6D]/30">
          <div className="text-xs text-[#A0A083] flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
            <span>Official FAREEG AI Rulebook Certified</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-[#A0A083] hover:text-[#EAE0CC] cursor-pointer"
            >
              Close Rulebook
            </button>

            <button
              type="button"
              onClick={() => {
                onClose();
                onLaunchMatch(game.id as GameId);
              }}
              className="gold-button px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-lg"
            >
              <Play className="w-4 h-4" />
              <span>Launch {game.name} Match</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
