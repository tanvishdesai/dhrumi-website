# 🚀 RVFET.COM Clone - Implementation Plan

## 📋 Overview

**Original Site**: https://rvfet.com/ - Built with Astro + Tailwind CSS v4 + Basecoat (Radix-based UI)  
**Clone Target**: Next.js 16 + Tailwind CSS v4 + Radix UI

---

## 🎨 1. Design System & Assets

### 1.1 Fonts (Critical - Must Download/Host)
| Font File | Usage |
|-----------|-------|
| `Brachial-UltraBold-UltraWide.woff2` | Hero name "RAFET" (first name) |
| `Brachial-UltraBold.woff2` | "ABBASLI" (last name outline style) |
| `PPNeueMachina-PlainVariable.woff2` | Section headings |
| `JetBrainsMono-Regular.woff2` | Code/monospace text |

### 1.2 Color Scheme (CSS Variables)
```css
/* Light Mode */
--background: oklch(100% 0 0);      /* white */
--foreground: oklch(14.5% 0 0);     /* near black */
--primary: oklch(20.5% 0 0);
--card: oklch(100% 0 0);
--muted: oklch(97% 0 0);
--border: oklch(92.2% 0 0);
--radius: 0.625rem;

/* Dark Mode */
--background: oklch(0% 0 0);        /* black */
--foreground: oklch(98% 0 0);       /* white */
```

---

## 🏗️ 2. Project Structure

```
dhrumi-website/
├── app/
│   ├── layout.tsx           # Root layout with theme provider
│   ├── page.tsx             # Homepage
│   └── globals.css          # Global styles & CSS variables
├── components/
│   ├── layout/
│   │   ├── Header.tsx       # Navigation with logo, links, settings
│   │   ├── Footer.tsx       # Credits, links, build info
│   │   └── BackToTop.tsx    # Floating back-to-top button
│   ├── hero/
│   │   ├── HeroSection.tsx  # Main hero container
│   │   ├── AnimatedName.tsx # Letter-by-letter animation
│   │   └── Globe.tsx        # 3D WebGL globe
│   ├── sections/
│   │   ├── AboutSection.tsx
│   │   ├── BlogCarousel.tsx # 3D card carousel
│   │   ├── PhilosophyCards.tsx
│   │   ├── ProjectsAccordion.tsx
│   │   ├── SkillsMarquee.tsx
│   │   └── CodingStats.tsx
│   ├── effects/
│   │   ├── BackgroundGrid.tsx    # WebGL animated grid
│   │   └── Marquee.tsx           # Scrolling text component
│   └── ui/                  # Radix-based UI components
├── hooks/
│   ├── useSettings.ts       # Settings state management
│   └── useTheme.ts          # Theme toggle logic
├── lib/
│   └── utils.ts             # Utility functions
├── public/
│   ├── fonts/               # Custom fonts
│   └── images/              # Static images, icons
└── types/
    └── index.ts             # TypeScript interfaces
```

---

## 🔧 3. Dependencies

```bash
npm install three @react-three/fiber @react-three/drei
npm install @radix-ui/react-popover @radix-ui/react-slider @radix-ui/react-select @radix-ui/react-switch @radix-ui/react-accordion
npm install lucide-react
npm install zustand
npm install clsx tailwind-merge
```

---

## 📑 4. Key Components

### 4.1 Background Grid (WebGL2)
- Canvas element positioned fixed behind content
- WebGL2 fragment shader with grid lines + blob highlights
- Mouse-following highlight effect
- Configurable: grid size, line width, opacity

### 4.2 3D Globe (Three.js)
- Wireframe sphere with meridians and parallels
- Ring with rotating text
- RGB chromatic aberration effect
- Mouse/gyroscope interaction

### 4.3 Blog Carousel (3D CSS)
- CSS 3D transform-based carousel
- Auto-rotation with timer
- Cards with CVSS badges, preview images

### 4.4 Skills Marquee
- Infinite horizontal scroll
- Three rows: ENGINEERING, SECURITY, TOOLS
- Alternating scroll directions

### 4.5 Projects Accordion
- Radix UI Accordion
- Numbered items with icons
- Expandable detailed content

---

## 🔨 5. Implementation Phases

### Phase 1: Foundation
- [x] Initialize Next.js project
- [ ] Set up Tailwind CSS with custom theme
- [ ] Add custom fonts
- [ ] Create CSS variables
- [ ] Build Header component
- [ ] Build Footer component
- [ ] Implement theme toggle

### Phase 2: Hero Section
- [ ] Create animated name component
- [ ] Implement WebGL background grid
- [ ] Build 3D globe
- [ ] Compose hero layout

### Phase 3: Content Sections
- [ ] About section
- [ ] Philosophy cards
- [ ] Projects accordion
- [ ] Skills marquee
- [ ] Coding stats table

### Phase 4: Blog Carousel
- [ ] 3D carousel component
- [ ] Blog card component
- [ ] Auto-rotation

### Phase 5: Settings & Polish
- [ ] Settings panel
- [ ] Settings persistence
- [ ] Mobile responsiveness
- [ ] Performance optimizations

---

## 📱 6. Responsive Breakpoints

| Breakpoint | Layout Changes |
|------------|----------------|
| Mobile (<640px) | Single column, simplified effects |
| Tablet (640-1024px) | Two columns, adjusted spacing |
| Desktop (>1024px) | Full layout with all effects |

---

## ⚠️ 7. Technical Notes

- WebGL grid uses fragment shaders for performance
- Globe uses Three.js with custom shaders for RGB shift
- Settings stored in localStorage
- Low performance mode disables animations on mobile
