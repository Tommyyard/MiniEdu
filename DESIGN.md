# MiniEdu design direction

MiniEdu uses an editorial public site and a compact school portal. The public site may use photography and serif italic accents. Internal pages prioritize current data, navigation, and repeated tasks.

## Foundations

- Brand green: `--primary` and `--primary-foreground` in `app/globals.css`.
- Surfaces: `--background`, `--card`, `--surface-subtle`; borders use `--border` rather than decorative shadows.
- Feedback: `--success-bg`/`--success-fg` and `--error-bg`/`--error-fg`. Dark mode overrides semantic values.
- Radius: controls use `--radius-control` (10px); panels use `--radius-panel` (14px).
- Portal width: `--content-width` (1480px), with 24px desktop and 16px mobile side gutters.
- Typography: sans serif for application copy and numbers; serif italic is reserved for public editorial headings. Portal headings use a short, left-aligned hierarchy.

## Patterns

- The role dashboard starts with a compact welcome, real database counts, role-specific shortcuts, and recent announcements.
- Operational pages use a page heading, filters and actions in separate groups, a result count, a bordered table, and a distinct empty state.
- Forms show visible labels, field-level errors, keyboard focus, and clear save/cancel actions.
- Navigation remains a top bar because the current menu is small enough to scan. On narrow screens, the link row scrolls horizontally.
- Avoid ornamental metric cards, numbered decorative steps, repeated symbols, and motion that does not explain an interaction.

The existing color identity and school photography are intentional. A scanner may flag dark surface colors or a limited serif accent without understanding their role in the design.

## Public home and Admin visual references

The public home takes the clear section order, restrained navigation, and serif heading hierarchy from the supplied SMA AFBS screenshot. Cards and announcements take the title, summary, date, and action structure from the supplied SMA Negeri 1 Pemenang screenshot. The screenshots remain outside the repository.

- Public content uses off-white surroundings, white institutional sections, a single existing school illustration, and complete serif headings. Login-only information stays behind the existing login flow.
- The Admin overview uses the same green palette with six existing database counts, grouped academic tasks, and recent announcement summaries. Attendance counts are explicitly labeled as covering all periods.
- These styles live in `app/home-redesign.css` and apply only to `.school-home` and `.admin-overview` components. Shared portal styles, Teacher/Student dashboards, and Developer mode are preserved.
- No claims about accreditation, school leadership, achievements, contact details, or programs are added without actual source data.
