# pipermorgan.ai — Information Architecture Sketch

**Version**: Draft v1  
**Date**: February 8, 2026  
**Author**: CXO  

---

## Site Map

```
pipermorgan.ai
│
├── / (Homepage)
│   ├── Hero + Primary CTA
│   ├── Positioning section ("work between the work")
│   ├── What Piper Does (capability highlights)
│   ├── Why Trust Us (building in public proof)
│   └── Secondary CTAs in footer area
│
├── /try (Primary CTA destination)
│   ├── Branching page: "How adventurous are you?"
│   │   ├── → /try/alpha ("I'm ready now")
│   │   │     └── Alpha signup process
│   │   │     └── Links to pmorgan.tech setup
│   │   │
│   │   └── → /try/beta ("Tell me when it's easier")
│   │         └── Beta waitlist form
│   │         └── Optional: role, tools, pain points, referral source
│   │
│   └── [Future: /try/start — direct product access when available]
│
├── /get-involved (Secondary CTA destination)
│   ├── Contributor overview
│   ├── → pmorgan.tech (setup guides, technical docs)
│   ├── → GitHub repository
│   └── [Future: community/Discord/forum links]
│
├── /journey (Tertiary — existing blog content)
│   ├── Blog index (building-in-public posts)
│   ├── Weekly Ships archive
│   └── Individual post pages
│
├── /methodology (Tertiary — how we work)
│   ├── Excellence Flywheel overview
│   ├── Systematic approach explanation
│   └── → Links to deeper methodology content
│
├── /playbook (Tertiary — when ready)
│   └── AI Leadership Playbook content
│   └── [Gated or ungated TBD]
│
├── /about
│   ├── Project story
│   ├── Your (xian's) background
│   └── Vision / where this is going
│
└── [Global elements]
    ├── Header nav: [Try Piper] [Get Involved] [Journey ▾] [About]
    ├── Footer: Newsletter signup, social links, pmorgan.tech link
    └── [Mobile: hamburger menu with same structure]
```

---

## Navigation Design

### Primary Nav (Header)

| Item | Type | Destination |
|------|------|-------------|
| **Try Piper** | Button (emphasized) | /try |
| Get Involved | Link | /get-involved |
| Journey ▾ | Dropdown | /journey, /methodology, /playbook |
| About | Link | /about |

**Rationale**: 
- Primary CTA as button keeps it visually distinct
- "Journey" dropdown consolidates tertiary content without cluttering nav
- Four items max keeps nav clean

### Mobile Nav

Same structure, hamburger menu. "Try Piper" could remain visible outside hamburger as persistent CTA.

---

## Page Purposes

| Page | User Question | Success Metric |
|------|---------------|----------------|
| Homepage | "What is this? Should I care?" | Click on primary CTA |
| /try | "Am I ready for this?" | Self-select into alpha or beta |
| /try/alpha | "How do I get started?" | Complete signup, reach pmorgan.tech |
| /try/beta | "Keep me posted" | Submit email + optional info |
| /get-involved | "How can I contribute?" | Click through to pmorgan.tech or GitHub |
| /journey | "What's the story?" | Read posts, subscribe to newsletter |
| /methodology | "How does this work?" | Understand approach, build trust |
| /playbook | "What can I learn?" | Engage with playbook content |
| /about | "Who's behind this?" | Build trust, understand vision |

---

## Content Migration Notes

### From Current Site

| Current Content | Destination |
|-----------------|-------------|
| Homepage | Replace with new hero/positioning |
| Blog posts (160) | /journey (structure stays, content stays) |
| About page | /about (refresh copy) |
| Newsletter signup | Footer + /journey pages |

### New Content Needed

| Page | Content Status |
|------|----------------|
| Homepage | Awaiting Comms copy development |
| /try (branching) | Needs copy (CXO sketched in earlier session) |
| /try/alpha | Needs copy + form design |
| /try/beta | Needs copy + form design |
| /get-involved | Needs copy (can be lightweight initially) |
| /methodology | Needs copy (can pull from existing docs) |
| /playbook | Future — not needed for initial refresh |

---

## Open Questions

### 1. Journey Dropdown Contents

Options:
- **A**: Journey (blog), Methodology, Playbook
- **B**: Blog, How It Works, Playbook  
- **C**: The Story, The Method, The Playbook

Recommendation: Decide based on final copy tone. "Journey" works if we keep building-in-public framing visible.

### 2. Newsletter Placement

Options:
- **A**: Footer only (subtle)
- **B**: Footer + dedicated section on /journey
- **C**: Footer + inline CTAs in blog posts + pop-up (more aggressive)

Recommendation: B — visible but not pushy. Matches building-in-public ethos.

### 3. /playbook Timing

Options:
- **A**: Include in nav now, show "Coming Soon" page
- **B**: Omit from nav until content ready
- **C**: Include in nav, gate behind email signup

Recommendation: B for initial launch. Add when there's something to show.

### 4. pmorgan.tech Relationship

The developer site (pmorgan.tech) is separate but linked. Questions:
- Should /get-involved live on pipermorgan.ai or just redirect to pmorgan.tech?
- How much contributor content lives on consumer site vs. developer site?

Recommendation: Light /get-involved page on pipermorgan.ai that explains the opportunity and links out. Detailed setup/contribution docs stay on pmorgan.tech.

---

## Next Steps

1. **PM decision** on open questions
2. **Comms** develops copy for new pages
3. **CXO** reviews copy for UX/tone alignment
4. **Implementation planning** — what can be done with existing site infrastructure vs. what needs new build

---

*This is an IA sketch, not a final specification. Expect iteration.*
