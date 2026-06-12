interface CreateSpaceIllustrationProps {
  className?: string;
}

export function CreateSpaceIllustration({ className }: CreateSpaceIllustrationProps) {
  return (
    <svg
      viewBox="0 0 400 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        {/* Accent Gradient (Primary theme color to Accent theme color) */}
        <linearGradient id="accentGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--primary)" />
          <stop offset="100%" stopColor="var(--accent)" stopOpacity={0.6} />
        </linearGradient>
        
        {/* Secondary Gradient (Secondary theme color to Primary theme color) */}
        <linearGradient id="themeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--secondary)" />
          <stop offset="100%" stopColor="var(--primary)" />
        </linearGradient>
        
        {/* Glassmorphic card fill using card background with varying opacity */}
        <linearGradient id="glassGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--card)" stopOpacity={0.8} />
          <stop offset="100%" stopColor="var(--card)" stopOpacity={0.3} />
        </linearGradient>

        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="8" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="24" result="blur" />
        </filter>
      </defs>

      {/* Ambient Glow */}
      <circle
        cx="200"
        cy="200"
        r="120"
        fill="url(#accentGrad)"
        opacity={0.15}
        filter="url(#softGlow)"
      />
      <circle
        cx="280"
        cy="150"
        r="80"
        fill="url(#themeGrad)"
        opacity={0.1}
        filter="url(#softGlow)"
      />

      {/* Grid Lines */}
      <g stroke="var(--border)" strokeOpacity={0.4} strokeWidth={1}>
        <path d="M50,200 L350,200" />
        <path d="M200,50 L200,350" />
        <circle cx="200" cy="200" r="140" strokeDasharray="4 6" />
        <circle cx="200" cy="200" r="90" strokeDasharray="3 4" />
        <circle cx="200" cy="200" r="40" strokeDasharray="2 3" />
      </g>

      {/* Platform Base */}
      <g transform="translate(0, 10)">
        <ellipse
          cx="200"
          cy="280"
          rx="90"
          ry="25"
          fill="var(--primary)"
          opacity={0.15}
          filter="url(#softGlow)"
        />
        <ellipse
          cx="200"
          cy="280"
          rx="95"
          ry="28"
          fill="var(--card)"
          stroke="var(--border)"
          strokeOpacity={0.5}
          strokeWidth={1.5}
        />
        <ellipse
          cx="200"
          cy="277"
          rx="95"
          ry="28"
          fill="var(--background)"
          stroke="url(#accentGrad)"
          strokeOpacity={0.6}
          strokeWidth={1.5}
        />
        <line
          x1="200"
          y1="277"
          x2="200"
          y2="120"
          stroke="url(#accentGrad)"
          strokeWidth={2}
          strokeDasharray="4 4"
          opacity={0.5}
        />
      </g>

      {/* Main Floating Space Card */}
      <g transform="translate(0, -10)">
        {/* Soft Shadow behind card */}
        <rect
          x="110"
          y="110"
          width="180"
          height="130"
          rx="16"
          fill="var(--foreground)"
          opacity={0.08}
        />
        {/* Glass Card Body */}
        <rect
          x="110"
          y="105"
          width="180"
          height="130"
          rx="16"
          fill="url(#glassGrad)"
          stroke="var(--border)"
          strokeOpacity={0.6}
          strokeWidth={1.5}
          style={{ backdropFilter: "blur(8px)" }}
        />
        {/* Glowing border highlight */}
        <path
          d="M 140 105 L 126 105 A 16 16 0 0 0 110 121 L 110 140"
          stroke="url(#accentGrad)"
          strokeWidth={2}
          fill="none"
          filter="url(#glow)"
        />

        {/* Mac-style Window Controls */}
        <circle cx="130" cy="125" r="5" fill="#ef4444" opacity={0.8} />
        <circle cx="145" cy="125" r="5" fill="#f59e0b" opacity={0.8} />
        <circle cx="160" cy="125" r="5" fill="#10b981" opacity={0.8} />

        {/* Stylized 3D Room Grid */}
        <g transform="translate(130, 145)" opacity={0.7}>
          <path
            d="M 20 10 L 120 10"
            stroke="var(--border)"
            strokeOpacity={0.8}
            strokeWidth={1.5}
          />
          <path
            d="M 20 10 L 20 60"
            stroke="var(--border)"
            strokeOpacity={0.8}
            strokeWidth={1.5}
          />
          <path
            d="M 120 10 L 120 60"
            stroke="var(--border)"
            strokeOpacity={0.8}
            strokeWidth={1.5}
          />
          <path
            d="M 20 60 L 0 80"
            stroke="var(--border)"
            strokeOpacity={0.8}
            strokeWidth={1.5}
          />
          <path
            d="M 120 60 L 140 80"
            stroke="var(--border)"
            strokeOpacity={0.8}
            strokeWidth={1.5}
          />
          <path
            d="M 0 80 L 140 80"
            stroke="var(--border)"
            strokeOpacity={0.8}
            strokeWidth={1.5}
          />

          {/* Central 3D Floating Object */}
          <g transform="translate(70, 35)">
            <circle
              cx="0"
              cy="0"
              r="15"
              fill="var(--primary)"
              opacity={0.3}
              filter="url(#glow)"
            />
            {/* Isometric Cube representation */}
            <path
              d="M 0 -12 L 10 -6 L 10 6 L 0 12 L -10 6 L -10 -6 Z"
              fill="url(#accentGrad)"
              opacity={0.9}
            />
            <path
              d="M 0 -12 L 0 12"
              stroke="var(--background)"
              strokeOpacity={0.5}
              strokeWidth={1}
            />
            <path
              d="M -10 -6 L 0 0 L 10 -6"
              fill="none"
              stroke="var(--background)"
              strokeOpacity={0.5}
              strokeWidth={1}
            />
            <path
              d="M 0 0 L 10 6"
              stroke="var(--background)"
              strokeOpacity={0.5}
              strokeWidth={1}
            />
            <path
              d="M 0 0 L -10 6"
              stroke="var(--background)"
              strokeOpacity={0.5}
              strokeWidth={1}
            />
          </g>
        </g>
      </g>

      {/* Left Floating Chat Bubble */}
      <g transform="translate(60, 110)">
        <circle
          cx="20"
          cy="20"
          r="18"
          fill="url(#themeGrad)"
          opacity={0.15}
          filter="url(#glow)"
        />
        <rect
          x="0"
          y="0"
          width="40"
          height="30"
          rx="8"
          fill="url(#glassGrad)"
          stroke="var(--border)"
          strokeOpacity={0.5}
          strokeWidth={1}
        />
        <path
          d="M 10 30 L 15 35 L 20 30 Z"
          fill="var(--card)"
          stroke="var(--border)"
          strokeOpacity={0.5}
          strokeWidth={1}
        />
        <circle cx="12" cy="15" r="2" fill="var(--primary)" />
        <circle cx="20" cy="15" r="2" fill="var(--primary)" />
        <circle cx="28" cy="15" r="2" fill="var(--primary)" />
      </g>

      {/* Right Floating User Avatar */}
      <g transform="translate(300, 160)">
        <circle
          cx="20"
          cy="20"
          r="18"
          fill="url(#accentGrad)"
          opacity={0.15}
          filter="url(#glow)"
        />
        <rect
          x="0"
          y="0"
          width="40"
          height="40"
          rx="20"
          fill="url(#glassGrad)"
          stroke="url(#accentGrad)"
          strokeOpacity={0.6}
          strokeWidth={1}
        />
        <circle cx="20" cy="16" r="6" fill="var(--primary)" />
        <path
          d="M 10 30 A 10 10 0 0 1 30 30"
          fill="none"
          stroke="var(--primary)"
          strokeWidth={2}
          strokeLinecap="round"
        />
      </g>

      {/* Sparkles / Dynamic Color Accent Stars */}
      <g transform="translate(260, 90)">
        <path
          d="M 0 10 Q 10 10 10 0 Q 10 10 20 10 Q 10 10 10 20 Q 10 10 0 10 Z"
          fill="var(--accent)"
          filter="url(#glow)"
        />
      </g>
      <g transform="translate(90, 240)">
        <path
          d="M 0 8 Q 8 8 8 0 Q 8 8 16 8 Q 8 8 8 16 Q 8 8 0 8 Z"
          fill="var(--primary)"
          filter="url(#glow)"
        />
      </g>
      <g transform="translate(130, 70)">
        <path
          d="M 0 6 Q 6 6 6 0 Q 6 6 12 6 Q 6 6 6 12 Q 6 6 0 6 Z"
          fill="var(--secondary)"
          filter="url(#glow)"
          opacity={0.8}
        />
      </g>

      {/* Futuristic Orbits */}
      <ellipse
        cx="200"
        cy="170"
        rx="140"
        ry="40"
        fill="none"
        stroke="url(#accentGrad)"
        strokeWidth={1.5}
        strokeDasharray="10 15"
        opacity={0.3}
        transform="rotate(-15, 200, 170)"
      />
      <ellipse
        cx="200"
        cy="170"
        rx="120"
        ry="30"
        fill="none"
        stroke="url(#themeGrad)"
        strokeWidth={1.5}
        strokeDasharray="5 8"
        opacity={0.4}
        transform="rotate(10, 200, 170)"
      />
    </svg>
  );
}
