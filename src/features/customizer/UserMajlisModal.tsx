import React, { useState } from 'react';
import { 
  X, 
  Check, 
  Sparkles, 
  Volume2, 
  ShieldCheck, 
  Users, 
  Palette, 
  Crown,
  Plus,
  Trash2
} from 'lucide-react';
import { UserMajlisProfile } from '../../types';
import { userProfileStorage, COOLORS_PALETTE, JUDGE_PERSONAS } from '../../services/storage/userProfile';
import { soundEffects } from '../../services/audio/whistle';

interface UserMajlisModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedProfile: UserMajlisProfile) => void;
}

const EMBLEMS = [
  { emoji: '🦅', name: 'Falcon (Saqr)', desc: 'Emirati pride & sharp vision' },
  { emoji: '🦌', name: 'Oryx (Al Maha)', desc: 'Grace & endurance' },
  { emoji: '⛵', name: 'Dhow (Al Mahmil)', desc: 'Maritime legacy & teamwork' },
  { emoji: '🌴', name: 'Date Palm (Al Nakhlah)', desc: 'Heritage & hospitality' },
  { emoji: '🏆', name: 'Golden Cup (Al Kaas)', desc: 'Championship spirit' },
  { emoji: '⛺', name: 'Majlis Tent (Khaimah)', desc: 'Family union & warmth' },
  { emoji: '🐎', name: 'Arabian Steed (Al Khail)', desc: 'Speed & agility' },
  { emoji: '🎯', name: 'Sharpshooter (Al Hadaf)', desc: 'Focus & precision' }
];

export const UserMajlisModal: React.FC<UserMajlisModalProps> = ({
  isOpen,
  onClose,
  onSave
}) => {
  const [profile, setProfile] = useState<UserMajlisProfile>(() => userProfileStorage.getProfile());
  const [newPlayerInput, setNewPlayerInput] = useState('');
  const [activeTab, setActiveTab] = useState<'clan' | 'judge' | 'roster'>('clan');
  const [justSaved, setJustSaved] = useState(false);

  if (!isOpen) return null;

  const handleTestWhistle = (style: 'short' | 'double' | 'foul') => {
    soundEffects.playWhistle(style);
  };

  const handleAddPlayer = () => {
    const trimmed = newPlayerInput.trim();
    if (trimmed && !profile.defaultRoster.includes(trimmed)) {
      setProfile(prev => ({
        ...prev,
        defaultRoster: [...prev.defaultRoster, trimmed]
      }));
      setNewPlayerInput('');
    }
  };

  const handleRemovePlayer = (name: string) => {
    setProfile(prev => ({
      ...prev,
      defaultRoster: prev.defaultRoster.filter(p => p !== name)
    }));
  };

  const handleSave = () => {
    userProfileStorage.saveProfile(profile);
    soundEffects.playScoreChime();
    setJustSaved(true);
    setTimeout(() => {
      onSave(profile);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-[#0a1326] border border-[#4D6A6D]/60 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header with Clan Badge Preview */}
        <div 
          className="p-6 border-b border-[#4D6A6D]/30 relative overflow-hidden"
          style={{ background: `linear-gradient(135deg, ${profile.primaryColor}33 0%, #060b18 100%)` }}
        >
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-[#A0A083] hover:text-[#EAE0CC] rounded-xl hover:bg-[#4D6A6D]/20 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-4">
            <div 
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-xl border-2 border-[#D4AF37]/50 shrink-0"
              style={{ backgroundColor: profile.primaryColor }}
            >
              {profile.emblemEmoji}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#D4AF37]">Personalized Majlis</span>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-[#4D6A6D]/30 text-[#EAE0CC] font-mono border border-[#798478]/40">
                  {profile.emblemName}
                </span>
              </div>
              <h2 className="text-2xl font-black text-[#EAE0CC] tracking-tight">{profile.familyClanName}</h2>
              <p className="text-xs text-[#A0A083] mt-0.5 flex items-center gap-2">
                <span>AI Judge: <strong className="text-[#EAE0CC]">{profile.judgeName}</strong></span>
                <span>•</span>
                <span>{profile.defaultRoster.length} Clan Players</span>
              </p>
            </div>
          </div>

          {/* Sub Navigation */}
          <div className="flex items-center gap-2 mt-5 border-t border-[#4D6A6D]/30 pt-3">
            <button
              onClick={() => setActiveTab('clan')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'clan'
                  ? 'bg-[#4D6A6D] text-[#EAE0CC] shadow-md'
                  : 'text-[#A0A083] hover:text-[#EAE0CC]'
              }`}
            >
              <Crown className="w-3.5 h-3.5 text-[#D4AF37]" />
              Clan Identity & Colors
            </button>
            <button
              onClick={() => setActiveTab('judge')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'judge'
                  ? 'bg-[#4D6A6D] text-[#EAE0CC] shadow-md'
                  : 'text-[#A0A083] hover:text-[#EAE0CC]'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
              AI Judge & Referee
            </button>
            <button
              onClick={() => setActiveTab('roster')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'roster'
                  ? 'bg-[#4D6A6D] text-[#EAE0CC] shadow-md'
                  : 'text-[#A0A083] hover:text-[#EAE0CC]'
              }`}
            >
              <Users className="w-3.5 h-3.5 text-[#D4AF37]" />
              Family Roster ({profile.defaultRoster.length})
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          
          {/* TAB 1: CLAN & COLORS */}
          {activeTab === 'clan' && (
            <div className="space-y-6">
              <div>
                <label className="font-bold text-[#EAE0CC] uppercase tracking-wider block mb-2">
                  Family / Clan Name
                </label>
                <input
                  type="text"
                  value={profile.familyClanName}
                  onChange={e => setProfile({ ...profile, familyClanName: e.target.value })}
                  placeholder="e.g. Al Nuaimi Majlis, Falcon Team, Desert Lions"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#060b18] border border-[#4D6A6D]/40 text-[#EAE0CC] font-bold text-sm focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              {/* Emblem Selection */}
              <div>
                <label className="font-bold text-[#EAE0CC] uppercase tracking-wider block mb-2">
                  Clan Mascot Emblem
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {EMBLEMS.map(e => (
                    <button
                      key={e.emoji}
                      type="button"
                      onClick={() => setProfile({ ...profile, emblemEmoji: e.emoji, emblemName: e.name })}
                      className={`p-3 rounded-xl border flex flex-col items-center text-center gap-1.5 transition-all cursor-pointer ${
                        profile.emblemEmoji === e.emoji
                          ? 'bg-[#4D6A6D]/30 border-[#D4AF37] text-[#EAE0CC] shadow-lg'
                          : 'bg-[#060b18] border-[#4D6A6D]/20 text-[#A0A083] hover:border-[#4D6A6D]/50'
                      }`}
                    >
                      <span className="text-2xl">{e.emoji}</span>
                      <span className="font-bold text-xs">{e.name}</span>
                      <span className="text-[10px] text-[#A0A083] leading-tight">{e.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Palette Selection (Uploaded palette) */}
              <div>
                <label className="font-bold text-[#EAE0CC] uppercase tracking-wider flex items-center gap-2 mb-2">
                  <Palette className="w-3.5 h-3.5 text-[#D4AF37]" />
                  Clan Banner Color (Emirati Heritage Tones)
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
                  {COOLORS_PALETTE.map(c => (
                    <button
                      key={c.hex}
                      type="button"
                      onClick={() => setProfile({ ...profile, primaryColor: c.hex })}
                      className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all cursor-pointer ${
                        profile.primaryColor === c.hex
                          ? 'border-white scale-105 shadow-xl'
                          : 'border-white/10 hover:border-white/30'
                      }`}
                      style={{ backgroundColor: c.hex }}
                    >
                      <span 
                        className="text-[11px] font-black tracking-wider" 
                        style={{ color: c.text }}
                      >
                        {c.name}
                      </span>
                      <span className="text-[9px] font-mono opacity-80" style={{ color: c.text }}>
                        {c.hex}
                      </span>
                      {profile.primaryColor === c.hex && (
                        <Check className="w-4 h-4" style={{ color: c.text }} />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: AI JUDGE PERSONA */}
          {activeTab === 'judge' && (
            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-[#060b18] border border-[#4D6A6D]/40 flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-[#EAE0CC] text-sm">Universal AI Referee Engine</h4>
                  <p className="text-[#A0A083] text-xs mt-0.5 leading-relaxed">
                    FAREEG AI's automated judicial engine analyzes gameplay angles, checks boundaries, and evaluates scoring events. Select how strict you want the AI Judge to be during family gatherings.
                  </p>
                </div>
              </div>

              {/* Personas */}
              <div className="space-y-3">
                {(Object.entries(JUDGE_PERSONAS) as [keyof typeof JUDGE_PERSONAS, typeof JUDGE_PERSONAS[keyof typeof JUDGE_PERSONAS]][]).map(([key, item]) => {
                  const isSelected = profile.judgePersona === key;
                  return (
                    <div
                      key={key}
                      onClick={() => setProfile({ ...profile, judgePersona: key, judgeName: item.name })}
                      className={`p-4 rounded-xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-[#4D6A6D]/30 border-[#D4AF37] shadow-lg'
                          : 'bg-[#060b18] border-[#4D6A6D]/20 hover:border-[#4D6A6D]/50'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-[#EAE0CC]">{item.name}</span>
                            <span className="text-xs text-[#D4AF37] font-arabic font-medium">{item.arabicTitle}</span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#4D6A6D]/30 text-[#EAE0CC] font-mono border border-[#798478]/30">
                              {item.badge}
                            </span>
                          </div>
                          <p className="text-xs text-[#EAE0CC] font-medium">{item.tagline}</p>
                          <p className="text-[11px] text-[#A0A083] leading-relaxed">{item.description}</p>
                        </div>
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-1 ${
                          isSelected ? 'border-[#D4AF37] bg-[#D4AF37] text-black' : 'border-white/20'
                        }`}>
                          {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Whistle Test Sound Buttons */}
              <div className="p-4 rounded-2xl bg-[#060b18] border border-[#4D6A6D]/40 space-y-3">
                <h4 className="font-bold text-[#EAE0CC] text-xs uppercase tracking-wider flex items-center gap-2">
                  <Volume2 className="w-4 h-4 text-[#D4AF37]" />
                  Referee Sound FX Test
                </h4>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => handleTestWhistle('short')}
                    className="px-3 py-1.5 rounded-lg bg-[#4D6A6D]/30 hover:bg-[#4D6A6D]/50 text-[#EAE0CC] text-xs font-semibold cursor-pointer border border-[#798478]/40"
                  >
                    Short Whistle
                  </button>
                  <button
                    type="button"
                    onClick={() => handleTestWhistle('double')}
                    className="px-3 py-1.5 rounded-lg bg-[#4D6A6D]/30 hover:bg-[#4D6A6D]/50 text-[#EAE0CC] text-xs font-semibold cursor-pointer border border-[#798478]/40"
                  >
                    Double Whistle
                  </button>
                  <button
                    type="button"
                    onClick={() => handleTestWhistle('foul')}
                    className="px-3 py-1.5 rounded-lg bg-[#C9ADA1]/20 hover:bg-[#C9ADA1]/35 text-[#C9ADA1] text-xs font-semibold cursor-pointer border border-[#C9ADA1]/40"
                  >
                    Foul Whistle
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: FAMILY ROSTER */}
          {activeTab === 'roster' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-[#EAE0CC] text-sm">Default Family Roster</h4>
                  <p className="text-[#A0A083] text-xs">
                    Quickly pre-fill player names during tournament setup.
                  </p>
                </div>
              </div>

              {/* Add New Player Bar */}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newPlayerInput}
                  onChange={e => setNewPlayerInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddPlayer())}
                  placeholder="Enter family member or player name..."
                  className="flex-1 px-3 py-2 rounded-xl bg-[#060b18] border border-[#4D6A6D]/40 text-[#EAE0CC] text-xs focus:outline-none focus:border-[#D4AF37]"
                />
                <button
                  type="button"
                  onClick={handleAddPlayer}
                  className="gold-button px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
              </div>

              {/* Player Roster Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-60 overflow-y-auto">
                {profile.defaultRoster.map((name, idx) => (
                  <div 
                    key={idx}
                    className="p-3 rounded-xl bg-[#060b18] border border-[#4D6A6D]/30 flex items-center justify-between"
                  >
                    <span className="font-semibold text-[#EAE0CC]">{name}</span>
                    <button
                      type="button"
                      onClick={() => handleRemovePlayer(name)}
                      className="text-[#A0A083] hover:text-[#C9ADA1] p-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-[#060b18] border-t border-[#4D6A6D]/30 flex items-center justify-between">
          <span className="text-xs text-[#A0A083] font-mono">
            {justSaved ? 'Saved successfully!' : 'FAREEG AI Profile'}
          </span>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs text-[#A0A083] hover:text-[#EAE0CC] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="gold-button px-6 py-2 rounded-xl text-xs font-bold cursor-pointer shadow-lg"
            >
              Save Majlis Profile
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
