```markdown
# Design System Strategy: The Supportive Path

## 1. Overview & Creative North Star
The Creative North Star for this design system is **"The Conversational Mentor."** 

Returning to society is a journey often fraught with cold, bureaucratic barriers. This design system intentionally dismantles the "institutional" look of government portals. Instead of rigid grids and high-contrast separators, we employ a high-end editorial approach characterized by **Organic Layering** and **Asymmetric Breathing Room.** 

The experience should feel like a guided conversation across a kitchen table, not a form being filled out in a waiting room. We achieve this through soft, overlapping surfaces, generous whitespace, and a departure from traditional "boxed" layouts in favor of fluid, flowing content zones.

---

### 2. Colors: Tonal Warmth & The "No-Line" Rule
The palette is designed to soothe and encourage. We avoid the "alert" reds and "sterile" blues of traditional software.

*   **Primary (`#9d4f00`) & Secondary (`#007164`):** These earth tones represent growth and stability. Use the `primary_container` (`#ffaf75`) for large, welcoming surfaces to avoid the visual "weight" of dark colors.
*   **The "No-Line" Rule:** To maintain a friendly, non-bureaucratic feel, **do not use 1px solid borders to define sections.** Boundaries must be created through background shifts. For example, a card using `surface_container_lowest` (#ffffff) should sit atop a `surface_container` (#f6f4ec) background.
*   **Surface Hierarchy & Nesting:** Treat the UI as physical layers. Use `surface_container_low` for the main page background and `surface_container_highest` for interactive elements that need to feel "closer" to the user.
*   **The Glass & Gradient Rule:** For a premium, custom feel, use `surface_tint` at 5-10% opacity with a `backdrop-blur` of 12px for floating navigation bars. Apply a subtle linear gradient from `primary` to `primary_container` on main action buttons to give them "soul" and dimension.

---

### 3. Typography: Clarity & Character
We utilize a pairing of **Plus Jakarta Sans** (Display/Headlines) and **Be Vietnam Pro** (Body/Titles). This pairing balances modern approachability with high-end legibility.

*   **Display & Headline (Plus Jakarta Sans):** These are the "voice" of the mentor. Use `display-md` (2.75rem) for welcome screens and `headline-lg` (2rem) for section headers. The generous x-height and open counters feel honest and clear.
*   **Body & Titles (Be Vietnam Pro):** Chosen for its exceptional readability at lower contrast. `body-lg` (1rem) is the standard for all conversational text—never go smaller for core content to ensure accessibility for all users.
*   **Hierarchy as Empathy:** Use large typography scales to reduce cognitive load. A single, large `headline-md` followed by a spacious `body-lg` creates a focused, one-on-one dialogue feel.

---

### 4. Elevation & Depth: Tonal Layering
Traditional shadows can feel "digital" and heavy. We use **Tonal Layering** to create a sense of touch and tangibility.

*   **The Layering Principle:** Instead of shadows, stack `surface_container_low` (#fcf9f3) on `surface` (#fffcf7). The subtle 2% shift in value creates a "soft lift" that feels premium and intentional.
*   **Ambient Shadows:** Where a floating element is required (like a Floating Action Button), use a shadow with a 24px blur and 6% opacity, tinted with the `on_surface` color (`#373831`). This mimics natural sunlight rather than a computer-generated drop shadow.
*   **The "Ghost Border" Fallback:** If an input requires a boundary, use the `outline_variant` (#babaaf) at **15% opacity**. It should be felt, not seen.
*   **Glassmorphism:** Use semi-transparent `surface_bright` with a blur effect for overlays. This keeps the user grounded in their current context by allowing the colors of the previous screen to bleed through.

---

### 5. Components: Friendly & Tactile
Every element is designed with a "Large Touch Target" philosophy (minimum 56px height for interactive elements).

*   **Buttons:**
    *   **Primary:** Uses `primary` color with `xl` (3rem) rounded corners. Padding should be `spacing-4` (1.4rem) on the sides to feel substantial.
    *   **Secondary:** Use `secondary_container` with `on_secondary_container` text. This provides a soft, "pill-like" look that is inviting to tap.
*   **Input Fields:** Avoid the "box." Use `surface_container_highest` with a bottom-only `surface_tint` accent (2px). Labels should use `title-sm` to feel like a direct question from a friend.
*   **Cards:** Never use borders. Use `surface_container_lowest` (#ffffff) with `md` (1.5rem) or `lg` (2rem) corner radii. 
*   **The Mascot Integration:** Simple vector characters should appear in `surface_container` modules, partially overlapping the edge of the container to break the "square" layout and add a sense of playfulness.
*   **Forbid Dividers:** Do not use horizontal rules (`<hr>`). Use `spacing-8` (2.75rem) or a subtle change in surface color to separate content blocks.

---

### 6. Do’s and Don’ts

#### **Do:**
*   **Do** use asymmetrical layouts. Place a character on the left and a text bubble on the right with different vertical alignments.
*   **Do** use "Conversational Spacing." If a user finishes a task, give them a `spacing-12` (4rem) gap before the next section to let the achievement breathe.
*   **Do** use `rounded-xl` (3rem) for any element that the user needs to touch.

#### **Don’t:**
*   **Don’t** use pure black (#000000) for text. Use `on_surface` (#373831) to keep the tone warm and soft.
*   **Don’t** use "Click Here" or "Submit." Use friendly, active phrases like "Let's move forward" or "Tell us more."
*   **Don’t** cram multiple actions onto one screen. If the process is complex, break it into a "stepper" where each step is a full-screen, focused conversation.
*   **Don’t** use high-contrast, 100% opaque borders. They create visual "noise" and feel like an official document.

---

### 7. Signature Elements
*   **The Guided Transition:** When moving between screens, use a soft "fade and slide" motion.
*   **Tactile Feedback:** Buttons should visually "depress" (scale to 0.98) when pressed, reinforcing the feeling of a physical, friendly tool.
*   **Organic Shapes:** Use the `secondary_fixed` (#97f7e4) color as a large, blurry background "blob" behind the mascot to add depth without adding structural complexity.```