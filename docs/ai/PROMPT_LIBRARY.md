# Prompt Library (Copilot Chat)

## Prompt template
Context:
- We are building CineLog (React+TS+Tailwind+shadcn).
- Follow docs/ai/CONTEXT.md and PRD requirements.

Output format:
- Ask 1–3 clarifying questions first if needed.
- Then: file list to create/edit, steps, and acceptance checklist.
- No full implementation unless I request after trying.

---

## (1) Homepage Entrance skeleton
Task:
Create the guest homepage route `/` as a “video rental entrance” screen.
Needs: header, central EntranceCard with primary CTA “Enter the store”, secondary CTA “Create session”, and two toggles (Sound off by default, Reduce motion).

---

## (2) Browse Corridors snap navigation
Task:
Implement `/browse` with 4 corridor sections that snap horizontally.
Use Tailwind scroll snap (snap-x + snap-mandatory) and ensure each corridor child has snap alignment.

---

## (3) Shelf row carousel (shadcn)
Task:
Add a “shelf carousel” component using shadcn/ui Carousel.
Provide responsive basis sizes (mobile 2 items, desktop 5–6), and skeleton state.
