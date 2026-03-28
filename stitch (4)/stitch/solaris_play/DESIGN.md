# Design System Specification: The Tactile Joy Protocol

## 1. Overview & Creative North Star: "The Animated Sanctuary"
This design system rejects the clinical coldness of modern SaaS. Our Creative North Star is **The Animated Sanctuary**. We are building a space that feels like a physical, handcrafted toy—tactile, responsive, and deeply forgiving. 

To break the "template" look, we abandon rigid, thin-lined grids in favor of **Intentional Asymmetry** and **Soft Volume**. Layouts should feel like they are "inflated" rather than drawn. We use massive typography scales to create an editorial hierarchy that guides the user’s eye with the confidence of a premium magazine, while the rounded corners and vibrant palette maintain a sense of childlike wonder.

---

## 2. Colors: Tonal Energy & The "No-Line" Rule
Our palette is anchored by the energetic `primary` orange (#9D4F00 / #F28C38) and the calming `secondary` teal (#007169). 

*   **The "No-Line" Rule:** 1px solid borders are strictly prohibited for structural sectioning. To separate content, use background shifts. For example, a `surface-container-low` (#FDF9F2) hero section should sit directly against a `surface` (#FFFBFF) body without a stroke.
*   **Surface Hierarchy & Nesting:** Treat the UI as stacked sheets of soft cardstock.
    *   **Level 0:** `surface-container-lowest` (#FFFFFF) for the most prominent interactive cards.
    *   **Level 1:** `surface` (#FFFBFF) for general page backgrounds.
    *   **Level 2:** `surface-container` (#F7F3EC) for nested grouped content.
*   **The "Glass & Gradient" Rule:** To avoid a flat "vector" look, use a subtle linear gradient on main CTAs: `primary_container` (#FC943F) at the top transitioning to `primary` (#9D4F00) at the bottom. For floating navigation or overlays, apply `surface_bright` at 80% opacity with a `backdrop-blur` of 12px.
*   **Signature Textures:** Use the `tertiary_fixed` (#FDC003) as an accent "spark" for rewards or highlights, ensuring it never competes with the primary action.

---

## 3. Typography: The Friendly Authority
We use **Plus Jakarta Sans** exclusively. Its geometric yet organic curves provide the "friendly professional" tone we require.

*   **Display & Headline (The Vocalist):** Use `display-lg` (3.5rem) and `headline-lg` (2rem) with tight letter-spacing (-0.02em). These should feel "heavy" and present, acting as the supportive voice of the interface.
*   **Body (The Guide):** `body-lg` (1rem) is our workhorse. Ensure a generous line-height (1.6) to reduce cognitive load and anxiety.
*   **Label (The Detail):** Use `label-md` in all-caps with increased letter-spacing (+0.05em) when used for category tags to provide an editorial contrast to the rounded headers.

---

## 4. Elevation & Depth: Tactile Volume
In this system, depth is not an illusion of light; it is an illusion of **mass**.

*   **The Layering Principle:** Avoid drop shadows for standard cards. Instead, use a 2px offset "block shadow"—a solid fill of `outline_variant` (#BCB9B3) placed behind the container to simulate a physical button or tile.
*   **Ambient Shadows:** If a floating element (like a modal) requires a shadow, use a large blur (32px) at 6% opacity using a tint of `on_surface` (#393834). It should feel like a soft glow, not a dark pit.
*   **The "Ghost Border" Fallback:** If a container requires definition against a similar background, use a 2px stroke of `outline_variant` at 15% opacity. Never use 100% opaque strokes.
*   **Glassmorphism:** Use for "Success" or "Level Up" overlays. A teal `secondary_container` at 70% opacity with heavy blur creates a celebratory, immersive depth.

---

## 5. Components: Pressable Primitives

### Buttons
Buttons are the soul of this system. They must feel "clicky."
*   **Primary:** `primary_container` background with a 4px bottom border (block shadow) of `primary`. On hover, the button shifts down 2px. On active, it shifts down 4px (flattening the shadow).
*   **Shape:** Always use `rounded-md` (1.5rem) or `rounded-full`.
*   **Padding:** Use Spacing `6` (2rem) for horizontal and `3` (1rem) for vertical.

### Cards & Lists
*   **Forbid Dividers:** Do not use lines to separate list items. Use Spacing `4` (1.4rem) of vertical whitespace and a `surface-container-low` background on every second item to create a rhythmic "zebra" stripe that feels intentional and soft.
*   **Cards:** Use `rounded-lg` (2rem) to emphasize the friendly, non-aggressive nature of the container.

### Input Fields
*   **State:** Default state uses `surface_container_highest` (#EBE8E0) with no border.
*   **Focus State:** Transitions to a 3px solid `primary_fixed` (#FC943F) border. The background remains light. This high-contrast change provides immediate clarity and encouragement.

### Progress Bars (Custom Component)
*   **Track:** `surface_container_highest`. 
*   **Indicator:** A thick, `secondary` (Teal) bar with a `rounded-full` cap. Add a subtle "shine" (a white 10% opacity gradient overlay) to make the progress feel like a physical liquid or gel.

---

## 6. Do's and Don'ts

### Do
*   **DO** use "Over-sized" icons. If an icon is next to a `headline-sm`, make the icon 1.5x the height of the text.
*   **DO** embrace white space. If you think there is enough space, add 20% more. This is the primary tool for reducing user anxiety.
*   **DO** use asymmetric layouts. Place a large character illustration or a headline slightly off-center to create a dynamic, "un-templated" feel.

### Don't
*   **DON'T** use pure black (#000000). Always use `on_surface` (#393834) for text to keep the vibe soft.
*   **DON'T** use sharp corners. The `none` and `sm` roundedness tokens are for internal logic only; user-facing containers must be at least `md`.
*   **DON'T** stack more than three levels of depth. Surface -> Container -> Card is the limit to maintain clarity.