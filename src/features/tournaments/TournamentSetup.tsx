import React, { useState } from 'react';
import { 
  Trophy, 
  Plus, 
  Trash2, 
  Users, 
  AlertCircle, 
  CheckCircle2, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { GameId, TournamentFormat, Tournament } from '../../types';
import { ALL_GAMES } from '../../config/games';
import { api } from '../../services/api/client';

interface TournamentSetupProps {
  onTournamentCreated: (tournament: Tournament) => void;
  onCancel: () => void;
}

interface TeamDraft {
  name: string;
  arabicName?: string;
  color: string;
  players: { name: string; number?: number }[];
}

const DEFAULT_COLORS = ['#D4AF37', '#4D6A6D', '#C9ADA1', '#798478', '#A0A083', '#EAE0CC'];

export const TournamentSetup: React.FC<TournamentSetupProps> = ({ onTournamentCreated, onCancel }) => {
  const [tournamentName, setTournamentName] = useState('Emirati Family Arena Cup 2026');
  const [format, setFormat] = useState<TournamentFormat>('family_cup');
  const [selectedGames, setSelectedGames] = useState<GameId[]>([
    'football', 
    'al_teela', 
    'al_dama', 
    'al_laqaf', 
    'qif'
  ]);

  const [teams, setTeams] = useState<TeamDraft[]>([
    {
      name: 'Al Saqr (Falcons)',
      arabicName: 'صقور الفريج',
      color: '#D4AF37',
      players: [
        { name: 'Rashid (Captain)', number: 10 },
        { name: 'Zayed', number: 7 },
        { name: 'Mariam', number: 1 }
      ]
    },
    {
      name: 'Al Fursan (Knights)',
      arabicName: 'فرسان الفريج',
      color: '#4D6A6D',
      players: [
        { name: 'Hamad (Captain)', number: 9 },
        { name: 'Sultan', number: 8 },
        { name: 'Fatima', number: 4 }
      ]
    }
  ]);

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddTeam = () => {
    const nextColor = DEFAULT_COLORS[teams.length % DEFAULT_COLORS.length];
    setTeams([
      ...teams,
      {
        name: `Team ${teams.length + 1}`,
        color: nextColor,
        players: [{ name: 'Player 1' }]
      }
    ]);
  };

  const handleRemoveTeam = (index: number) => {
    if (teams.length <= 2) {
      setError('A tournament requires at least two teams.');
      return;
    }
    setTeams(teams.filter((_, i) => i !== index));
  };

  const handleTeamNameChange = (index: number, name: string) => {
    const updated = [...teams];
    updated[index].name = name;
    setTeams(updated);
  };

  const handleTeamArabicNameChange = (index: number, arabicName: string) => {
    const updated = [...teams];
    updated[index].arabicName = arabicName;
    setTeams(updated);
  };

  const handleTeamColorChange = (index: number, color: string) => {
    const updated = [...teams];
    updated[index].color = color;
    setTeams(updated);
  };

  const handleAddPlayer = (teamIndex: number) => {
    const updated = [...teams];
    updated[teamIndex].players.push({
      name: `Player ${updated[teamIndex].players.length + 1}`
    });
    setTeams(updated);
  };

  const handleRemovePlayer = (teamIndex: number, playerIndex: number) => {
    const updated = [...teams];
    updated[teamIndex].players = updated[teamIndex].players.filter((_, idx) => idx !== playerIndex);
    setTeams(updated);
  };

  const handlePlayerNameChange = (teamIndex: number, playerIndex: number, name: string) => {
    const updated = [...teams];
    updated[teamIndex].players[playerIndex].name = name;
    setTeams(updated);
  };

  const handleToggleGame = (gameId: GameId) => {
    if (selectedGames.includes(gameId)) {
      if (selectedGames.length === 1) {
        setError('At least one game must be selected for the tournament.');
        return;
      }
      setSelectedGames(selectedGames.filter(g => g !== gameId));
    } else {
      setSelectedGames([...selectedGames, gameId]);
    }
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!tournamentName.trim()) {
      setError('Please provide a tournament name.');
      return;
    }

    if (teams.length < 2) {
      setError('Please add at least 2 teams to compete.');
      return;
    }

    for (let i = 0; i < teams.length; i++) {
      if (!teams[i].name.trim()) {
        setError(`Team #${i + 1} needs a valid name.`);
        return;
      }
    }

    if (selectedGames.length === 0) {
      setError('Please select at least one traditional game.');
      return;
    }

    setIsSubmitting(true);
    try {
      const created = await api.createTournament({
        name: tournamentName.trim(),
        format,
        games: selectedGames,
        teams: teams.map(t => ({
          name: t.name.trim(),
          arabicName: t.arabicName?.trim() || undefined,
          color: t.color,
          players: t.players.map(p => ({
            name: p.name.trim() || 'Player',
            number: p.number
          }))
        }))
      });

      // Save to localStorage as quick recovery backup
      try {
        localStorage.setItem('fareeg_active_tournament_id', created.id);
      } catch {}

      onTournamentCreated(created);
    } catch (err: any) {
      setError(err.message || 'Failed to create tournament. Please check details.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#4D6A6D]/30 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#D4AF37] uppercase tracking-wider mb-1">
            <Trophy className="w-4 h-4" />
            Tournament Creator
          </div>
          <h1 className="text-3xl font-black text-[#EAE0CC] tracking-tight">
            Create Family Tournament
          </h1>
          <p className="text-sm text-[#A0A083] mt-1">
            Set up teams, family roster, and games rotation. All match results will calculate official tournament standings.
          </p>
        </div>
        <button
          onClick={onCancel}
          className="text-sm text-[#A0A083] hover:text-[#EAE0CC] px-3.5 py-1.5 rounded-xl hover:bg-[#4D6A6D]/20 cursor-pointer transition-colors"
        >
          Cancel
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-[#C9ADA1]/15 border border-[#C9ADA1]/40 text-[#EAE0CC] text-sm flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-[#C9ADA1] shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Section 1: Tournament Name & Format */}
        <div className="navy-card rounded-2xl p-6 border border-[#4D6A6D]/40 space-y-6 bg-[#0a1226]">
          <h2 className="text-lg font-bold text-[#EAE0CC] flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#EAE0CC] text-xs flex items-center justify-center font-bold">1</span>
            Tournament Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#A0A083]">
                Tournament Name
              </label>
              <input
                type="text"
                value={tournamentName}
                onChange={e => setTournamentName(e.target.value)}
                placeholder="e.g. Al Wasl Heritage Family Cup"
                className="w-full px-4 py-3 rounded-xl bg-[#060b18] border border-[#4D6A6D]/40 text-[#EAE0CC] placeholder-[#798478] focus:outline-none focus:border-[#D4AF37] text-sm"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#A0A083]">
                Match Format
              </label>
              <select
                value={format}
                onChange={e => setFormat(e.target.value as TournamentFormat)}
                className="w-full px-4 py-3 rounded-xl bg-[#060b18] border border-[#4D6A6D]/40 text-[#EAE0CC] focus:outline-none focus:border-[#D4AF37] text-sm cursor-pointer"
              >
                <option value="family_cup">Multi-Game Family Cup (Rotate All Games)</option>
                <option value="round_robin">Round Robin (All Teams Play Each Other)</option>
                <option value="knockout">Single Elimination Knockout</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 2: Traditional Games Selection */}
        <div className="navy-card rounded-2xl p-6 border border-[#4D6A6D]/40 space-y-4 bg-[#0a1226]">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#EAE0CC] flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#EAE0CC] text-xs flex items-center justify-center font-bold">2</span>
              Include Traditional Games
            </h2>
            <span className="text-xs text-[#D4AF37] font-semibold">
              {selectedGames.length} selected
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
            {ALL_GAMES.map(game => {
              const isSelected = selectedGames.includes(game.id);
              return (
                <div
                  key={game.id}
                  onClick={() => handleToggleGame(game.id)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-[#4D6A6D]/30 border-[#D4AF37] text-[#EAE0CC]'
                      : 'bg-[#060b18] border-[#4D6A6D]/20 text-[#A0A083] hover:border-[#4D6A6D]/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#D4AF37]">
                      {game.category}
                    </span>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => {}}
                      className="accent-[#D4AF37] cursor-pointer"
                    />
                  </div>
                  <div className="font-bold text-sm text-[#EAE0CC]">{game.name}</div>
                  <div className="text-xs text-[#D4AF37] font-arabic">{game.arabicName}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 3: Teams & Family Players */}
        <div className="navy-card rounded-2xl p-6 border border-[#4D6A6D]/40 space-y-6 bg-[#0a1226]">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#EAE0CC] flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#EAE0CC] text-xs flex items-center justify-center font-bold">3</span>
              Participating Teams & Roster
            </h2>
            <button
              type="button"
              onClick={handleAddTeam}
              className="px-3.5 py-2 rounded-xl bg-[#4D6A6D]/30 hover:bg-[#4D6A6D]/50 border border-[#798478]/40 text-xs font-bold text-[#EAE0CC] flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <Plus className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Add Team</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {teams.map((team, tIdx) => (
              <div 
                key={tIdx} 
                className="p-5 rounded-2xl bg-[#060b18] border border-[#4D6A6D]/30 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={team.color}
                      onChange={e => handleTeamColorChange(tIdx, e.target.value)}
                      className="w-7 h-7 rounded border-none cursor-pointer bg-transparent"
                      title="Choose team color"
                    />
                    <span className="text-xs font-bold uppercase text-[#A0A083]">
                      Team #{tIdx + 1}
                    </span>
                  </div>
                  {teams.length > 2 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveTeam(tIdx)}
                      className="text-[#A0A083] hover:text-[#C9ADA1] p-1 rounded cursor-pointer transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-[11px] font-semibold text-[#A0A083] uppercase">Team Name</label>
                    <input
                      type="text"
                      value={team.name}
                      onChange={e => handleTeamNameChange(tIdx, e.target.value)}
                      placeholder="e.g. Al Saqr"
                      className="w-full mt-1 px-3 py-2 rounded-xl bg-[#0a1226] border border-[#4D6A6D]/40 text-[#EAE0CC] text-sm focus:outline-none focus:border-[#D4AF37]"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-[#A0A083] uppercase">Arabic Name (Optional)</label>
                    <input
                      type="text"
                      value={team.arabicName || ''}
                      onChange={e => handleTeamArabicNameChange(tIdx, e.target.value)}
                      placeholder="e.g. صقور الفريج"
                      className="w-full mt-1 px-3 py-2 rounded-xl bg-[#0a1226] border border-[#4D6A6D]/40 text-[#EAE0CC] text-sm focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                </div>

                {/* Player Roster */}
                <div className="pt-2 border-t border-[#4D6A6D]/20 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#EAE0CC] flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-[#D4AF37]" />
                      Family Players ({team.players.length})
                    </span>
                    <button
                      type="button"
                      onClick={() => handleAddPlayer(tIdx)}
                      className="text-[11px] text-[#D4AF37] hover:underline font-semibold"
                    >
                      + Add Player
                    </button>
                  </div>

                  <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                    {team.players.map((player, pIdx) => (
                      <div key={pIdx} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={player.name}
                          onChange={e => handlePlayerNameChange(tIdx, pIdx, e.target.value)}
                          placeholder="Player name"
                          className="flex-1 px-2.5 py-1.5 rounded-lg bg-[#0a1226] border border-[#4D6A6D]/30 text-xs text-[#EAE0CC] focus:outline-none focus:border-[#D4AF37]"
                        />
                        {team.players.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemovePlayer(tIdx, pIdx)}
                            className="text-[#A0A083] hover:text-[#C9ADA1] p-1 cursor-pointer"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-4 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 rounded-xl border border-[#4D6A6D]/40 text-[#A0A083] hover:text-[#EAE0CC] font-semibold text-sm cursor-pointer transition-colors"
          >
            Cancel
          </button>
          
          <button
            type="submit"
            disabled={isSubmitting}
            className="gold-button px-8 py-3 rounded-xl font-bold text-sm flex items-center gap-2 cursor-pointer shadow-xl disabled:opacity-50"
          >
            {isSubmitting ? (
              <span>Saving Tournament...</span>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Start Tournament</span>
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
};
