/**
 * UUSIMA 品牌Logo组件
 * 四色蝴蝶翼标志：珊瑚红、天际蓝、翡翠绿、琥珀金
 */
export function UusimaLogo({ size = 40, className = '' }: { size?: number; className?: string }) {
  const half = size / 2;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* 左上 - 珊瑚红 */}
      <path
        d="M46 8C46 8 46 46 8 46C8 46 46 46 46 8Z"
        fill="#E85D3A"
      />
      <path
        d="M46 8C46 8 18 10 8 46C8 46 10 18 46 8Z"
        fill="#D14E2E"
      />
      {/* 右上 - 天际蓝 */}
      <path
        d="M54 8C54 8 54 46 92 46C92 46 54 46 54 8Z"
        fill="#4A90D9"
      />
      <path
        d="M54 8C54 8 82 10 92 46C92 46 90 18 54 8Z"
        fill="#3A7BC8"
      />
      {/* 星星装饰 */}
      <polygon
        points="76,18 78,24 84,24 79,28 81,34 76,30 71,34 73,28 68,24 74,24"
        fill="#F5A623"
      />
      {/* 左下 - 翡翠绿 */}
      <path
        d="M46 92C46 92 46 54 8 54C8 54 46 54 46 92Z"
        fill="#27AE60"
      />
      <path
        d="M46 92C46 92 18 90 8 54C8 54 10 82 46 92Z"
        fill="#1E9B52"
      />
      {/* 右下 - 琥珀金 */}
      <path
        d="M54 92C54 92 54 54 92 54C92 54 54 54 54 92Z"
        fill="#F5A623"
      />
      <path
        d="M54 92C54 92 82 90 92 54C92 54 90 82 54 92Z"
        fill="#E09515"
      />
    </svg>
  );
}

export function UusimaLogoFull({ height = 36, className = '' }: { height?: number; className?: string }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <UusimaLogo size={height} />
      <div className="flex flex-col leading-tight">
        <span
          className="font-display font-black tracking-wider"
          style={{ fontSize: height * 0.45, color: '#1A1A2E', letterSpacing: '0.08em' }}
        >
          UUSIMA
        </span>
        <span
          className="font-medium tracking-wide"
          style={{ fontSize: height * 0.28, color: '#64748b' }}
        >
          硬件智能体系统
        </span>
      </div>
    </div>
  );
}
