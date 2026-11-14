import { useId } from 'react';
import { ACCENT_COLORS, SHELL_COLORS, getSwatchHex, isSwatchDark } from '../data/catalog';
import {
  GraphicStamp,
  PatternType,
  ProductCategory,
  ProtectionTier,
  TextFont,
  TextLayout,
} from '../types/store';

interface ProductVisualProps {
  category: ProductCategory;
  shellColorId: string;
  accentColorId: string;
  pattern: PatternType;
  protectionTier?: ProtectionTier;
  stamp?: GraphicStamp;
  engraving?: string;
  textLayout?: TextLayout;
  textFont?: TextFont;
  className?: string;
}

export function ProductVisual({
  category,
  shellColorId,
  accentColorId,
  pattern,
  protectionTier = 'Impact',
  stamp = 'None',
  engraving = '',
  textLayout = 'Bottom',
  textFont = 'Display',
  className = 'w-full h-full',
}: ProductVisualProps) {
  const uid = useId().replace(/:/g, '');
  const shellHex = getSwatchHex(SHELL_COLORS, shellColorId);
  const accentHex = getSwatchHex(ACCENT_COLORS, accentColorId);
  const darkShell = isSwatchDark(SHELL_COLORS, shellColorId);
  const inkColor = darkShell ? 'rgba(255,255,255,0.92)' : 'rgba(20,20,22,0.88)';
  const subtleStroke = darkShell ? 'rgba(255,255,255,0.14)' : 'rgba(20,20,22,0.12)';
  const patternId = `pat-${uid}`;
  const shadowId = `shd-${uid}`;
  const cleanEngraving = engraving.trim().toUpperCase().slice(0, 12);

  const isBounce = protectionTier === 'Bounce' || protectionTier === 'Ultra Bounce';
  const isUltra = protectionTier === 'Ultra Bounce';
  const bumperPad = isUltra ? 8 : isBounce ? 5 : 0;

  const fontFamily =
    textFont === 'Display'
      ? 'Bricolage Grotesque, Outfit, sans-serif'
      : textFont === 'Serif'
        ? 'Georgia, serif'
        : 'JetBrains Mono, monospace';

  const renderPatternDef = () => {
    if (pattern === 'Grip Ribbed') {
      return (
        <pattern id={patternId} width="12" height="12" patternUnits="userSpaceOnUse">
          <line x1="0" y1="0" x2="0" y2="12" stroke={subtleStroke} strokeWidth="2.5" />
        </pattern>
      );
    }
    if (pattern === 'Carbon Weave') {
      return (
        <pattern id={patternId} width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width="5" height="5" fill={subtleStroke} />
          <rect x="5" y="5" width="5" height="5" fill={subtleStroke} />
        </pattern>
      );
    }
    if (pattern === 'Topo Contour') {
      return (
        <pattern id={patternId} width="48" height="48" patternUnits="userSpaceOnUse">
          <path
            d="M0 24 Q12 10 24 24 T48 24 M0 10 Q16 0 32 10 T48 10 M0 38 Q16 28 32 38 T48 38"
            fill="none"
            stroke={subtleStroke}
            strokeWidth="1.4"
          />
        </pattern>
      );
    }
    return null;
  };

  const renderStamp = (x: number, y: number, scale = 1) => {
    if (stamp === 'None') return null;
    if (stamp === 'Bolt') {
      return (
        <g transform={`translate(${x}, ${y}) scale(${scale})`}>
          <circle cx="0" cy="0" r="14" fill="#141416" stroke={accentHex} strokeWidth="2" />
          <path d="M2 -9 L-6 1 H0 L-2 9 L6 -1 H0 Z" fill="#FACC15" />
        </g>
      );
    }
    if (stamp === 'Checker') {
      return (
        <g transform={`translate(${x - 13}, ${y - 13}) scale(${scale})`}>
          <rect width="26" height="26" rx="6" fill="#141416" stroke={accentHex} strokeWidth="2" />
          <rect x="3" y="3" width="6.5" height="6.5" fill="#FFFFFF" />
          <rect x="16" y="3" width="6.5" height="6.5" fill="#FFFFFF" />
          <rect x="9.5" y="9.5" width="6.5" height="6.5" fill="#FFFFFF" />
          <rect x="3" y="16" width="6.5" height="6.5" fill="#FFFFFF" />
          <rect x="16" y="16" width="6.5" height="6.5" fill="#FFFFFF" />
        </g>
      );
    }
    if (stamp === 'Sunburst') {
      return (
        <g transform={`translate(${x}, ${y}) scale(${scale})`}>
          <circle cx="0" cy="0" r="14" fill="#FACC15" stroke="#141416" strokeWidth="2" />
          <circle cx="-4.5" cy="-2.5" r="1.8" fill="#141416" />
          <circle cx="4.5" cy="-2.5" r="1.8" fill="#141416" />
          <path d="M-5.5 3 Q0 8 5.5 3" fill="none" stroke="#141416" strokeWidth="2" strokeLinecap="round" />
        </g>
      );
    }
    if (stamp === 'Stars') {
      return (
        <g transform={`translate(${x}, ${y}) scale(${scale})`}>
          <path
            d="M0 -13 L3.5 -3.5 L13 0 L3.5 3.5 L0 13 L-3.5 3.5 L-13 0 L-3.5 -3.5 Z"
            fill={accentHex}
            stroke="#141416"
            strokeWidth="1.5"
          />
          <circle cx="12" cy="-10" r="3" fill="#FACC15" />
          <circle cx="-11" cy="10" r="2.2" fill="#FFFFFF" />
        </g>
      );
    }
    if (stamp === 'Wave') {
      return (
        <g transform={`translate(${x - 14}, ${y - 10}) scale(${scale})`}>
          <rect width="28" height="20" rx="10" fill={accentHex} stroke="#141416" strokeWidth="1.8" />
          <path
            d="M4 11 Q9 5 14 11 T24 11"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
        </g>
      );
    }
    return null;
  };

  const renderPhoneText = () => {
    if (!cleanEngraving) return null;
    if (textLayout === 'Center') {
      return (
        <text
          x="66"
          y="124"
          textAnchor="middle"
          fill={inkColor}
          fontSize="14"
          fontFamily={fontFamily}
          fontWeight="800"
          letterSpacing="1.6"
        >
          {cleanEngraving}
        </text>
      );
    }
    if (textLayout === 'Diagonal') {
      return (
        <text
          x="66"
          y="138"
          textAnchor="middle"
          fill={inkColor}
          fontSize="14"
          fontFamily={fontFamily}
          fontWeight="800"
          letterSpacing="1.8"
          transform="rotate(-24 66 138)"
        >
          {cleanEngraving}
        </text>
      );
    }
    if (textLayout === 'Spine') {
      return (
        <text
          x="104"
          y="142"
          textAnchor="middle"
          fill={inkColor}
          fontSize="12"
          fontFamily={fontFamily}
          fontWeight="800"
          letterSpacing="2.4"
          transform="rotate(-90 104 142)"
        >
          {cleanEngraving}
        </text>
      );
    }
    return (
      <text
        x="66"
        y="194"
        textAnchor="middle"
        fill={inkColor}
        fontSize="11.5"
        fontFamily={fontFamily}
        fontWeight="800"
        letterSpacing="1.8"
      >
        {cleanEngraving}
      </text>
    );
  };

  const renderGenericText = (cx: number, cy: number, maxAngle = -18) => {
    if (!cleanEngraving) return null;
    const transform =
      textLayout === 'Diagonal'
        ? `rotate(${maxAngle} ${cx} ${cy})`
        : textLayout === 'Spine'
          ? `rotate(-90 ${cx} ${cy})`
          : undefined;
    const yPos = textLayout === 'Center' ? cy : textLayout === 'Bottom' ? cy + 28 : cy;
    return (
      <text
        x={cx}
        y={yPos}
        textAnchor="middle"
        fill={inkColor}
        fontSize={textLayout === 'Center' ? '12.5' : '11'}
        fontFamily={fontFamily}
        fontWeight="800"
        letterSpacing="1.8"
        transform={transform}
      >
        {cleanEngraving}
      </text>
    );
  };

  return (
    <svg
      viewBox="0 0 320 260"
      className={className}
      role="img"
      aria-label={`${protectionTier} ${category} protector in ${shellColorId} with ${accentColorId} accent and ${pattern} finish`}
    >
      <defs>
        {renderPatternDef()}
        <filter id={shadowId} x="-15%" y="-15%" width="130%" height="140%">
          <feDropShadow dx="0" dy="14" stdDeviation="12" floodColor="#09090B" floodOpacity="0.2" />
        </filter>
      </defs>

      {category === 'Phones' && (
        <g filter={`url(#${shadowId})`} transform="translate(94, 20)">
          {isBounce && (
            <g fill={accentHex}>
              <rect x={-bumperPad} y={-bumperPad} width={34 + bumperPad} height={34 + bumperPad} rx={isUltra ? 14 : 11} />
              <rect x={98} y={-bumperPad} width={34 + bumperPad} height={34 + bumperPad} rx={isUltra ? 14 : 11} />
              <rect x={-bumperPad} y={186} width={34 + bumperPad} height={34 + bumperPad} rx={isUltra ? 14 : 11} />
              <rect x={98} y={186} width={34 + bumperPad} height={34 + bumperPad} rx={isUltra ? 14 : 11} />
            </g>
          )}

          <rect x="0" y="0" width="132" height="220" rx="26" fill={accentHex} />
          <rect x="5" y="5" width="122" height="210" rx="22" fill={shellHex} />
          {pattern !== 'Smooth Matte' && (
            <rect x="5" y="5" width="122" height="210" rx="22" fill={`url(#${patternId})`} />
          )}

          <rect x="15" y="15" width="56" height="58" rx="15" fill="#111113" stroke={accentHex} strokeWidth="3" />
          <circle cx="31" cy="31" r="8.5" fill="#27272A" stroke="#52525B" strokeWidth="1.5" />
          <circle cx="31" cy="31" r="3.5" fill="#09090B" />
          <circle cx="54" cy="31" r="8.5" fill="#27272A" stroke="#52525B" strokeWidth="1.5" />
          <circle cx="54" cy="31" r="3.5" fill="#09090B" />
          <circle cx="31" cy="54" r="8.5" fill="#27272A" stroke="#52525B" strokeWidth="1.5" />
          <circle cx="31" cy="54" r="3.5" fill="#09090B" />
          <circle cx="54" cy="54" r="3" fill="#E4E4E7" />
          <text
            x="43"
            y="69"
            textAnchor="middle"
            fill="#FFFFFF"
            fontSize="4.6"
            fontFamily="JetBrains Mono, monospace"
            fontWeight="700"
            letterSpacing="1.1"
          >
            {isUltra ? 'ULTRA' : isBounce ? 'BOUNCE' : 'KINETA'}
          </text>

          <circle
            cx="66"
            cy="120"
            r="26"
            fill="none"
            stroke={accentHex}
            strokeWidth="4"
            opacity={textLayout === 'Center' ? '0.35' : '0.92'}
          />
          <line
            x1="66"
            y1="152"
            x2="66"
            y2="164"
            stroke={accentHex}
            strokeWidth="4"
            strokeLinecap="round"
            opacity={textLayout === 'Center' ? '0.35' : '0.92'}
          />

          {renderStamp(98, 46, 0.92)}
          {renderPhoneText()}
        </g>
      )}

      {category === 'Earbuds' && (
        <g filter={`url(#${shadowId})`} transform="translate(82, 46)">
          <rect x="148" y="34" width="30" height="44" rx="14" fill="none" stroke={accentHex} strokeWidth="6" />
          {isBounce && (
            <g fill={accentHex}>
              <rect x={8 - bumperPad} y={14 - bumperPad} width="32" height="32" rx="12" />
              <rect x={120 + bumperPad} y={14 - bumperPad} width="32" height="32" rx="12" />
              <rect x={8 - bumperPad} y={122 + bumperPad} width="32" height="32" rx="12" />
              <rect x={120 + bumperPad} y={122 + bumperPad} width="32" height="32" rx="12" />
            </g>
          )}
          <rect x="12" y="18" width="136" height="132" rx="34" fill={shellHex} stroke={accentHex} strokeWidth="4.5" />
          {pattern !== 'Smooth Matte' && (
            <rect x="14" y="20" width="132" height="128" rx="32" fill={`url(#${patternId})`} />
          )}
          <line x1="14" y1="68" x2="146" y2="68" stroke={accentHex} strokeWidth="3.5" />
          <rect x="60" y="61" width="40" height="14" rx="5" fill={accentHex} />
          <rect x="74" y="65" width="12" height="6" rx="2" fill={shellHex} />
          <circle cx="80" cy="90" r="3" fill={accentHex} />
          {renderStamp(114, 44, 0.78)}
          {renderGenericText(80, 108, -14)}
        </g>
      )}

      {category === 'Laptops' && (
        <g filter={`url(#${shadowId})`} transform="translate(34, 38)">
          {isBounce && (
            <g fill={accentHex}>
              <rect x={-bumperPad} y={-bumperPad} width={38 + bumperPad} height={38 + bumperPad} rx="14" />
              <rect x={214} y={-bumperPad} width={38 + bumperPad} height={38 + bumperPad} rx="14" />
              <rect x={-bumperPad} y={146} width={38 + bumperPad} height={38 + bumperPad} rx="14" />
              <rect x={214} y={146} width={38 + bumperPad} height={38 + bumperPad} rx="14" />
            </g>
          )}
          <rect x="0" y="0" width="252" height="184" rx="18" fill={accentHex} />
          <rect x="6" y="6" width="240" height="172" rx="14" fill={shellHex} />
          {pattern !== 'Smooth Matte' && (
            <rect x="6" y="6" width="240" height="172" rx="14" fill={`url(#${patternId})`} />
          )}
          <rect x="20" y="20" width="212" height="144" rx="8" fill="none" stroke={subtleStroke} strokeWidth="1.5" />
          <rect x="196" y="68" width="54" height="48" rx="8" fill={accentHex} />
          <circle cx="212" cy="92" r="4" fill={shellHex} />
          <line x1="20" y1="44" x2="232" y2="44" stroke={accentHex} strokeWidth="2.5" opacity="0.8" />
          <path d="M8 28 V14 Q8 8 14 8 H28" fill="none" stroke={accentHex} strokeWidth="4" strokeLinecap="round" />
          <path d="M224 8 H238 Q244 8 244 14 V28" fill="none" stroke={accentHex} strokeWidth="4" strokeLinecap="round" />
          <path d="M8 156 V170 Q8 176 14 176 H28" fill="none" stroke={accentHex} strokeWidth="4" strokeLinecap="round" />
          <path d="M224 176 H238 Q244 176 244 170 V156" fill="none" stroke={accentHex} strokeWidth="4" strokeLinecap="round" />
          <rect x="24" y="24" width="52" height="14" rx="3" fill="#111113" />
          <text
            x="50"
            y="33.5"
            textAnchor="middle"
            fill="#FFFFFF"
            fontSize="6"
            fontFamily="JetBrains Mono, monospace"
            fontWeight="700"
            letterSpacing="1"
          >
            {isUltra ? 'ULTRA' : isBounce ? 'BOUNCE' : 'IMPACT'}
          </text>
          {renderStamp(184, 72, 1.05)}
          {cleanEngraving ? (
            renderGenericText(118, 114, -14)
          ) : (
            <text
              x="126"
              y="144"
              textAnchor="middle"
              fill={inkColor}
              fontSize="10"
              fontFamily="JetBrains Mono, monospace"
              fontWeight="600"
              letterSpacing="2"
              opacity="0.65"
            >
              KINETA PRO
            </text>
          )}
        </g>
      )}

      {category === 'Bottles' && (
        <g filter={`url(#${shadowId})`} transform="translate(106, 16)">
          <path
            d="M36 22 C36 4, 72 4, 72 22"
            fill="none"
            stroke={accentHex}
            strokeWidth="6"
            strokeLinecap="round"
          />
          <rect x="31" y="20" width="46" height="22" rx="6" fill="#141416" />
          <rect x="28" y="40" width="52" height="8" rx="3" fill={accentHex} />
          <path
            d="M22 52 Q22 46 30 46 H78 Q86 46 86 52 L90 72 V198 Q90 214 74 214 H34 Q18 214 18 198 V72 Z"
            fill={shellHex}
          />
          {pattern !== 'Smooth Matte' && (
            <path
              d="M22 52 Q22 46 30 46 H78 Q86 46 86 52 L90 72 V198 Q90 214 74 214 H34 Q18 214 18 198 V72 Z"
              fill={`url(#${patternId})`}
            />
          )}
          <path
            d={
              isUltra
                ? 'M18 152 H90 V198 Q90 214 74 214 H34 Q18 214 18 198 Z'
                : isBounce
                  ? 'M18 162 H90 V198 Q90 214 74 214 H34 Q18 214 18 198 Z'
                  : 'M18 172 H90 V198 Q90 214 74 214 H34 Q18 214 18 198 Z'
            }
            fill={accentHex}
          />
          <line
            x1="18"
            y1={isUltra ? 152 : isBounce ? 162 : 172}
            x2="90"
            y2={isUltra ? 152 : isBounce ? 162 : 172}
            stroke="rgba(0,0,0,0.18)"
            strokeWidth="2"
          />
          <line x1="25" y1="86" x2="33" y2="86" stroke={inkColor} strokeWidth="1.5" opacity="0.5" />
          <line x1="25" y1="112" x2="37" y2="112" stroke={inkColor} strokeWidth="1.5" opacity="0.5" />
          <line x1="25" y1="138" x2="33" y2="138" stroke={inkColor} strokeWidth="1.5" opacity="0.5" />
          {renderStamp(66, 76, 0.78)}
          {renderGenericText(54, 120, -24)}
        </g>
      )}
    </svg>
  );
}
