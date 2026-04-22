# Portfolio Design Enhancement Implementation Plan

**Goal**: Transform portfolio from generic startup aesthetic to warm, editorial-inspired design WITHOUT touching the liquid WebGL background.

**Design Direction**: Warm orange (#ff7043) + serif typography (Playfair Display) + photography-first + cream canvas + gold accents + editorial aesthetic = authentic, professional, not generic.

**Core Constraint**: Liquid WebGL background in `components/ui/liquid-webgl-bg.tsx` remains untouched and preserved exactly as-is.

---

## 1. Design System Foundation

### Color Palette

| Color Name | Hex Value | Usage | HSL |
|-----------|-----------|-------|-----|
| Canvas/Background | `#0a0a0a` | Page background, preserve WebGL | `0 0% 4%` |
| Primary Text | `#f5f1ed` | Body text, warm cream | `30 20% 96%` |
| Accent (Coral-Orange) | `#ff7043` | Buttons, links, CTAs, hover states | `8 100% 65%` |
| Gold Accent | `#c9a961` | Optional luxury touches, hero moments only | `40 55% 58%` |
| Warm Gray | `#3a3430` | Dividers, secondary text, subtle elements | `20 7% 22%` |
| Card Background | `#1a1a1a` | Card surfaces, elevated elements | `0 0% 10%` |
| Border Warm | `#4a4440` | Card borders, subtle dividers | `20 7% 29%` |

### Typography Stack

#### Font Imports (add to `index.css`)
```css
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');
```

#### Font Definitions (CSS Variables)
```css
:root {
  --font-serif: 'Playfair Display', serif;
  --font-body: 'Inter', sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
}
```

#### Type Scale (defined in `tailwind.config.js`)

| Size | Usage | Font Family | Weight | Line Height |
|------|-------|-------------|--------|-------------|
| h1 | Page titles, hero headlines | Playfair Display | 700 | 1.05 |
| h2 | Section titles | Playfair Display | 600 | 1.1 |
| h3 | Subsection titles, card titles | Playfair Display | 600 | 1.1 |
| h4 | Component titles | Playfair Display | 500 | 1.2 |
| body | Default text | Inter | 400 | 1.6 |
| small | Secondary text, captions | Inter | 400 | 1.5 |
| code | Code blocks, technical | JetBrains Mono | 400 | 1.5 |

### Interaction Philosophy

- **Buttons**: Outlined warm orange style, scale (1.05) + shadow on hover, smooth transition
- **Cards**: Warm cream background OR warm orange border, subtle glow on hover
- **Links**: Warm orange text, underline on hover (classic editorial style)
- **Headings**: Serif typography, size hierarchy strictly enforced
- **Animations**: Subtle, purposeful, 300-400ms transitions (avoid excessive animation)
- **Focus States**: Orange outline, 2px, 2px offset

---

## 2. File Modifications

### 2.1 `tailwind.config.js` - Design Token Configuration

**Purpose**: Central configuration for all colors, typography, and design tokens.

**Changes**:
- Replace HSL variable system with warm color palette
- Define new font families
- Add animation presets for hover states
- Define shadow utilities for depth

**Full Configuration**:
```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Primary colors - warm palette
        cream: '#f5f1ed',
        'warm-gray': '#3a3430',
        'warm-border': '#4a4440',
        'card-bg': '#1a1a1a',
        canvas: '#0a0a0a',
        accent: '#ff7043',
        gold: '#c9a961',
        
        // Semantic colors (map to warm palette)
        background: '#0a0a0a',
        foreground: '#f5f1ed',
        border: '#4a4440',
        input: '#1a1a1a',
        ring: '#ff7043',
        
        primary: {
          DEFAULT: '#ff7043',
          foreground: '#0a0a0a',
        },
        secondary: {
          DEFAULT: '#c9a961',
          foreground: '#0a0a0a',
        },
        destructive: {
          DEFAULT: '#ff5252',
          foreground: '#f5f1ed',
        },
        muted: {
          DEFAULT: '#3a3430',
          foreground: '#f5f1ed',
        },
        accent: {
          DEFAULT: '#ff7043',
          foreground: '#0a0a0a',
        },
        card: {
          DEFAULT: '#1a1a1a',
          foreground: '#f5f1ed',
        },
      },
      fontFamily: {
        serif: ["'Playfair Display'", 'serif'],
        sans: ["'Inter'", 'sans-serif'],
        mono: ["'JetBrains Mono'", 'monospace'],
      },
      fontSize: {
        'h1': ['clamp(2.7rem, 6.5vw, 4.8rem)', { lineHeight: '1.05', letterSpacing: '-0.02em' }],
        'h2': ['clamp(2rem, 4.5vw, 3.15rem)', { lineHeight: '1.05', letterSpacing: '-0.02em' }],
        'h3': ['clamp(1.35rem, 3.2vw, 2.25rem)', { lineHeight: '1.1', letterSpacing: '-0.01em' }],
        'h4': ['clamp(1.125rem, 2.5vw, 1.5rem)', { lineHeight: '1.2', letterSpacing: '-0.005em' }],
        'body': ['1rem', { lineHeight: '1.6', letterSpacing: '0' }],
        'small': ['0.875rem', { lineHeight: '1.5', letterSpacing: '0.005em' }],
        'code': ['0.875rem', { lineHeight: '1.5', letterSpacing: '0' }],
      },
      boxShadow: {
        'warm-glow': '0 0 24px rgba(255, 112, 67, 0.15)',
        'warm-glow-lg': '0 0 40px rgba(255, 112, 67, 0.25)',
        'card': '0 2px 8px rgba(0, 0, 0, 0.4)',
        'card-hover': '0 8px 24px rgba(0, 0, 0, 0.6)',
        'gold-glow': '0 0 20px rgba(201, 169, 97, 0.15)',
      },
      animation: {
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
        'subtle-float': 'subtle-float 3s ease-in-out infinite',
      },
      keyframes: {
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 24px rgba(255, 112, 67, 0.15)' },
          '50%': { boxShadow: '0 0 40px rgba(255, 112, 67, 0.25)' },
        },
        'subtle-float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
      },
      transitionDuration: {
        'smooth': '300ms',
        'smooth-lg': '400ms',
      },
    },
  },
  plugins: [],
};
```

---

### 2.2 `src/index.css` - Global Typography & Styles

**Purpose**: Define global typography system and base styles.

**Changes**:
- Add font imports from Google Fonts
- Define CSS variables for colors
- Update body typography to warm palette
- Style headings with serif font
- Define link styles with warm orange

**Full File Content**:
```css
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');

:root {
  /* Fonts */
  --font-serif: 'Playfair Display', serif;
  --font-body: 'Inter', sans-serif;
  --font-mono: 'JetBrains Mono', monospace;

  /* Colors */
  --color-canvas: #0a0a0a;
  --color-cream: #f5f1ed;
  --color-accent: #ff7043;
  --color-gold: #c9a961;
  --color-warm-gray: #3a3430;
  --color-warm-border: #4a4440;
  --color-card-bg: #1a1a1a;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  scroll-behavior: smooth;
}

body {
  font-family: var(--font-body);
  background-color: var(--color-canvas);
  color: var(--color-cream);
  line-height: 1.6;
  letter-spacing: 0;
  overflow-x: hidden;
}

/* Typography - Headings */
h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-serif);
  font-weight: 600;
  letter-spacing: -0.02em;
  color: var(--color-cream);
}

h1 {
  font-size: clamp(2.7rem, 6.5vw, 4.8rem);
  line-height: 1.05;
  font-weight: 700;
}

h2 {
  font-size: clamp(2rem, 4.5vw, 3.15rem);
  line-height: 1.05;
  font-weight: 600;
  margin-top: 2.5rem;
  margin-bottom: 1.25rem;
}

h3 {
  font-size: clamp(1.35rem, 3.2vw, 2.25rem);
  line-height: 1.1;
  font-weight: 600;
  margin-top: 2rem;
  margin-bottom: 1rem;
}

h4 {
  font-size: clamp(1.125rem, 2.5vw, 1.5rem);
  line-height: 1.2;
  font-weight: 600;
  margin-top: 1.5rem;
  margin-bottom: 0.75rem;
}

/* Typography - Body */
p {
  font-size: 1rem;
  line-height: 1.6;
  color: var(--color-cream);
  margin-bottom: 1rem;
}

small, .text-small {
  font-size: 0.875rem;
  line-height: 1.5;
  color: var(--color-warm-gray);
}

/* Links */
a {
  color: var(--color-accent);
  text-decoration: none;
  transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

a:hover {
  text-decoration: underline;
  text-decoration-thickness: 2px;
  text-underline-offset: 4px;
}

a:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
  border-radius: 2px;
}

/* Code */
code, pre {
  font-family: var(--font-mono);
  background-color: var(--color-card-bg);
  border: 1px solid var(--color-warm-border);
  border-radius: 6px;
  padding: 2px 6px;
}

pre {
  padding: 1rem;
  overflow-x: auto;
  margin: 1rem 0;
}

pre code {
  background: none;
  border: none;
  padding: 0;
}

/* Utility Classes */
.text-h1 { font-size: clamp(2.7rem, 6.5vw, 4.8rem); line-height: 1.05; font-family: var(--font-serif); }
.text-h2 { font-size: clamp(2rem, 4.5vw, 3.15rem); line-height: 1.05; font-family: var(--font-serif); }
.text-h3 { font-size: clamp(1.35rem, 3.2vw, 2.25rem); line-height: 1.1; font-family: var(--font-serif); }
.text-h4 { font-size: clamp(1.125rem, 2.5vw, 1.5rem); line-height: 1.2; font-family: var(--font-serif); }
.text-body { font-size: 1rem; line-height: 1.6; }
.text-small { font-size: 0.875rem; line-height: 1.5; color: var(--color-warm-gray); }

.font-serif { font-family: var(--font-serif); }
.font-sans { font-family: var(--font-body); }
.font-mono { font-family: var(--font-mono); }

.text-cream { color: var(--color-cream); }
.text-accent { color: var(--color-accent); }
.text-gold { color: var(--color-gold); }
.text-warm-gray { color: var(--color-warm-gray); }

.bg-canvas { background-color: var(--color-canvas); }
.bg-card { background-color: var(--color-card-bg); }
.bg-cream-overlay { background-color: rgba(245, 241, 237, 0.02); }

.border-warm { border-color: var(--color-warm-border); }

/* Selection */
::selection {
  background-color: var(--color-accent);
  color: var(--color-canvas);
}

::-moz-selection {
  background-color: var(--color-accent);
  color: var(--color-canvas);
}

/* Scrollbar */
::-webkit-scrollbar {
  width: 10px;
}

::-webkit-scrollbar-track {
  background: var(--color-canvas);
}

::-webkit-scrollbar-thumb {
  background: var(--color-warm-border);
  border-radius: 5px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--color-warm-gray);
}
```

---

### 2.3 `src/lib/motion.ts` - Animation Presets

**Purpose**: Define reusable Framer Motion animation presets for consistent interactions.

**Update/Add**:
```typescript
// Motion presets for warm, editorial aesthetic
export const motionTokens = {
  // Container animations
  staggerContainer: {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.2,
      },
    },
  },

  // Item animations
  fadeInUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.4, ease: 'easeOut' },
  },

  fadeInLeft: {
    initial: { opacity: 0, x: -30 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.4, ease: 'easeOut' },
  },

  fadeInRight: {
    initial: { opacity: 0, x: 30 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.4, ease: 'easeOut' },
  },

  // Button/Link hover
  buttonHover: {
    scale: 1.05,
    transition: { duration: 0.3, ease: 'easeOut' },
  },

  // Card hover
  cardHover: {
    y: -4,
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.6)',
    transition: { duration: 0.3, ease: 'easeOut' },
  },

  // Glow pulse
  glowPulse: {
    animate: {
      boxShadow: [
        '0 0 24px rgba(255, 112, 67, 0.15)',
        '0 0 40px rgba(255, 112, 67, 0.25)',
        '0 0 24px rgba(255, 112, 67, 0.15)',
      ],
    },
    transition: {
      duration: 2,
      ease: 'easeInOut',
      repeat: Infinity,
    },
  },

  // Subtle float
  subtleFloat: {
    animate: {
      y: [0, -4, 0],
    },
    transition: {
      duration: 3,
      ease: 'easeInOut',
      repeat: Infinity,
    },
  },

  // Page transition
  pageTransition: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.3 },
  },
};

// Scroll trigger options for IntersectionObserver
export const scrollTriggerOptions = {
  threshold: 0.2,
  margin: '0px 0px -100px 0px',
};
```

---

### 2.4 `src/context/ThemeContext.ts` - Update Color Context

**Purpose**: Ensure theme context uses new warm color palette.

**Update to include**:
```typescript
export const warmColorPalette = {
  canvas: '#0a0a0a',
  cream: '#f5f1ed',
  accent: '#ff7043',
  gold: '#c9a961',
  warmGray: '#3a3430',
  warmBorder: '#4a4440',
  cardBg: '#1a1a1a',
};
```

---

## 3. Component Modifications

### 3.1 `src/components/Navigation.tsx` - Header Styling

**Changes**:
- Update button styles to use warm orange (#ff7043)
- Add serif font to logo/brand
- Update link hover states to warm orange with underline
- Update mobile menu background to card-bg (#1a1a1a)
- Remove purple/cyan accents, replace with warm orange

**Key Updates**:
```typescript
// Logo styling - add serif
<h1 className="font-serif text-xl font-semibold text-cream">
  Your Name
</h1>

// Link hover - warm orange underline
className={cn(
  "text-cream hover:text-accent transition-colors duration-300 relative",
  "after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5",
  "after:bg-accent after:transition-all after:duration-300",
  "hover:after:w-full"
)}

// Primary button - warm orange outlined
className="px-6 py-2.5 border-2 border-accent text-accent hover:bg-accent hover:text-canvas transition-all duration-300 rounded-lg font-medium"

// Mobile menu background
className="fixed inset-0 bg-card-bg/95 backdrop-blur-sm"

// Theme toggle button
className="p-2.5 rounded-lg border border-warm-border hover:bg-card-bg transition-colors duration-300"
```

---

### 3.2 `src/sections/Hero.tsx` - Hero Section

**Changes**:
- Keep liquid WebGL background (DO NOT MODIFY)
- Update headline to serif typography with warm cream color
- Update supporting text color to warm cream
- Change CTA button to warm orange outlined style
- Add subtle gold accent for premium feel (optional)

**Key Updates**:
```typescript
// Main headline
<h1 className="font-serif text-h1 text-cream font-bold mb-6">
  {heroTitle}
</h1>

// Supporting text
<p className="font-sans text-lg text-cream/90 max-w-2xl mb-8 leading-relaxed">
  {heroSubtitle}
</p>

// CTA button - warm orange
<button className="px-8 py-3 bg-accent hover:bg-accent/90 text-canvas font-semibold rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-warm-glow-lg">
  Get In Touch
</button>

// Scroll indicator - use warm orange
<div className="w-6 h-10 border-2 border-accent rounded-full flex justify-center animate-bounce">
  <div className="w-1 h-2 bg-accent rounded-full mt-2"></div>
</div>
```

---

### 3.3 `src/sections/Portfolio.tsx` - Project Showcase (HIGHEST IMPACT)

**Changes** (This is the most critical section):
- Redesign portfolio cards with real project photography
- Add orange accent border on hover
- Update card titles to serif typography
- Replace feature lists with benefit-focused copy
- Show only 3-4 best projects (not 20)
- Add full-bleed project images
- Update hover interactions (subtle scale, shadow, glow)

**New Card Component Pattern**:
```typescript
interface ProjectCardProps {
  title: string;
  description: string;
  image: string;
  technologies: string[];
  link: string;
  featured?: boolean;
}

export function ProjectCard({ title, description, image, technologies, link, featured }: ProjectCardProps) {
  return (
    <motion.div
      variants={fadeInUp}
      className={cn(
        'group relative overflow-hidden rounded-lg border border-warm-border',
        'bg-card-bg transition-all duration-300 hover:border-accent hover:shadow-card-hover',
        featured && 'md:col-span-2 md:row-span-2'
      )}
    >
      {/* Project Image - full-bleed */}
      <div className="relative h-64 md:h-96 overflow-hidden bg-warm-gray">
        <motion.img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card-bg via-transparent to-transparent opacity-60"></div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="font-serif text-h4 text-cream mb-3 group-hover:text-accent transition-colors">
          {title}
        </h3>

        {/* Benefit-focused description, not features */}
        <p className="text-cream/80 mb-4 text-sm leading-relaxed">
          {description}
        </p>

        {/* Technologies used */}
        <div className="flex flex-wrap gap-2 mb-4">
          {technologies.map((tech) => (
            <span
              key={tech}
              className="text-xs px-3 py-1 rounded-full bg-warm-gray text-cream/70 font-mono"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Link */}
        <motion.a
          href={link}
          className="inline-flex items-center text-accent font-medium text-sm group/link"
          whileHover={{ x: 4 }}
          transition={{ duration: 0.3 }}
        >
          View Project
          <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover/link:translate-x-1" />
        </motion.a>
      </div>

      {/* Optional: Glow effect on hover */}
      <motion.div
        className="absolute inset-0 pointer-events-none rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          boxShadow: 'inset 0 0 30px rgba(255, 112, 67, 0.1)',
        }}
      ></motion.div>
    </motion.div>
  );
}

// Portfolio section container
export function Portfolio() {
  return (
    <section id="portfolio" className="py-20 px-4 md:px-8">
      <motion.div
        variants={staggerContainer}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        className="max-w-7xl mx-auto"
      >
        <h2 className="font-serif text-h2 text-cream mb-12">
          Featured Work
        </h2>

        {/* Grid: 3-4 projects maximum */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {portfolioProjects.map((project) => (
            <ProjectCard key={project.id} {...project} featured={project.featured} />
          ))}
        </div>
      </motion.div>
    </section>
  );
}
```

---

### 3.4 `src/sections/Experience.tsx` - Work Experience

**Changes**:
- Update section title to serif
- Change timeline dots to gold (#c9a961)
- Update company names to serif typography
- Add warm orange accent for current role indicator
- Stagger animation on scroll

**Key Updates**:
```typescript
// Section header
<h2 className="font-serif text-h2 text-cream mb-12">
  Professional Experience
</h2>

// Timeline item
<div className="flex gap-6 mb-8">
  {/* Timeline dot - use gold */}
  <div className="relative flex flex-col items-center">
    <div className="w-4 h-4 bg-gold rounded-full border-2 border-card-bg shadow-gold-glow"></div>
    <div className="absolute w-1 h-24 bg-gradient-to-b from-gold to-transparent mt-4"></div>
  </div>

  {/* Content */}
  <div className="flex-1 pt-1">
    <h3 className="font-serif text-h4 text-cream mb-1">
      {role}
    </h3>
    <p className="text-accent font-medium text-sm mb-2">
      {company}
    </p>
    <p className="text-warm-gray text-sm mb-3">
      {dateRange}
    </p>
    <p className="text-cream/80 mb-3">
      {description}
    </p>
  </div>
</div>
```

---

### 3.5 `src/sections/About.tsx` - About Section

**Changes**:
- Add warm cream background overlay or subtle pattern
- Update headings to serif
- Use cream text
- Optional: Add gold accent bar on left side of key points
- Update link colors to warm orange

**Key Updates**:
```typescript
// Section with subtle background overlay
<section id="about" className="py-20 px-4 md:px-8 bg-gradient-to-b from-transparent via-cream-overlay to-transparent">
  <div className="max-w-4xl mx-auto">
    <h2 className="font-serif text-h2 text-cream mb-8">
      About Me
    </h2>

    <p className="text-cream/90 text-lg mb-6 leading-relaxed">
      {aboutText}
    </p>

    {/* Key points with gold accent */}
    <div className="space-y-4 my-8">
      {keyPoints.map((point, i) => (
        <div key={i} className="flex gap-4">
          <div className="w-1 bg-gold rounded-full flex-shrink-0"></div>
          <p className="text-cream/85">{point}</p>
        </div>
      ))}
    </div>
  </div>
</section>
```

---

### 3.6 `src/sections/Services.tsx` - Services/What I Do

**Changes**:
- Update title to serif
- Group services by category (Frontend/Backend/Design/Strategy)
- Use warm orange as accent for section headers
- Card hover: border turns orange, subtle glow
- Organize with clear visual hierarchy

**Key Updates**:
```typescript
// Service card with warm styling
<motion.div
  className="p-6 rounded-lg border border-warm-border bg-card-bg/50 hover:border-accent hover:shadow-warm-glow-lg transition-all duration-300 group"
>
  {/* Service icon - use gold background */}
  <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
    <Icon className="w-6 h-6 text-accent" />
  </div>

  <h4 className="font-serif text-h4 text-cream mb-2">
    {serviceName}
  </h4>
  <p className="text-cream/80 text-sm">
    {description}
  </p>
</motion.div>
```

---

### 3.7 `src/sections/TechStack.tsx` - Technology Stack

**Changes**:
- Group technologies by category (Frontend/Backend/Tools/Data)
- Use warm color accents for category headers
- Icons on left, text on right
- Hover: slight scale and shadow

**Key Updates**:
```typescript
// Category grouping
<div className="space-y-8">
  {techCategories.map((category) => (
    <div key={category.name}>
      {/* Category title with accent */}
      <h3 className="font-serif text-h4 text-cream mb-4 pb-2 border-b border-warm-border">
        <span className="text-accent mr-2">▸</span>
        {category.name}
      </h3>

      {/* Grid of tech items */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {category.items.map((tech) => (
          <motion.div
            key={tech.name}
            className="flex items-center gap-3 p-3 rounded-lg border border-warm-border hover:border-accent hover:shadow-card hover:scale-105 transition-all duration-300"
            whileHover={{ y: -2 }}
          >
            <tech.icon className="w-5 h-5 text-accent flex-shrink-0" />
            <span className="text-cream/90">{tech.name}</span>
          </motion.div>
        ))}
      </div>
    </div>
  ))}
</div>
```

---

### 3.8 `src/sections/CTA.tsx` - Call To Action

**Changes**:
- Update button to warm orange (#ff7043) with solid fill
- Change background to subtle pattern or overlay
- Update heading to serif with warm cream
- Add supporting text in cream

**Key Updates**:
```typescript
// CTA Button - warm orange
<motion.button
  className="px-8 py-4 bg-accent hover:bg-accent/90 text-canvas font-semibold text-lg rounded-lg transition-all duration-300 hover:scale-105 shadow-warm-glow-lg hover:shadow-warm-glow"
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.98 }}
>
  Start A Project
</motion.button>

// Subtext
<p className="text-cream/70 text-sm mt-4">
  Available for new opportunities
</p>
```

---

### 3.9 `src/sections/Footer.tsx` - Footer

**Changes**:
- Update text color to warm cream
- Update link colors to warm orange
- Update divider color to warm-border
- Social icons in warm orange on hover

**Key Updates**:
```typescript
// Footer container
<footer className="py-12 px-4 md:px-8 border-t border-warm-border">
  <div className="max-w-7xl mx-auto">
    {/* Footer content */}
    <div className="text-center text-cream/70 text-sm">
      <p>© 2024 Your Name. All rights reserved.</p>
    </div>

    {/* Social icons */}
    <div className="flex justify-center gap-6 mt-6">
      {socialLinks.map((link) => (
        <motion.a
          key={link.name}
          href={link.url}
          className="text-cream/70 hover:text-accent transition-colors duration-300"
          whileHover={{ y: -2 }}
        >
          <link.icon className="w-5 h-5" />
        </motion.a>
      ))}
    </div>
  </div>
</footer>
```

---

### 3.10 `src/sections/Credentials.tsx` - Credentials/Skills

**Changes**:
- Update card titles to serif
- Change accent color to warm orange (#ff7043)
- Add warm orange border on card hover
- Use gold accent for badges

**Key Updates**:
```typescript
// Credential card
<motion.div
  className="p-6 rounded-lg border border-warm-border bg-card-bg/50 hover:border-accent hover:shadow-warm-glow-lg transition-all duration-300"
  variants={fadeInUp}
>
  <h4 className="font-serif text-h4 text-cream mb-2">
    {credential.title}
  </h4>
  <p className="text-accent font-medium text-sm mb-3">
    {credential.issuer}
  </p>
  <p className="text-cream/70 text-sm">
    {credential.date}
  </p>
</motion.div>
```

---

### 3.11 `src/components/AnimatedButton.tsx` - Button Component

**Update to use warm orange**:
```typescript
// Button styles
className={cn(
  'px-6 py-2.5 font-medium rounded-lg transition-all duration-300',
  'border-2 border-accent text-accent hover:bg-accent hover:text-canvas',
  'hover:scale-105 hover:shadow-warm-glow-lg',
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent'
)}
```

---

### 3.12 `src/components/CustomCursor.tsx` - Custom Cursor

**Update accent color**:
```typescript
// Cursor circle color
fill: '#ff7043'

// Hover state color
fill: '#ff7043'
```

---

### 3.13 Preserve: `src/components/ui/liquid-webgl-bg.tsx`

**Status**: DO NOT MODIFY. This file remains exactly as-is. The liquid WebGL background is a signature element of the site and is preserved completely untouched.

---

## 4. Implementation Phases

### Phase 1: Design Tokens Foundation (START HERE)
**Duration**: 30 minutes
**Files**:
1. Update `tailwind.config.js` with warm color palette
2. Update `src/index.css` with font imports and CSS variables
3. Update `src/context/ThemeContext.ts` with color palette reference

**Why First**: All components depend on these tokens. Build foundation first.

**Verification**:
- Colors display correctly in browser dev tools
- Fonts load properly
- CSS variables are accessible

---

### Phase 2: Global Typography System
**Duration**: 45 minutes
**Files**:
1. Verify font imports in `index.css`
2. Test heading sizes at different breakpoints
3. Update `src/lib/motion.ts` with animation presets

**Verification**:
- All heading sizes (h1-h4) render correctly
- Font families apply properly
- Serif headlines are prominent

---

### Phase 3: Navigation & Header
**Duration**: 30 minutes
**Files**:
1. Update `src/components/Navigation.tsx`

**Changes**:
- Logo to serif font
- Links to warm orange on hover with underline
- Primary button to warm orange outlined
- Mobile menu background to card-bg

**Verification**:
- Header colors match design system
- Links have proper hover states
- Mobile menu works correctly

---

### Phase 4: Hero Section
**Duration**: 30 minutes
**Files**:
1. Update `src/sections/Hero.tsx`

**Changes**:
- Headlines to serif with warm cream
- Button to warm orange
- Keep liquid WebGL background UNTOUCHED

**Verification**:
- WebGL background remains visible (DO NOT MODIFY)
- Headlines are serif and prominent
- Button has correct styling

---

### Phase 5: Portfolio Section (HIGHEST PRIORITY)
**Duration**: 90 minutes
**Files**:
1. Redesign `src/sections/Portfolio.tsx`
2. Create ProjectCard component
3. Add/update project images

**Changes**:
- New card layout with full-bleed images
- 3-4 featured projects maximum
- Benefit-focused copy (not feature lists)
- Orange accent on hover
- Smooth image scale animation

**Critical**:
- Requires real project photography/screenshots
- Each project needs: title, benefit-focused description, 2-3 tech tags, image
- Hover states are essential for interaction feedback

**Verification**:
- Cards display correctly
- Images load properly
- Hover states work smoothly
- Text is legible over images

---

### Phase 6: Section Styling (Experience, About, Services, Tech Stack)
**Duration**: 120 minutes
**Files**:
1. Update `src/sections/Experience.tsx` - gold timeline
2. Update `src/sections/About.tsx` - serif headings, gold accents
3. Update `src/sections/Services.tsx` - category grouping, warm accents
4. Update `src/sections/TechStack.tsx` - tech categories with icons

**Changes**:
- Serif typography for all section titles
- Warm cream text color
- Gold accents for timeline/key points
- Orange accents for hover states
- Proper visual hierarchy

**Verification**:
- All sections use consistent typography
- Color palette applied consistently
- Hover states work smoothly
- Responsive on mobile

---

### Phase 7: CTA & Footer
**Duration**: 30 minutes
**Files**:
1. Update `src/sections/CTA.tsx`
2. Update `src/sections/Footer.tsx`

**Changes**:
- CTA button to warm orange solid fill
- Footer text to warm cream
- Footer links to warm orange
- Social icons with hover effects

**Verification**:
- Buttons are accessible and clickable
- Text contrast is sufficient (WCAG AA minimum)
- Social links work correctly

---

### Phase 8: Interactions & Hover States
**Duration**: 60 minutes
**Files**:
- All component files (already updated in phases 3-7)

**Focus**:
- Button hover: scale 1.05, shadow increase, smooth transition
- Card hover: border color change to orange, shadow increase, subtle glow
- Link hover: underline appears, color changes to orange
- All transitions: 300ms, easeOut

**Verification**:
- All interactive elements respond to hover
- Animations are smooth (60fps)
- No janky transitions

---

### Phase 9: Responsive Design & Mobile Optimization
**Duration**: 60 minutes
**Files**:
- Use existing `use-mobile.ts` hook
- Test all components on mobile

**Focus**:
- Font sizes scale properly
- Touch targets are adequate (44px minimum)
- Spacing works on small screens
- Images are optimized

**Verification**:
- Mobile navigation works
- Portfolio cards stack correctly
- Text is readable on small screens
- No horizontal scroll

---

### Phase 10: Performance & Polish
**Duration**: 45 minutes
**Focus**:
- Image optimization (lazy loading)
- Animation performance (use CSS where possible)
- Loading states
- Error handling

**Verification**:
- Lighthouse scores
- Core Web Vitals
- Smooth scrolling
- No layout shifts

---

## 5. Color Application Guide

### When to Use Each Color

| Context | Color | Usage |
|---------|-------|-------|
| Primary Text | `#f5f1ed` cream | All body text, section content |
| Section Headlines | `#f5f1ed` cream | h1, h2, h3, h4 default color |
| Links & CTAs | `#ff7043` orange | Links, buttons, interactive elements |
| Hover States | `#ff7043` orange | Link underline, button background, border |
| Timeline Dots | `#c9a961` gold | Experience timeline, key point accents |
| Dividers | `#4a4440` warm-border | Card borders, section dividers |
| Subtle Text | `#3a3430` warm-gray | Secondary text, captions, metadata |
| Card Backgrounds | `#1a1a1a` card-bg | Card surfaces, elevated elements |
| Page Background | `#0a0a0a` canvas | Body background (preserves WebGL) |

### Never Use
- Pure white (#ffffff) - use warm cream (#f5f1ed)
- Pure black (#000000) - use canvas (#0a0a0a)
- Purple/cyan accents - replaced with warm orange (#ff7043)
- Default Tailwind grays - use warm-gray palette

---

## 6. Typography Usage Guide

### Headlines
- **Font**: Playfair Display (serif)
- **Weight**: 600-700
- **Color**: Cream (#f5f1ed)
- **Spacing**: Letter-spacing -0.02em for h1/h2

### Body Text
- **Font**: Inter (sans-serif)
- **Weight**: 400
- **Size**: 1rem (16px) desktop, scales on mobile
- **Line Height**: 1.6
- **Color**: Cream (#f5f1ed)

### Code/Technical
- **Font**: JetBrains Mono (monospace)
- **Weight**: 400
- **Size**: 0.875rem (14px)
- **Background**: Card-bg (#1a1a1a)
- **Border**: Warm-border (#4a4440)

### Links
- **Font**: Body font (Inter)
- **Color**: Orange (#ff7043)
- **Hover**: Underline appears, 2px thickness, 4px offset
- **Transition**: 300ms

---

## 7. Copy Strategy

### Portfolio Descriptions
**Rule**: Focus on benefit, not features

❌ **Wrong**:
> "Built with React, TypeScript, and Tailwind CSS. Features responsive design and dark mode support."

✅ **Right**:
> "Delivered a 40% faster checkout experience, reducing cart abandonment by $50k/month in the first quarter."

### Section Headlines
**Rule**: Lead with value/action, not generic labels

❌ **Wrong**: "Services" or "What I Do"
✅ **Right**: "How I Build Products" or "The Problems I Solve"

### About Section
**Rule**: Tell story, not feature list

Show personality, process, why you do this work, what drives you.

---

## 8. Quick Reference: File Checklist

- [ ] `tailwind.config.js` - Color palette, typography, shadows
- [ ] `src/index.css` - Font imports, CSS variables, base styles
- [ ] `src/lib/motion.ts` - Animation presets updated
- [ ] `src/context/ThemeContext.ts` - Color palette reference
- [ ] `src/components/Navigation.tsx` - Warm orange, serif logo
- [ ] `src/sections/Hero.tsx` - Serif headings, warm cream, orange button
- [ ] `src/sections/Portfolio.tsx` - NEW card design, photography focus
- [ ] `src/sections/Experience.tsx` - Gold timeline, serif titles
- [ ] `src/sections/About.tsx` - Serif headings, gold accents
- [ ] `src/sections/Services.tsx` - Category grouping, warm accents
- [ ] `src/sections/TechStack.tsx` - Tech categories with icons
- [ ] `src/sections/CTA.tsx` - Orange button, warm text
- [ ] `src/sections/Footer.tsx` - Warm colors, orange links
- [ ] `src/sections/Credentials.tsx` - Orange accents on cards
- [ ] `src/components/AnimatedButton.tsx` - Orange styling
- [ ] `src/components/CustomCursor.tsx` - Orange accent color
- [ ] `src/components/ui/liquid-webgl-bg.tsx` - **DO NOT MODIFY** ✓

---

## 9. Success Criteria

✅ **Design System**:
- All colors from palette only
- All headings use Playfair Display serif
- All body text uses Inter
- Color contrast meets WCAG AA (4.5:1 for text)

✅ **Visual Consistency**:
- Warm orange used consistently for accents
- Serif headings prominent throughout
- Warm cream text on dark canvas
- Gold accents used sparingly (timeline, key points)

✅ **Interactions**:
- All buttons scale on hover (1.05)
- All links have underline on hover
- Card borders turn orange on hover
- Animations smooth (300-400ms)

✅ **Background**:
- Liquid WebGL background completely untouched
- Background visible throughout site
- No changes to `liquid-webgl-bg.tsx`

✅ **Performance**:
- Lighthouse score 80+
- Smooth scrolling (60fps)
- Images lazy loaded
- No layout shifts (CLS < 0.1)

✅ **Responsive**:
- Mobile menu works correctly
- Text readable on all screens
- Touch targets 44px minimum
- No horizontal scroll

---

## 10. Notes for Development

### Important Reminders
1. **Background**: The liquid WebGL background is perfect. DO NOT modify it. All enhancements go ON TOP.
2. **Colors**: All colors must come from the defined palette. Never use arbitrary colors.
3. **Typography**: All headlines MUST use Playfair Display serif. This is the differentiator.
4. **Photography**: Portfolio cards need real project screenshots/images. This is critical for "photography-first" strategy.
5. **Authenticity**: Copy and visuals should reflect actual work. Generic filler kills the vibe.

### Testing Checklist
- [ ] Desktop view (1920px, 1440px, 1024px)
- [ ] Tablet view (768px)
- [ ] Mobile view (375px, 414px)
- [ ] Hover states on all interactive elements
- [ ] Touch interactions on mobile
- [ ] Font loading (before and after)
- [ ] Image loading (connection throttled)
- [ ] Keyboard navigation (Tab, Enter, Escape)
- [ ] Screen reader compatibility (basic check)
- [ ] Dark/light theme consistency

---

**End of Implementation Plan**

Execute in phases, starting with Phase 1 (Design Tokens). Each phase builds on the previous, so don't skip ahead. The portfolio section (Phase 5) is the highest visual impact and requires real imagery—prioritize this after the foundation is set.

All changes preserve the liquid WebGL background completely untouched.
