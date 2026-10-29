import React, { useState } from 'react';
import { 
  Gamepad2, 
  Camera, 
  Play, 
  Info, 
  ShieldCheck, 
  Users, 
  BookOpen,
  Palette,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { GameId, GameRuleConfig } from '../../types';
import { ALL_GAMES } from '../../config/games';
import { GameDetailModal } from '../../components/GameDetailModal';

interface GameSelectionProps {
  onSelectGame: (gameId: GameId) => void;
  onNavigateArena: () => void;
}

export const GameSelection: React.FC<GameSelectionProps> = ({ onSelectGame, onNavigateArena }) => {
  const [inspectGame, setInspectGame] = useState<GameRuleConfig | null>(null);

  return (
    <div className="space-y-8">
      
      {/* Title & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#4D6A6D]/30 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#D4AF37] uppercase tracking-wider mb-1">
            <Gamepad2 className="w-4 h-4" />
            Emirati Heritage Games Catalogue
          </div>
          <h1 className="text-3xl font-black text-[#EAE0CC] tracking-tight">
            Traditional Games & AI Camera Arena
          </h1>
          <p className="text-sm text-[#A0A083] mt-1 max-w-2xl">
            Select a traditional game to launch your camera match session or inspect the full official rulebook and court layout.
          </p>
        </div>

        <button
          onClick={onNavigateArena}
          className="gold-button px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-2 self-start cursor-pointer shadow-lg"
        >
          <Camera className="w-4 h-4" />
          <span>Open Arena Camera</span>
        </button>
      </div>

      {/* Heritage Color Palette Guide Bar */}
      <div className="p-4 rounded-2xl bg-[#060b18] border border-[#4D6A6D]/40 flex flex-col md:flex-row items-center justify-between gap-4 text-xs shadow-md">
        <div className="flex items-center gap-3">
          <Palette className="w-5 h-5 text-[#D4AF37] shrink-0" />
          <div>
            <span className="font-extrabold text-[#EAE0CC] block">Heritage Palette System:</span>
            <span className="text-[#A0A083]">Alabaster Pearl (#EAE0CC) • Sand Blush (#C9ADA1) • Muted Sage (#A0A083) • Slate Moss (#798478) • Deep Gulf Teal (#4D6A6D)</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[11px] font-mono text-[#A0A083]">
          <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
          <span>5 Core Games & Custom AI Games</span>
        </div>
      </div>

      {/* Game Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ALL_GAMES.map((game, index) => (
          <div
            key={game.id}
            className="navy-card rounded-2xl p-6 border border-[#4D6A6D]/40 flex flex-col justify-between hover:border-[#D4AF37]/60 transition-all duration-300 group shadow-lg bg-[#0a1226]"
          >
            <div className="space-y-4">
              
              {/* Header Badge */}
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#EAE0CC] px-2.5 py-1 rounded-full bg-[#4D6A6D]/40 border border-[#798478]/40">
                  {game.category}
                </span>
                <span className="text-xs text-[#A0A083] font-mono">0{index + 1}</span>
              </div>

              {/* Title & Arabic name */}
              <div>
                <h3 className="text-xl font-extrabold text-[#EAE0CC] group-hover:text-[#D4AF37] transition-colors flex items-center gap-2">
                  <span>{game.name}</span>
                </h3>
                <p className="text-sm font-bold text-[#D4AF37] font-arabic mt-0.5">
                  {game.arabicName}
                </p>
                <p className="text-xs text-[#A0A083] italic mt-1">
                  "{game.tagline}"
                </p>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-300 leading-relaxed">
                {game.description}
              </p>

              <div className="p-3 rounded-xl bg-[#060b18] border border-[#4D6A6D]/30 space-y-2 text-xs">
                <div className="flex items-start gap-2 text-[#EAE0CC]">
                  <Camera className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block text-[#EAE0CC]">Camera Setup:</span>
                    <span className="text-[#A0A083] text-[11px]">{game.recommendedAngle}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-[#A0A083] text-[11px] pt-1.5 border-t border-[#4D6A6D]/20">
                  <Users className="w-3.5 h-3.5 text-[#C9ADA1] shrink-0" />
                  <span>Team Size: <strong className="text-[#EAE0CC]">{game.playersPerTeam}</strong></span>
                </div>
              </div>

              {/* Scoring rules summary */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#A0A083] block">
                  Scoring Events:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {game.scoringRules.map(rule => (
                    <span
                      key={rule.eventType}
                      className="text-[11px] px-2 py-0.5 rounded-lg bg-[#4D6A6D]/20 border border-[#798478]/40 text-[#EAE0CC]"
                    >
                      {rule.label} ({rule.points > 0 ? `+${rule.points} pt` : 'Review'})
                    </span>
                  ))}
                </div>
              </div>

              {/* Cultural Note Notice */}
              <div className="text-[11px] text-[#A0A083] bg-[#4D6A6D]/10 p-2.5 rounded-xl border border-[#4D6A6D]/30 flex items-start gap-1.5">
                <Info className="w-3.5 h-3.5 text-[#D4AF37] shrink-0 mt-0.5" />
                <span>{game.rulesPlaceholderNote}</span>
              </div>

            </div>

            {/* Action Buttons */}
            <div className="pt-6 mt-4 border-t border-[#4D6A6D]/30 space-y-2">
              <button
                onClick={() => setInspectGame(game)}
                className="w-full py-2.5 rounded-xl bg-[#4D6A6D]/30 hover:bg-[#4D6A6D]/60 text-[#EAE0CC] border border-[#798478]/40 text-xs font-bold tracking-wider uppercase flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <BookOpen className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Inspect Full Rulebook & Guide</span>
              </button>

              <button
                onClick={() => onSelectGame(game.id as GameId)}
                className="w-full py-3 rounded-xl gold-button text-xs font-bold tracking-wider uppercase flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Select & Launch Match</span>
              </button>
            </div>

          </div>
        ))}
      </div>

      {/* Rulebook Modal */}
      {inspectGame && (
        <GameDetailModal
          game={inspectGame}
          onClose={() => setInspectGame(null)}
          onLaunchMatch={(gameId) => {
            setInspectGame(null);
            onSelectGame(gameId);
          }}
        />
      )}

    </div>
  );
};
