import React, { useState } from 'react';
import { 
  Trophy, 
  Play, 
  ArrowRight, 
  Camera, 
  Cpu, 
  Users, 
  ChevronRight,
  Clock,
  Sparkles,
  Globe2,
  Dices,
  PlusCircle,
  Compass,
  Layers,
  ShieldCheck,
  Palette,
  Volume2,
  BookOpen,
  Info,
  CheckCircle2,
  Activity
} from 'lucide-react';
import { Tournament, Match, GameId, GameRuleConfig } from '../../types';
import { userProfileStorage, JUDGE_PERSONAS } from '../../services/storage/userProfile';
import { soundEffects } from '../../services/audio/whistle';
import { GameDetailModal } from '../../components/GameDetailModal';

interface DashboardProps {
  games: GameRuleConfig[];
  tournaments: Tournament[];
  activeTournament: Tournament | null;
  recentMatches: Match[];
  onNavigate: (tab: string, meta?: any) => void;
  onSelectGame: (gameId: GameId) => void;
  onSelectMatch: (match: Match) => void;
  onOpenCustomizer?: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  games,
  tournaments,
  activeTournament,
  recentMatches,
  onNavigate,
  onSelectGame,
  onSelectMatch,
  onOpenCustomizer
}) => {
  const profile = userProfileStorage.getProfile();
  const judge = JUDGE_PERSONAS[profile.judgePersona] || JUDGE_PERSONAS.standard;
  const [inspectGame, setInspectGame] = useState<GameRuleConfig | null>(null);

  return (
    <div className="space-y-12">
      
      {/* Hero Tournament Banner */}
      <section className="relative overflow-hidden rounded-3xl navy-card p-8 md:p-12 border border-[#4D6A6D]/50 shadow-2xl bg-gradient-to-br from-[#0c162e] via-[#0a1226] to-[#0c162e]">
        <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-gradient-to-br from-[#4D6A6D]/25 via-[#A0A083]/15 to-transparent blur-3xl pointer-events-none" />
        <div className="absolute right-10 bottom-0 opacity-10 pointer-events-none hidden lg:block">
          <Trophy className="w-96 h-96 text-[#D4AF37]" />
        </div>

        <div className="relative z-10 max-w-2xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#4D6A6D]/30 border border-[#798478]/40 text-[#EAE0CC] text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            Emirates Heritage Technology Competition • AI for Family
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-[#EAE0CC] tracking-tight leading-tight">
            Emirati Traditional Games, <span className="gold-gradient-text">Powered by AI Vision</span>
          </h1>

          <p className="text-[#A0A083] text-base sm:text-lg leading-relaxed">
            FAREEG AI unites families to play beloved Emirati heritage games and world traditions. Capture real camera gameplay, receive automated computer-vision event proposals, and maintain official tournament standings.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={() => onNavigate('tournament-setup')}
              className="gold-button px-6 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-lg"
            >
              <Trophy className="w-4 h-4" />
              <span>Start Tournament</span>
            </button>

            {activeTournament && (
              <button
                onClick={() => onNavigate('leaderboard', { tournamentId: activeTournament.id })}
                className="px-6 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider bg-[#4D6A6D]/30 hover:bg-[#4D6A6D]/50 text-[#EAE0CC] border border-[#798478]/40 flex items-center gap-2 cursor-pointer transition-colors shadow-sm"
              >
                <span>Continue: {activeTournament.name}</span>
                <ArrowRight className="w-4 h-4 text-[#D4AF37]" />
              </button>
            )}

            <button
              onClick={() => onNavigate('camera-arena')}
              className="px-5 py-3.5 rounded-xl font-semibold text-xs uppercase tracking-wider bg-[#060b18] hover:bg-[#0f1b38] text-[#EAE0CC] border border-[#4D6A6D]/50 flex items-center gap-2 cursor-pointer transition-colors"
            >
              <Camera className="w-4 h-4 text-[#D4AF37]" />
              <span>Quick Arena</span>
            </button>
          </div>
        </div>
      </section>

      {/* PERSONALIZED FAMILY MAJLIS & ACTIVE AI JUDGE CARD */}
      <section className="p-6 rounded-2xl navy-card border border-[#4D6A6D]/50 bg-gradient-to-r from-[#0a1326] via-[#0f1b38] to-[#0a1326] shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div 
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-xl border-2 border-[#D4AF37]/50 shrink-0"
            style={{ backgroundColor: profile.primaryColor }}
          >
            {profile.emblemEmoji}
          </div>
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#D4AF37]">
                Your Majlis Arena
              </span>
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-[#4D6A6D]/30 text-[#EAE0CC] font-mono border border-[#798478]/30">
                {profile.emblemName}
              </span>
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-[#C9ADA1]/20 text-[#EAE0CC] border border-[#C9ADA1]/30 font-bold">
                {judge.strictnessLevel}
              </span>
            </div>
            <h3 className="text-xl font-black text-[#EAE0CC] tracking-tight">{profile.familyClanName}</h3>
            <p className="text-xs text-[#A0A083] flex flex-wrap items-center gap-2">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
                Presiding AI Referee: <strong className="text-[#EAE0CC]">{judge.name}</strong>
              </span>
              <span>•</span>
              <span className="text-[#A0A083] italic">"{judge.tagline}"</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 self-stretch sm:self-auto justify-end">
          <button
            type="button"
            onClick={() => soundEffects.playWhistle('short')}
            className="px-3.5 py-2.5 rounded-xl bg-[#4D6A6D]/30 hover:bg-[#4D6A6D]/50 border border-[#798478]/40 text-[#EAE0CC] text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors shadow-sm"
            title="Sound referee whistle"
          >
            <Volume2 className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Sound Whistle</span>
          </button>

          <button
            type="button"
            onClick={onOpenCustomizer}
            className="gold-button px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-md"
          >
            <Palette className="w-3.5 h-3.5" />
            <span>Customize Majlis & Persona</span>
          </button>
        </div>
      </section>

      {/* HERITAGE COLOR PALETTE EXPLANATION SHOWCASE */}
      <section className="p-6 rounded-2xl bg-[#060b18] border border-[#4D6A6D]/40 space-y-4 shadow-lg">
        <div className="flex items-center justify-between border-b border-[#4D6A6D]/30 pb-3">
          <div className="flex items-center gap-2">
            <Palette className="w-5 h-5 text-[#D4AF37]" />
            <h3 className="text-base font-extrabold text-[#EAE0CC] tracking-tight">
              Emirati Cultural Palette Calibration & Arena Interface
            </h3>
          </div>
          <span className="text-[10px] font-mono uppercase text-[#A0A083] px-2.5 py-1 rounded bg-[#4D6A6D]/20 border border-[#798478]/30">
            5-Color Heritage Gamut Active
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          
          <div className="p-3.5 rounded-xl bg-[#0A1326] border border-[#EAE0CC]/30 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: '#EAE0CC' }} />
              <span className="text-[10px] font-mono text-[#EAE0CC]">#EAE0CC</span>
            </div>
            <div className="font-extrabold text-xs text-[#EAE0CC]">Alabaster Pearl</div>
            <p className="text-[11px] text-[#A0A083] leading-tight">
              Official score numerals, verified headlines, and clean rulebook text.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-[#0A1326] border border-[#C9ADA1]/30 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: '#C9ADA1' }} />
              <span className="text-[10px] font-mono text-[#C9ADA1]">#C9ADA1</span>
            </div>
            <div className="font-extrabold text-xs text-[#C9ADA1]">Sand Blush</div>
            <p className="text-[11px] text-[#A0A083] leading-tight">
              Foul notifications, rejected event tags, and low confidence VAR alerts.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-[#0A1326] border border-[#A0A083]/30 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: '#A0A083' }} />
              <span className="text-[10px] font-mono text-[#A0A083]">#A0A083</span>
            </div>
            <div className="font-extrabold text-xs text-[#A0A083]">Muted Sage</div>
            <p className="text-[11px] text-[#A0A083] leading-tight">
              Timestamps, court diagrams, rule citations, and secondary statistics.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-[#0A1326] border border-[#798478]/30 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: '#798478' }} />
              <span className="text-[10px] font-mono text-[#798478]">#798478</span>
            </div>
            <div className="font-extrabold text-xs text-[#798478]">Slate Moss</div>
            <p className="text-[11px] text-[#A0A083] leading-tight">
              Confirmed event containers, court line boundaries, and match history.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-[#0A1326] border border-[#4D6A6D]/30 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: '#4D6A6D' }} />
              <span className="text-[10px] font-mono text-[#4D6A6D]">#4D6A6D</span>
            </div>
            <div className="font-extrabold text-xs text-[#EAE0CC]">Deep Gulf Teal</div>
            <p className="text-[11px] text-[#A0A083] leading-tight">
              AI Judicial verdict cards, camera reticle overlays, and primary frames.
            </p>
          </div>

        </div>
      </section>

      {/* THREE PROMINENT FEATURE EXPANSION TILES */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-[#EAE0CC] tracking-tight">
              Explore, Match & Create
            </h2>
            <p className="text-xs text-[#A0A083] mt-0.5">
              Three interactive pathways connecting your family to tradition and AI innovation.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Cultural Game Explorer */}
          <div
            onClick={() => onNavigate('explorer')}
            className="navy-card rounded-2xl p-6 border border-[#4D6A6D]/40 hover:border-[#D4AF37]/50 transition-all duration-300 cursor-pointer group flex flex-col justify-between space-y-5 shadow-lg bg-[#0a1226]"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#4D6A6D]/30 border border-[#798478]/40 flex items-center justify-center text-[#EAE0CC] group-hover:scale-105 transition-transform">
                <Globe2 className="w-6 h-6 text-[#A0A083]" />
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#A0A083]">Interactive World Map</span>
                <h3 className="text-xl font-black text-[#EAE0CC] group-hover:text-[#D4AF37] transition-colors mt-0.5">
                  Explore Cultures
                </h3>
              </div>

              <p className="text-xs text-[#A0A083] leading-relaxed">
                Discover traditional games across Korea, India, Egypt, France, and the Gulf. Uncover direct historical siblings of Emirati games on a responsive world map.
              </p>
            </div>

            <div className="pt-4 border-t border-[#4D6A6D]/30 flex items-center justify-between text-xs font-bold text-[#EAE0CC]">
              <span>Explore Interactive Map</span>
              <ChevronRight className="w-4 h-4 text-[#D4AF37] group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 2: Surprise Me */}
          <div
            onClick={() => onNavigate('surpriseme')}
            className="navy-card rounded-2xl p-6 border border-[#C9ADA1]/30 hover:border-[#D4AF37]/50 transition-all duration-300 cursor-pointer group flex flex-col justify-between space-y-5 shadow-lg bg-[#0a1226]"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#C9ADA1]/20 border border-[#C9ADA1]/40 flex items-center justify-center text-[#C9ADA1] group-hover:scale-105 transition-transform">
                <Dices className="w-6 h-6 text-[#C9ADA1]" />
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#C9ADA1]">Group Matchmaker</span>
                <h3 className="text-xl font-black text-[#EAE0CC] group-hover:text-[#D4AF37] transition-colors mt-0.5">
                  Surprise Me
                </h3>
              </div>

              <p className="text-xs text-[#A0A083] leading-relaxed">
                Filter by group size, room space, and energy level. Swipe through tailored recommendations or roll the dice for an instant family match pick.
              </p>
            </div>

            <div className="pt-4 border-t border-[#4D6A6D]/30 flex items-center justify-between text-xs font-bold text-[#C9ADA1]">
              <span>Find Tonight's Game</span>
              <ChevronRight className="w-4 h-4 text-[#D4AF37] group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 3: AI Game Creator & Universal Referee */}
          <div
            onClick={() => onNavigate('creator')}
            className="navy-card rounded-2xl p-6 border border-[#D4AF37]/30 hover:border-[#D4AF37]/60 transition-all duration-300 cursor-pointer group flex flex-col justify-between space-y-5 shadow-lg bg-[#0a1226]"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] group-hover:scale-105 transition-transform">
                <Sparkles className="w-6 h-6 text-[#D4AF37]" />
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#D4AF37]">Universal AI Judge</span>
                <h3 className="text-xl font-black text-[#EAE0CC] group-hover:text-[#D4AF37] transition-colors mt-0.5">
                  Create Your Own Game
                </h3>
              </div>

              <p className="text-xs text-[#A0A083] leading-relaxed">
                Describe any playground or majlis game. FAREEG AI generates official scoring mechanics, camera placement instructions, and automated referee rules.
              </p>
            </div>

            <div className="pt-4 border-t border-[#4D6A6D]/30 flex items-center justify-between text-xs font-bold text-[#EAE0CC]">
              <span>Design Custom Game</span>
              <ChevronRight className="w-4 h-4 text-[#D4AF37] group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

        </div>
      </section>

      {/* CORE 5 EMIRATI TRADITIONAL GAMES GRID */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-[#EAE0CC] tracking-tight">
              Emirati Heritage Games Catalogue
            </h2>
            <p className="text-xs text-[#A0A083] mt-0.5">
              Select a traditional game to launch your camera match session or inspect the rulebook.
            </p>
          </div>

          <button
            onClick={() => onNavigate('games')}
            className="text-xs text-[#D4AF37] hover:underline font-bold flex items-center gap-1 cursor-pointer"
          >
            <span>View Full Catalogue</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.slice(0, 5).map(game => (
            <div
              key={game.id}
              className="navy-card rounded-2xl p-6 border border-[#4D6A6D]/40 flex flex-col justify-between hover:border-[#D4AF37]/50 transition-all duration-300 group shadow-lg bg-[#0a1226]"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-full bg-[#4D6A6D]/30 text-[#EAE0CC] border border-[#798478]/30">
                    {game.category}
                  </span>
                  <span className="text-xs text-[#A0A083] font-mono">
                    {game.flagEmoji || '🇦🇪'}
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-extrabold text-[#EAE0CC] group-hover:text-[#D4AF37] transition-colors">
                    {game.name}
                  </h3>
                  <p className="text-sm font-bold text-[#D4AF37] font-arabic mt-0.5">
                    {game.arabicName}
                  </p>
                  <p className="text-xs text-[#A0A083] italic mt-1">
                    "{game.tagline}"
                  </p>
                </div>

                <p className="text-xs text-[#A0A083] leading-relaxed line-clamp-2">
                  {game.description}
                </p>

                <div className="p-3 rounded-xl bg-[#060b18] border border-[#4D6A6D]/30 space-y-1.5 text-xs">
                  <div className="flex items-start gap-2 text-[#EAE0CC]">
                    <Camera className="w-3.5 h-3.5 text-[#D4AF37] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold block text-[#EAE0CC]">Camera Setup:</span>
                      <span className="text-[#A0A083] text-[11px]">{game.recommendedAngle}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-5 mt-4 border-t border-[#4D6A6D]/30 space-y-2">
                <button
                  onClick={() => setInspectGame(game)}
                  className="w-full py-2.5 rounded-xl bg-[#4D6A6D]/30 hover:bg-[#4D6A6D]/50 text-[#EAE0CC] border border-[#798478]/40 text-xs font-bold tracking-wider uppercase flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <BookOpen className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Inspect Rulebook</span>
                </button>

                <button
                  onClick={() => onSelectGame(game.id as GameId)}
                  className="w-full py-3 rounded-xl gold-button text-xs font-bold tracking-wider uppercase flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Launch Arena Match</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW AI JUDGE & VAR ENGINE WORKS */}
      <section className="p-6 md:p-8 rounded-3xl navy-card border border-[#4D6A6D]/40 space-y-6 shadow-xl bg-gradient-to-r from-[#0a1226] via-[#0f1b38] to-[#0a1226]">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#D4AF37] uppercase tracking-wider">
            <Cpu className="w-4 h-4 text-[#D4AF37]" />
            Architecture & Camera Vision
          </div>
          <h3 className="text-2xl font-black text-[#EAE0CC] tracking-tight">
            How FAREEG AI Computer Vision Works
          </h3>
          <p className="text-xs text-[#A0A083] max-w-2xl">
            A modular computer-vision pipeline built to ensure family fair-play while keeping humans in loop.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="p-5 rounded-2xl bg-[#060b18] border border-[#4D6A6D]/30 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-[#4D6A6D]/30 border border-[#798478]/40 flex items-center justify-center text-[#EAE0CC] font-mono font-bold text-xs">
              1
            </div>
            <h4 className="text-sm font-bold text-[#EAE0CC]">Browser Media Stream</h4>
            <p className="text-xs text-[#A0A083] leading-relaxed">
              Standard smartphone or webcam video stream captured via `getUserMedia` and `MediaRecorder`.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#060b18] border border-[#4D6A6D]/30 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-[#798478]/30 border border-[#798478]/50 flex items-center justify-center text-[#EAE0CC] font-mono font-bold text-xs">
              2
            </div>
            <h4 className="text-sm font-bold text-[#EAE0CC]">OpenCV Kinematic Tracking</h4>
            <p className="text-xs text-[#A0A083] leading-relaxed">
              Game-specific detectors track ball trajectories, ring boundaries, marble knockouts, or freeze tags.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#060b18] border border-[#4D6A6D]/30 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] font-mono font-bold text-xs">
              3
            </div>
            <h4 className="text-sm font-bold text-[#EAE0CC]">Host Judicial Review</h4>
            <p className="text-xs text-[#A0A083] leading-relaxed">
              Every candidate event is flagged with a timestamp and circular certainty gauge for family confirmation.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#060b18] border border-[#4D6A6D]/30 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-[#C9ADA1]/20 border border-[#C9ADA1]/40 flex items-center justify-center text-[#C9ADA1] font-mono font-bold text-xs">
              4
            </div>
            <h4 className="text-sm font-bold text-[#EAE0CC]">Deterministic Score</h4>
            <p className="text-xs text-[#A0A083] leading-relaxed">
              Official scoring rules update match standings, clan leaderboards, and tournament brackets.
            </p>
          </div>

        </div>
      </section>

      {/* Two Column Section: Recent Matches & Leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Recent Matches */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-[#EAE0CC] flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#D4AF37]" />
              <span>Recent Arena Matches</span>
            </h3>
            <button
              onClick={() => onNavigate('camera-arena')}
              className="text-xs text-[#D4AF37] hover:underline font-semibold cursor-pointer"
            >
              + New Match
            </button>
          </div>

          <div className="space-y-3">
            {recentMatches.length === 0 ? (
              <div className="navy-card rounded-2xl p-8 text-center text-[#A0A083] text-xs bg-[#0a1226]">
                <p>No matches recorded yet. Start your first match from the arena!</p>
              </div>
            ) : (
              recentMatches.slice(0, 4).map(match => {
                const game = games.find(g => g.id === match.gameId);
                const scoreA = match.scores[match.teamA.id] || 0;
                const scoreB = match.scores[match.teamB.id] || 0;

                return (
                  <div
                    key={match.id}
                    onClick={() => onSelectMatch(match)}
                    className="navy-card rounded-xl p-4 flex items-center justify-between cursor-pointer hover:border-[#D4AF37]/50 transition-all border border-[#4D6A6D]/30 bg-[#0a1226]"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#D4AF37]">
                          {game?.name || match.gameId}
                        </span>
                        <span className="text-[#798478] text-xs">•</span>
                        <span className="text-[11px] text-[#A0A083] capitalize">
                          {match.tournamentName || 'Quick Match'}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm font-bold text-[#EAE0CC]">
                        <span className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: match.teamA.color || '#D4AF37' }} />
                          {match.teamA.name}
                        </span>
                        <span className="font-mono text-base text-[#EAE0CC] px-2 py-0.5 rounded bg-[#060b18] border border-[#4D6A6D]/30">
                          {scoreA} : {scoreB}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: match.teamB.color || '#3b82f6' }} />
                          {match.teamB.name}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full border ${
                        match.status === 'completed' 
                          ? 'bg-[#798478]/30 text-[#EAE0CC] border-[#798478]/50'
                          : match.status === 'reviewing'
                          ? 'bg-[#4D6A6D]/30 text-[#EAE0CC] border-[#4D6A6D]/50'
                          : 'bg-[#C9ADA1]/20 text-[#C9ADA1] border-[#C9ADA1]/30'
                      }`}>
                        {match.status}
                      </span>
                      <ChevronRight className="w-4 h-4 text-[#A0A083]" />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>

        {/* Current Leaderboard Standings Preview */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-[#EAE0CC] flex items-center gap-2">
              <Trophy className="w-5 h-5 text-[#D4AF37]" />
              <span>Tournament Standings</span>
            </h3>
            <button
              onClick={() => onNavigate('leaderboard')}
              className="text-xs text-[#D4AF37] hover:underline font-semibold cursor-pointer"
            >
              Full Leaderboard
            </button>
          </div>

          <div className="navy-card rounded-2xl p-5 border border-[#4D6A6D]/40 space-y-4 bg-[#0a1226]">
            <div className="flex items-center justify-between text-xs font-semibold text-[#A0A083] border-b border-[#4D6A6D]/30 pb-3">
              <span>Team</span>
              <div className="flex items-center gap-6">
                <span>P</span>
                <span>W</span>
                <span>PTS</span>
              </div>
            </div>

            {activeTournament && activeTournament.teams.length > 0 ? (
              <div className="space-y-2.5">
                {activeTournament.teams.map((team, idx) => (
                  <div
                    key={team.id}
                    className="flex items-center justify-between text-sm py-2 px-3 rounded-xl bg-[#060b18] border border-[#4D6A6D]/20 hover:border-[#4D6A6D]/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-extrabold ${
                        idx === 0 ? 'bg-[#D4AF37] text-[#060b18]' : 'bg-[#4D6A6D]/30 text-[#EAE0CC]'
                      }`}>
                        {idx + 1}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: team.color }} />
                        <span className="font-semibold text-[#EAE0CC]">{team.name}</span>
                        {team.arabicName && (
                          <span className="text-xs text-[#A0A083] hidden sm:inline font-arabic">({team.arabicName})</span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-6 font-mono text-xs">
                      <span className="text-[#A0A083]">1</span>
                      <span className="text-[#A0A083]">{idx === 0 ? 1 : 0}</span>
                      <span className="font-extrabold text-[#EAE0CC]">{idx === 0 ? 3 : 0}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-xs text-[#A0A083]">
                <p>Create or select a tournament to track standings.</p>
                <button
                  onClick={() => onNavigate('tournament-setup')}
                  className="mt-3 gold-button px-4 py-2 rounded-xl text-xs font-bold"
                >
                  Create Tournament
                </button>
              </div>
            )}
          </div>
        </section>

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
