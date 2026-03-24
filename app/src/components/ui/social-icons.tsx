import { useMemo, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

import { Phone } from "lucide-react";

export type SocialIconItem = {
  name: string;
  href: string;
  icon?: ReactNode;
};

const defaultSocials: SocialIconItem[] = [
  {
    name: "GitHub",
    href: "https://github.com",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="size-[18px]">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
      </svg>
    ),
  },
  {
    name: "Email",
    href: "mailto:hello@example.com",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="size-[18px]">
        <path d="M2 5.5A2.5 2.5 0 0 1 4.5 3h15A2.5 2.5 0 0 1 22 5.5v13a2.5 2.5 0 0 1-2.5 2.5h-15A2.5 2.5 0 0 1 2 18.5v-13Zm2.1.5L12 11.48 19.9 6H4.1Zm15.9 2.04-7.43 5.16a1 1 0 0 1-1.14 0L4 8.04V18.5a.5.5 0 0 0 .5.5h15a.5.5 0 0 0 .5-.5V8.04Z" />
      </svg>
    ),
  },
  {
    name: "LinkedIn",
    href: "https://linkedin.com",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="size-[18px]">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    name: "Phone",
    href: "tel:+1234567890",
    icon: <Phone className="size-[18px]" />,
  },
];

function iconForName(name: string) {
  const found = defaultSocials.find((item) => item.name.toLowerCase() === name.toLowerCase());
  return found?.icon;
}

export function SocialIcons({
  items = defaultSocials,
  className,
}: {
  items?: SocialIconItem[];
  className?: string;
}) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const socialItems = useMemo(
    () =>
      items.map((item) => ({
        ...item,
        icon: item.icon ?? iconForName(item.name),
      })),
    [items]
  );

  return (
    <div
      className={cn(
        "relative flex w-fit items-center gap-0.5 rounded-2xl px-1.5 py-1.5",
        className
      )}
      style={{
        border: '1px solid var(--border-dim)',
        background: 'var(--bg-elevated)',
      }}
    >
      <div className="absolute inset-0 rounded-2xl pointer-events-none" style={{ background: 'linear-gradient(to bottom, var(--border-subtle), transparent)' }} />

      {socialItems.map((social, index) => (
        <a
          key={social.name}
          href={social.href}
          target={social.href.startsWith("http") ? "_blank" : undefined}
          rel={social.href.startsWith("http") ? "noopener noreferrer" : undefined}
          className="group relative flex items-center justify-center size-10 rounded-xl transition-colors duration-200"
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(null)}
          aria-label={social.name}
        >
          <span
            className={`absolute inset-1 rounded-lg transition-all duration-300 ease-out ${hoveredIndex === index ? "opacity-100 scale-100" : "opacity-0 scale-90"
              }`}
            style={{ background: 'var(--cyan-glow)' }}
          />

          <span
            className={`relative z-10 transition-all duration-300 ease-out ${hoveredIndex === index ? "scale-110" : ""
              }`}
            style={{ color: hoveredIndex === index ? 'var(--cyan-full)' : 'var(--text-300)' }}
          >
            {social.icon}
          </span>

          <span
            className={`absolute bottom-1.5 left-1/2 -translate-x-1/2 h-[2px] rounded-full transition-all duration-300 ease-out ${hoveredIndex === index ? "w-3 opacity-100" : "w-0 opacity-0"
              }`}
            style={{ background: 'var(--cyan-full)' }}
          />

          <span
            className={`absolute -top-10 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-lg text-[11px] font-medium whitespace-nowrap transition-all duration-300 ease-out ${hoveredIndex === index ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1 pointer-events-none"
              }`}
            style={{
              background: 'var(--bg-elevated)',
              color: 'var(--text-100)',
              border: '1px solid var(--border-dim)',
            }}
          >
            {social.name}
            <span
              className="absolute -bottom-1 left-1/2 -translate-x-1/2 size-2 rotate-45"
              style={{ background: 'var(--bg-elevated)' }}
            />
          </span>
        </a>
      ))}
    </div>
  );
}
