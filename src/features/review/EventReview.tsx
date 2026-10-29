import React, { useState, useEffect, useRef } from 'react';
import { 
  Check, 
  X, 
  Play, 
  Plus, 
  AlertCircle, 
  CheckCircle2, 
  HelpCircle, 
  ShieldCheck, 
  Trophy, 
  Sparkles,
  ArrowRight,
  Clock,
  RotateCcw,
  Volume2,
  CheckCheck,
  Palette,
  Activity
} from 'lucide-react';
import { Match, ProposedEvent, ReviewStatus } from '../../types';
import { GAMES_CONFIG } from '../../config/games';
import { api } from '../../services/api/client';
import { soundEffects } from '../../services/audio/whistle';
import { userProfileStorage, JUDGE_PERSONAS } from '../../services/storage/userProfile';
import { ConfidenceMeter } from './ConfidenceMeter';

interface EventReviewProps {
  jobId?: string;
  match: Match;
  onMatchFinalized: (match: Match) => void;
  onBack: () => void;
}

export const EventReview: React.FC<EventReviewProps> = ({
  jobId,
  match,
  onMatchFinalized,
  onBack
}) => {
  const [events, setEvents] = useState<ProposedEvent[]>([]);
  const [currentScores, setCurrentScores] = useState<Record<string, number>>(match.scores || {});
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'rejected'>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Video player reference for jumping to timestamp
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Manual host event modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [manualEventType, setManualEventType] = useState('');
  const [manualTeamId, setManualTeamId] = useState(match.teamA.id);
  const [manualTimestamp, setManualTimestamp] = useState(0);
  const [manualPoints, setManualPoints] = useState(1);
  const [manualNotes, setManualNotes] = useState('');

  // Host match finalization notes
  const [hostNotes, setHostNotes] = useState(match.hostNotes || '');
  const [isFinalizing, setIsFinalizing] = useState(false);

  const game = GAMES_CONFIG[match.gameId] || {
    id: match.gameId,
    name: match.gameId.replace('ai_', 'Custom: ').replace('_', ' '),
    arabicName: '',
    scoringRules: []
  };

  // Load events
  useEffect(() => {
    loadEvents();
  }, [match.id, jobId]);

  const loadEvents = async () => {
    setIsLoading(true);
    try {
      if (jobId) {
        const res = await api.getJobEvents(jobId);
        setEvents(res.events || []);
      } else {
        const m = await api.getMatch(match.id);
        setEvents(m.events || []);
        setCurrentScores(m.scores || {});
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load proposed match events');
    } finally {
      setIsLoading(false);
    }
  };

  const userProfile = userProfileStorage.getProfile();
  const judgeInfo = JUDGE_PERSONAS[userProfile.judgePersona] || JUDGE_PERSONAS.standard;

  // Confirm or reject event
  const handleReview = async (eventId: string, newStatus: ReviewStatus) => {
    try {
      if (newStatus === 'confirmed') {
        soundEffects.playScoreChime();
      } else {
        soundEffects.playWhistle('short');
      }
      const res = await api.reviewEvent(eventId, newStatus);
      
      // Update local events list
      setEvents(prev => prev.map(e => e.id === eventId ? res.event : e));
      setCurrentScores(res.matchScores);
    } catch (err: any) {
      setError(err.message || 'Failed to review event');
    }
  };

  // 1-Click Accept All AI Judge Decisions
  const handleAcceptAllJudgeDecisions = async () => {
    const pendingEvents = events.filter(e => e.reviewStatus === 'pending');
    if (pendingEvents.length === 0) return;

    soundEffects.playScoreChime();
    setIsLoading(true);
    try {
      for (const evt of pendingEvents) {
        await api.reviewEvent(evt.id, 'confirmed');
      }
      await loadEvents();
    } catch (err: any) {
      setError(err.message || 'Failed to batch confirm AI decisions');
    } finally {
      setIsLoading(false);
    }
  };

  // Jump video player to event timestamp
  const handleJumpToVideo = (timestampSeconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(0, timestampSeconds - 1);
      videoRef.current.play().catch(() => {});
    }
  };

  // Add manual host event
  const handleAddManualEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualEventType) return;

    try {
      const rule = game?.scoringRules.find(r => r.eventType === manualEventType);
      const res = await api.addHostEvent(match.id, {
        eventType: manualEventType,
        eventLabel: rule ? rule.label : manualEventType,
        teamId: manualTeamId,
        timestampSeconds: manualTimestamp,
        pointsAwarded: manualPoints,
        notes: manualNotes || 'Host manually logged event'
      });

      setEvents(prev => [...prev, res.data]);
      setCurrentScores(res.updatedScores);
      setShowAddModal(false);
      setManualNotes('');
    } catch (err: any) {
      setError(err.message || 'Failed to add host event');
    }
  };

  // Finalize match and calculate official winner
  const handleFinalize = async () => {
    setIsFinalizing(true);
    setError(null);
    try {
      const { match: finalizedMatch } = await api.finalizeMatch(match.id, {
        hostNotes: hostNotes.trim() || undefined,
        durationSeconds: match.durationSeconds || 60
      });

      onMatchFinalized(finalizedMatch);
    } catch (err: any) {
      setError(err.message || 'Failed to finalize match');
    } finally {
      setIsFinalizing(false);
    }
  };

  const filteredEvents = events.filter(e => {
    if (filter === 'all') return true;
    return e.reviewStatus === filter;
  });

  const pendingCount = events.filter(e => e.reviewStatus === 'pending').length;
  const confirmedCount = events.filter(e => e.reviewStatus === 'confirmed').length;

  const scoreA = currentScores[match.teamA.id] || 0;
  const scoreB = currentScores[match.teamB.id] || 0;

  // AI Vision Optical Certainty metrics across all match events
  const avgConfidence = events.length > 0
    ? events.reduce((sum, e) => sum + (e.confidence ?? 0.85), 0) / events.length
    : 0.89;

  const highConfCount = events.filter(e => (e.confidence ?? 0.85) >= 0.85).length;
  const modConfCount = events.filter(e => (e.confidence ?? 0.85) >= 0.70 && (e.confidence ?? 0.85) < 0.85).length;
  const lowConfCount = events.filter(e => (e.confidence ?? 0.85) < 0.70).length;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#4D6A6D]/30 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#D4AF37] uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4" />
            Host-In-The-Loop Judicial Review
          </div>
          <h1 className="text-3xl font-black text-[#EAE0CC] tracking-tight flex items-center gap-3">
            <span>Review Gameplay Events</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#4D6A6D]/30 text-[#EAE0CC] border border-[#A0A083]/40 font-bold font-arabic">
              {game?.name} ({game?.arabicName})
            </span>
          </h1>
          <p className="text-xs text-[#A0A083] mt-1">
            Review every AI-detected candidate event. Only confirmed events update the official scoreboard.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 rounded-xl bg-[#4D6A6D]/30 hover:bg-[#4D6A6D]/50 text-[#EAE0CC] text-xs font-bold flex items-center gap-2 cursor-pointer self-start sm:self-auto border border-[#798478]/40 shadow-sm transition-all"
        >
          <Plus className="w-4 h-4 text-[#D4AF37]" />
          <span>Add Host Manual Event</span>
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Live Match Scoreboard Bar */}
      <div className="navy-card rounded-2xl p-5 border border-[#D4AF37]/35 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl bg-gradient-to-r from-[#060B18] via-[#0A1326] to-[#060B18]">
        <div className="flex items-center gap-4 text-center md:text-left">
          <div className="flex items-center gap-3">
            <span className="w-4 h-4 rounded-full ring-2 ring-white/20" style={{ backgroundColor: match.teamA.color }} />
            <div>
              <div className="text-sm font-extrabold text-[#EAE0CC]">{match.teamA.name}</div>
              <div className="text-[10px] text-[#A0A083]">Team Side A</div>
            </div>
          </div>

          <div className="px-6 py-2 rounded-xl bg-[#060B18] border border-[#4D6A6D]/40 flex items-center gap-3 font-mono shadow-inner">
            <span className="text-3xl font-black text-[#EAE0CC]">{scoreA}</span>
            <span className="text-[#798478] text-xl">:</span>
            <span className="text-3xl font-black text-[#D4AF37]">{scoreB}</span>
          </div>

          <div className="flex items-center gap-3">
            <div>
              <div className="text-sm font-extrabold text-[#EAE0CC]">{match.teamB.name}</div>
              <div className="text-[10px] text-[#A0A083]">Team Side B</div>
            </div>
            <span className="w-4 h-4 rounded-full ring-2 ring-white/20" style={{ backgroundColor: match.teamB.color }} />
          </div>
        </div>

        {/* Quick Review Progress */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="text-right text-xs">
            <div className="text-slate-300">
              <strong className="text-[#EAE0CC] font-mono">{confirmedCount}</strong> Confirmed • <strong className="text-[#D4AF37] font-mono">{pendingCount}</strong> Pending
            </div>
            <div className="text-[11px] text-[#A0A083]">
              {pendingCount === 0 ? 'All events resolved' : 'Pending host review'}
            </div>
          </div>

          {pendingCount > 0 && (
            <button
              onClick={handleAcceptAllJudgeDecisions}
              disabled={isLoading}
              className="px-4 py-3 rounded-xl bg-[#4D6A6D] hover:bg-[#4D6A6D]/80 border border-[#A0A083]/40 text-[#EAE0CC] font-extrabold text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-md transition-all"
              title="1-Click accept all pending events ruled by AI Judge"
            >
              <CheckCheck className="w-4 h-4 text-[#D4AF37]" />
              <span>Accept All AI ({pendingCount})</span>
            </button>
          )}

          <button
            onClick={handleFinalize}
            disabled={isFinalizing}
            className="gold-button px-6 py-3 rounded-xl font-black text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-lg disabled:opacity-50"
          >
            <Trophy className="w-4 h-4" />
            <span>Finalize Match Score</span>
          </button>
        </div>
      </div>

      {/* AI Model Optical Certainty & Palette Calibration Bar */}
      <div className="rounded-2xl p-4 md:p-5 border border-[#4D6A6D]/50 bg-gradient-to-r from-[#060B18]/90 via-[#4D6A6D]/15 to-[#060B18]/90 backdrop-blur-md shadow-lg flex flex-col md:flex-row items-center justify-between gap-5">
        
        {/* Left: Aggregate Circular Confidence Meter */}
        <div className="flex items-center gap-4 w-full md:w-auto">
          <ConfidenceMeter
            confidence={avgConfidence}
            size="lg"
            showLabel={false}
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#D4AF37]">
                AI Model Optical Certainty
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#4D6A6D]/40 text-[#EAE0CC] border border-[#A0A083]/40 font-mono">
                VAR Engine v2.4
              </span>
            </div>
            <div className="text-lg font-black text-[#EAE0CC] flex items-center gap-2">
              <span>{Math.round(avgConfidence * 100)}% Match Certainty Index</span>
            </div>
            <p className="text-[11px] text-[#A0A083] max-w-sm">
              Computer-vision multi-frame kinematic consensus for rule verification and foul detection.
            </p>
          </div>
        </div>

        {/* Center: Certainty Distribution Pills styled with Palette */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-start md:justify-center">
          <div className="px-3 py-2 rounded-xl bg-[#4D6A6D]/25 border border-[#A0A083]/30 text-left">
            <div className="text-[10px] font-mono uppercase text-[#A0A083]">High Certainty</div>
            <div className="text-sm font-extrabold text-[#EAE0CC] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#D4AF37]" />
              <span>{highConfCount} events</span>
            </div>
          </div>

          <div className="px-3 py-2 rounded-xl bg-[#798478]/20 border border-[#798478]/40 text-left">
            <div className="text-[10px] font-mono uppercase text-[#A0A083]">Moderate</div>
            <div className="text-sm font-extrabold text-[#EAE0CC] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#A0A083]" />
              <span>{modConfCount} events</span>
            </div>
          </div>

          <div className="px-3 py-2 rounded-xl bg-[#C9ADA1]/15 border border-[#C9ADA1]/30 text-left">
            <div className="text-[10px] font-mono uppercase text-[#C9ADA1]">Under Scrutiny</div>
            <div className="text-sm font-extrabold text-[#EAE0CC] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#C9ADA1]" />
              <span>{lowConfCount} events</span>
            </div>
          </div>
        </div>

        {/* Right: Active Color Palette Calibration Swatches */}
        <div className="hidden xl:flex flex-col items-end gap-1.5 pl-4 border-l border-[#4D6A6D]/30 text-right">
          <span className="text-[10px] font-mono uppercase text-[#A0A083] flex items-center gap-1">
            <Palette className="w-3 h-3 text-[#D4AF37]" />
            Color Calibration
          </span>
          <div className="flex items-center gap-1.5" title="Palette: #EAE0CC, #C9ADA1, #A0A083, #798478, #4D6A6D">
            <span className="w-4 h-4 rounded-full shadow border border-white/20" style={{ backgroundColor: '#EAE0CC' }} title="#EAE0CC Alabaster Pearl" />
            <span className="w-4 h-4 rounded-full shadow border border-white/20" style={{ backgroundColor: '#C9ADA1' }} title="#C9ADA1 Sand Blush" />
            <span className="w-4 h-4 rounded-full shadow border border-white/20" style={{ backgroundColor: '#A0A083' }} title="#A0A083 Muted Sage" />
            <span className="w-4 h-4 rounded-full shadow border border-white/20" style={{ backgroundColor: '#798478' }} title="#798478 Slate Moss" />
            <span className="w-4 h-4 rounded-full shadow border border-white/20" style={{ backgroundColor: '#4D6A6D' }} title="#4D6A6D Deep Gulf Teal" />
          </div>
          <span className="text-[9px] font-mono text-[#A0A083]/70">5-Tone Heritage Gamut</span>
        </div>

      </div>

      {/* Main Grid: Video Player + Event List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Video Playback & Timestamp seek (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="navy-card rounded-2xl p-4 border border-[#4D6A6D]/40 space-y-3 shadow-lg">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[#EAE0CC] flex items-center gap-1.5">
                <Play className="w-3.5 h-3.5 text-[#D4AF37]" />
                Gameplay Footage & VAR Replay
              </span>
              <span className="text-[#A0A083] text-[11px]">Click event to seek timestamp</span>
            </div>

            <div className="rounded-xl overflow-hidden bg-black aspect-video flex items-center justify-center border border-[#4D6A6D]/30 shadow-inner">
              {match.videoUrl ? (
                <video
                  ref={videoRef}
                  src={match.videoUrl}
                  controls
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="text-center p-6 text-xs text-[#A0A083]">
                  <Play className="w-8 h-8 mx-auto text-[#798478] mb-2 opacity-50" />
                  <p>No video footage attached to this match session.</p>
                </div>
              )}
            </div>

            <div className="text-[11px] text-[#A0A083] p-3 rounded-xl bg-[#4D6A6D]/15 border border-[#4D6A6D]/30 space-y-1">
              <span className="font-bold text-[#EAE0CC] flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
                Host Judicial Tip:
              </span>
              <p>Seek video to inspect frame evidence. When optical certainty is in the sand blush tier (&lt;70%), host intervention is advised.</p>
            </div>
          </div>

          {/* Host Notes Field */}
          <div className="navy-card rounded-2xl p-4 border border-[#4D6A6D]/40 space-y-2 shadow-lg">
            <label className="text-xs font-bold uppercase text-[#EAE0CC] block">
              Host / Umpire Notes (Optional)
            </label>
            <textarea
              value={hostNotes}
              onChange={e => setHostNotes(e.target.value)}
              placeholder="e.g. Clean sportsmanship, contentious marble settled by mutual family agreement."
              className="w-full p-3 rounded-xl bg-[#060B18] border border-[#4D6A6D]/40 text-[#EAE0CC] text-xs placeholder-[#798478] focus:outline-none focus:border-[#D4AF37] resize-none h-20"
            />
          </div>
        </div>

        {/* Right: Events List & Review Cards (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Filter Pills styled with Palette */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 p-1 rounded-xl bg-[#060B18] border border-[#4D6A6D]/40 text-xs">
              <button
                onClick={() => setFilter('all')}
                className={`px-3 py-1 rounded-lg font-bold cursor-pointer transition-colors ${filter === 'all' ? 'bg-[#D4AF37] text-[#060B18]' : 'text-[#A0A083] hover:text-[#EAE0CC]'}`}
              >
                All ({events.length})
              </button>
              <button
                onClick={() => setFilter('pending')}
                className={`px-3 py-1 rounded-lg font-bold cursor-pointer transition-colors ${filter === 'pending' ? 'bg-[#A0A083] text-[#060B18]' : 'text-[#A0A083] hover:text-[#EAE0CC]'}`}
              >
                Pending ({pendingCount})
              </button>
              <button
                onClick={() => setFilter('confirmed')}
                className={`px-3 py-1 rounded-lg font-bold cursor-pointer transition-colors ${filter === 'confirmed' ? 'bg-[#798478] text-[#EAE0CC]' : 'text-[#A0A083] hover:text-[#EAE0CC]'}`}
              >
                Confirmed ({confirmedCount})
              </button>
              <button
                onClick={() => setFilter('rejected')}
                className={`px-3 py-1 rounded-lg font-bold cursor-pointer transition-colors ${filter === 'rejected' ? 'bg-[#C9ADA1] text-[#060B18]' : 'text-[#A0A083] hover:text-[#EAE0CC]'}`}
              >
                Rejected ({events.filter(e => e.reviewStatus === 'rejected').length})
              </button>
            </div>

            <button
              onClick={loadEvents}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Refresh</span>
            </button>
          </div>

          {/* Events Stack */}
          {isLoading ? (
            <div className="navy-card rounded-2xl p-8 text-center text-slate-400 text-xs">
              Loading proposed events...
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="navy-card rounded-2xl p-8 text-center text-slate-400 text-xs space-y-3">
              <CheckCircle2 className="w-8 h-8 text-slate-600 mx-auto" />
              <p>No events found for current filter.</p>
              <button
                onClick={() => setShowAddModal(true)}
                className="gold-button px-4 py-2 rounded-lg text-xs"
              >
                + Add Manual Host Event
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredEvents.map(event => {
                const isPending = event.reviewStatus === 'pending';
                const isConfirmed = event.reviewStatus === 'confirmed';
                const isRejected = event.reviewStatus === 'rejected';

                const minutes = Math.floor(event.timestampSeconds / 60);
                const seconds = Math.floor(event.timestampSeconds % 60);
                const timeStr = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

                return (
                  <div
                    key={event.id}
                    className={`navy-card rounded-2xl p-5 border transition-all ${
                      isConfirmed
                        ? 'border-[#798478]/80 bg-[#4D6A6D]/15 shadow-md shadow-[#4D6A6D]/20'
                        : isRejected
                        ? 'border-[#C9ADA1]/40 bg-[#C9ADA1]/5 opacity-80'
                        : 'border-[#4D6A6D]/40 hover:border-[#D4AF37]/50 bg-[#0A1326]'
                    }`}
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      
                      {/* Left: Event Details & Ruling */}
                      <div className="space-y-2 flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border ${
                            isConfirmed
                              ? 'bg-[#798478]/30 text-[#EAE0CC] border-[#798478]'
                              : isRejected
                              ? 'bg-[#C9ADA1]/20 text-[#C9ADA1] border-[#C9ADA1]/40'
                              : 'bg-[#4D6A6D]/30 text-[#EAE0CC] border-[#4D6A6D]'
                          }`}>
                            {event.reviewStatus}
                          </span>

                          <button
                            onClick={() => handleJumpToVideo(event.timestampSeconds)}
                            className="inline-flex items-center gap-1 text-[11px] font-mono text-[#EAE0CC] hover:text-[#D4AF37] px-2.5 py-0.5 rounded-lg bg-[#060B18] border border-[#4D6A6D]/40 hover:border-[#D4AF37]/40 cursor-pointer transition-colors shadow-sm"
                            title="Jump video to timestamp"
                          >
                            <Clock className="w-3 h-3 text-[#D4AF37]" />
                            <span>{timeStr}</span>
                          </button>

                          <span className="text-[10px] font-mono text-[#A0A083] uppercase tracking-wider">
                            Source: {event.source.replace('_', ' ')}
                          </span>
                        </div>

                        <div className="flex items-center gap-2.5">
                          <h4 className="text-base font-extrabold text-[#EAE0CC] tracking-tight">
                            {event.eventLabel}
                          </h4>
                          <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-lg bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#EAE0CC]">
                            +{event.pointsAwarded} pt
                          </span>
                        </div>

                        <div className="text-xs text-[#A0A083] flex items-center gap-2 flex-wrap">
                          <span>Team: <strong className="text-[#EAE0CC] font-semibold">{event.teamName}</strong></span>
                          {event.playerName && (
                            <>
                              <span className="text-[#798478]">•</span>
                              <span>Player: <strong className="text-[#EAE0CC] font-semibold">{event.playerName}</strong></span>
                            </>
                          )}
                        </div>

                        {/* AI Judge Formal Ruling Box */}
                        {(event.judgeRuling || event.ruleCited) && (
                          <div className="mt-2.5 p-3 rounded-xl bg-[#4D6A6D]/15 border border-[#4D6A6D]/40 space-y-1.5 shadow-sm">
                            <div className="flex flex-wrap items-center gap-1.5 text-[#EAE0CC] font-bold text-xs">
                              <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
                              <span>AI Judge Verdict ({event.aiJudgePersona || judgeInfo.name}):</span>
                              {event.ruleCited && (
                                <span className="text-[10px] font-mono text-[#A0A083] font-normal">
                                  • {event.ruleCited}
                                </span>
                              )}
                            </div>
                            {event.judgeRuling && (
                              <p className="text-[#EAE0CC] text-xs italic leading-relaxed pl-5 border-l-2 border-[#D4AF37]/60">
                                "{event.judgeRuling}"
                              </p>
                            )}
                          </div>
                        )}

                        {event.notes && !event.judgeRuling && (
                          <p className="text-xs text-[#A0A083] italic pt-1">
                            {event.notes}
                          </p>
                        )}
                      </div>

                      {/* Right: Confidence Meter Gauge + Action Controls */}
                      <div className="flex sm:flex-col lg:flex-row items-center gap-4 self-end sm:self-auto shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 sm:border-l border-[#4D6A6D]/20 sm:pl-4">
                        
                        {/* Circular Confidence Meter */}
                        <div className="bg-[#060B18]/60 p-2.5 rounded-xl border border-[#4D6A6D]/30 shadow-inner">
                          <ConfidenceMeter
                            confidence={event.confidence ?? 0.85}
                            size="md"
                            showLabel={true}
                            labelPlacement="right"
                          />
                        </div>

                        {/* Confirmation Actions */}
                        <div className="flex sm:flex-col gap-2">
                          <button
                            onClick={() => handleReview(event.id, 'confirmed')}
                            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all shadow-sm ${
                              isConfirmed
                                ? 'bg-[#798478] text-[#EAE0CC] shadow-md border border-[#EAE0CC]/30'
                                : 'bg-[#4D6A6D]/40 hover:bg-[#4D6A6D]/70 text-[#EAE0CC] border border-[#798478]/50'
                            }`}
                            title="Confirm AI event ruling"
                          >
                            <Check className="w-3.5 h-3.5 text-[#EAE0CC]" />
                            <span>{isConfirmed ? 'Confirmed' : 'Confirm'}</span>
                          </button>

                          <button
                            onClick={() => handleReview(event.id, 'rejected')}
                            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all shadow-sm ${
                              isRejected
                                ? 'bg-[#C9ADA1] text-[#060B18] font-black shadow-md'
                                : 'bg-[#C9ADA1]/15 hover:bg-[#C9ADA1]/30 text-[#C9ADA1] border border-[#C9ADA1]/40'
                            }`}
                            title="Reject event as invalid"
                          >
                            <X className="w-3.5 h-3.5" />
                            <span>{isRejected ? 'Rejected' : 'Reject'}</span>
                          </button>
                        </div>

                      </div>

                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>

      </div>

      {/* Manual Host Event Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="navy-card rounded-2xl p-6 border border-[#4D6A6D]/60 max-w-md w-full space-y-4 shadow-2xl bg-[#0A1326]">
            <div className="flex items-center justify-between border-b border-[#4D6A6D]/40 pb-3">
              <h3 className="text-base font-bold text-[#EAE0CC] flex items-center gap-2">
                <Plus className="w-4 h-4 text-[#D4AF37]" />
                Add Host Manual Event
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-[#A0A083] hover:text-[#EAE0CC] p-1 cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddManualEvent} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-[#A0A083] uppercase block mb-1">
                  Event Type
                </label>
                <select
                  value={manualEventType}
                  onChange={e => {
                    setManualEventType(e.target.value);
                    const rule = game?.scoringRules.find(r => r.eventType === e.target.value);
                    if (rule) setManualPoints(rule.points);
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-[#060B18] border border-[#4D6A6D]/40 text-[#EAE0CC] text-xs focus:outline-none focus:border-[#D4AF37]"
                  required
                >
                  <option value="">Select event rule...</option>
                  {game?.scoringRules.map(rule => (
                    <option key={rule.eventType} value={rule.eventType}>
                      {rule.label} (+{rule.points} pt)
                    </option>
                  ))}
                  <option value="custom_host_point">Custom Host Award (+1 pt)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#A0A083] uppercase block mb-1">
                  Award To Team
                </label>
                <select
                  value={manualTeamId}
                  onChange={e => setManualTeamId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#060B18] border border-[#4D6A6D]/40 text-[#EAE0CC] text-xs focus:outline-none focus:border-[#D4AF37]"
                >
                  <option value={match.teamA.id}>{match.teamA.name}</option>
                  <option value={match.teamB.id}>{match.teamB.name}</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[#A0A083] uppercase block mb-1">
                    Timestamp (seconds)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={manualTimestamp}
                    onChange={e => setManualTimestamp(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-[#060B18] border border-[#4D6A6D]/40 text-[#EAE0CC] text-xs focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#A0A083] uppercase block mb-1">
                    Points Awarded
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={manualPoints}
                    onChange={e => setManualPoints(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-[#060B18] border border-[#4D6A6D]/40 text-[#EAE0CC] text-xs focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#A0A083] uppercase block mb-1">
                  Host Note / Reason
                </label>
                <input
                  type="text"
                  value={manualNotes}
                  onChange={e => setManualNotes(e.target.value)}
                  placeholder="e.g. Clean goal scored outside camera view"
                  className="w-full px-3 py-2 rounded-xl bg-[#060B18] border border-[#4D6A6D]/40 text-[#EAE0CC] text-xs focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg text-xs text-[#A0A083] hover:text-[#EAE0CC] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="gold-button px-5 py-2 rounded-xl text-xs font-bold cursor-pointer"
                >
                  Add Confirmed Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
