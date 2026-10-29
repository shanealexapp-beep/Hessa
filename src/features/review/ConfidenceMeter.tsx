import React, { useId } from 'react';
import { ShieldCheck, AlertCircle, Sparkles, CheckCircle2 } from 'lucide-react';

export interface ConfidenceMeterProps {
  /** Confidence score between 0 and 1, or between 0 and 100 */
  confidence: number;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg' | 'hero';
  /** Whether to show descriptive status label */
  showLabel?: boolean;
  /** Label position */
  labelPlacement?: 'bottom' | 'right' | 'inline';
  /** Optional custom subtitle or context */
  subtitle?: string;
  /** Animate the arc */
  animated?: boolean;
  /** Additional container classes */
  className?: string;
}

/**
 * ConfidenceMeter
 * Visual circular gauge that illustrates AI vision certainty
 * using the official Emirati palette:
 * - #EAE0CC (Alabaster Pearl / Cream)
 * - #C9ADA1 (Desert Rose / Sand Blush)
 * - #A0A083 (Muted Sage)
 * - #798478 (Slate Moss / Mineral)
 * - #4D6A6D (Deep Gulf Teal)
 * - #D4AF37 (Emirati Championship Gold)
 */
export const ConfidenceMeter: React.FC<ConfidenceMeterProps> = ({
  confidence,
  size = 'md',
  showLabel = true,
  labelPlacement = 'right',
  subtitle,
  animated = true,
  className = ''
}) => {
  const gradientId = useId();

  // Normalize confidence to 0-100 range
  const normalized = confidence > 1 ? Math.min(100, Math.max(0, confidence)) : Math.min(100, Math.max(0, confidence * 100));
  const rounded = Math.round(normalized);

  // Determine certainty tier and color accents based on palette
  const getTier = (score: number) => {
    if (score >= 90) {
      return {
        level: 'high',
        label: 'High Certainty',
        arabicLabel: 'دقة عالية',
        color: '#D4AF37', // Gold
        secondaryColor: '#EAE0CC', // Pearl Cream
        bgBadge: 'bg-[#4D6A6D]/40 text-[#EAE0CC] border-[#D4AF37]/50',
        badgeTextColor: 'text-[#EAE0CC]',
        icon: ShieldCheck,
        description: 'Multi-frame optical confirmation verified by CV model'
      };
    } else if (score >= 80) {
      return {
        level: 'strong',
        label: 'Strong Match',
        arabicLabel: 'تأكيد قوي',
        color: '#A0A083', // Muted Sage
        secondaryColor: '#EAE0CC', // Pearl Cream
        bgBadge: 'bg-[#798478]/30 text-[#EAE0CC] border-[#A0A083]/40',
        badgeTextColor: 'text-[#EAE0CC]',
        icon: CheckCircle2,
        description: 'Solid kinematic trajectory and boundary adherence'
      };
    } else if (score >= 70) {
      return {
        level: 'moderate',
        label: 'Moderate Certainty',
        arabicLabel: 'دقة متوسطة',
        color: '#798478', // Slate Moss
        secondaryColor: '#A0A083', // Muted Sage
        bgBadge: 'bg-[#4D6A6D]/20 text-[#A0A083] border-[#798478]/40',
        badgeTextColor: 'text-[#A0A083]',
        icon: Sparkles,
        description: 'Host review suggested for contentious angle'
      };
    } else {
      return {
        level: 'low',
        label: 'Review Required',
        arabicLabel: 'يتطلب مراجعة',
        color: '#C9ADA1', // Sand Blush
        secondaryColor: '#EAE0CC', // Pearl Cream
        bgBadge: 'bg-[#C9ADA1]/20 text-[#EAE0CC] border-[#C9ADA1]/50',
        badgeTextColor: 'text-[#C9ADA1]',
        icon: AlertCircle,
        description: 'Low optical certainty; umpire arbitration advised'
      };
    }
  };

  const tier = getTier(rounded);
  const TierIcon = tier.icon;

  // Dimension presets
  const dimensions = {
    sm: { size: 48, radius: 18, strokeWidth: 4, textSize: 'text-xs', labelText: 'text-[10px]' },
    md: { size: 68, radius: 26, strokeWidth: 5.5, textSize: 'text-sm font-bold', labelText: 'text-xs' },
    lg: { size: 92, radius: 36, strokeWidth: 7, textSize: 'text-xl font-extrabold', labelText: 'text-xs' },
    hero: { size: 120, radius: 48, strokeWidth: 8.5, textSize: 'text-2xl font-black', labelText: 'text-sm' },
  }[size];

  const circumference = 2 * Math.PI * dimensions.radius;
  const strokeDashoffset = circumference - (normalized / 100) * circumference;

  const gaugeSvg = (
    <div className="relative inline-flex items-center justify-center flex-shrink-0">
      <svg
        width={dimensions.size}
        height={dimensions.size}
        viewBox={`0 0 ${dimensions.size} ${dimensions.size}`}
        className="transform -rotate-90"
      >
        <defs>
          <linearGradient id={`grad-${gradientId}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={tier.color} />
            <stop offset="100%" stopColor={tier.secondaryColor} />
          </linearGradient>
          <radialGradient id={`glow-${gradientId}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={tier.color} stopOpacity="0.25" />
            <stop offset="100%" stopColor={tier.color} stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Ambient background glow circle */}
        <circle
          cx={dimensions.size / 2}
          cy={dimensions.size / 2}
          r={dimensions.radius}
          fill={`url(#glow-${gradientId})`}
        />

        {/* Background track circle - deep gulf teal & navy hue */}
        <circle
          cx={dimensions.size / 2}
          cy={dimensions.size / 2}
          r={dimensions.radius}
          stroke="#4D6A6D"
          strokeWidth={dimensions.strokeWidth}
          strokeOpacity="0.25"
          fill="none"
        />

        {/* Outer decorative ring for high aesthetics */}
        <circle
          cx={dimensions.size / 2}
          cy={dimensions.size / 2}
          r={dimensions.radius + dimensions.strokeWidth / 2 + 1}
          stroke="#798478"
          strokeWidth="0.75"
          strokeOpacity="0.3"
          strokeDasharray="2 3"
          fill="none"
        />

        {/* Active Progress Arc */}
        <circle
          cx={dimensions.size / 2}
          cy={dimensions.size / 2}
          r={dimensions.radius}
          stroke={`url(#grad-${gradientId})`}
          strokeWidth={dimensions.strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="none"
          className={animated ? 'transition-all duration-1000 ease-out' : ''}
          style={{
            filter: `drop-shadow(0 0 4px ${tier.color}66)`
          }}
        />
      </svg>

      {/* Center Readout (Percentage) */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
        <span
          className={`font-mono tracking-tight leading-none ${dimensions.textSize}`}
          style={{ color: tier.secondaryColor }}
        >
          {rounded}
          <span className="text-[10px] font-sans opacity-70 ml-0.5">%</span>
        </span>
        {size === 'hero' && (
          <span className="text-[9px] font-mono tracking-widest uppercase mt-0.5" style={{ color: tier.color }}>
            CERTAINTY
          </span>
        )}
      </div>
    </div>
  );

  if (!showLabel) {
    return (
      <div className={`inline-flex items-center ${className}`} title={`${tier.label}: ${rounded}% AI confidence`}>
        {gaugeSvg}
      </div>
    );
  }

  // Right-aligned layout (standard for cards)
  if (labelPlacement === 'right') {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        {gaugeSvg}
        <div className="space-y-0.5 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[11px] font-bold ${tier.bgBadge}`}
            >
              <TierIcon className="w-3 h-3 flex-shrink-0" style={{ color: tier.color }} />
              <span>{tier.label}</span>
            </span>
          </div>
          <p className="text-[11px] text-[#A0A083] truncate">
            {subtitle || tier.description}
          </p>
        </div>
      </div>
    );
  }

  // Bottom-aligned layout (for hero summary cards)
  if (labelPlacement === 'bottom') {
    return (
      <div className={`flex flex-col items-center text-center gap-2 ${className}`}>
        {gaugeSvg}
        <div className="space-y-1">
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border text-xs font-bold ${tier.bgBadge}`}
          >
            <TierIcon className="w-3.5 h-3.5 flex-shrink-0" style={{ color: tier.color }} />
            <span>{tier.label}</span>
          </span>
          {subtitle && (
            <p className="text-[11px] text-[#A0A083] max-w-[160px] leading-tight">
              {subtitle}
            </p>
          )}
        </div>
      </div>
    );
  }

  // Inline layout
  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      {gaugeSvg}
      <span className={`text-xs font-semibold ${tier.badgeTextColor}`}>
        {tier.label} ({rounded}%)
      </span>
    </div>
  );
};
