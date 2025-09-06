# Design Brief: User Interface for "light-a-diya"

## 1. Project Overview

*   **Project Name:** `light-a-diya`
*   **Core Concept:** A real-time, collaborative web application that allows friends and family to light virtual diyas together in a shared, private space. The goal is to foster connection and a sense of shared celebration for users who may be physically apart during festive seasons like Diwali.
*   **Target Audience:** A wide range of users, from tech-savvy young adults to older family members who may be less comfortable with technology. The design must be extremely intuitive and inviting.

## 2. Core Design Pillars (The Vibe)

The entire user interface should be guided by these three principles:

1.  **Warm & Inviting:** The design must feel cozy, festive, and emotionally resonant. It should evoke the feeling of a calm, celebratory evening. The primary visual element is the warm glow of the diya flames.
2.  **Elegant & Serene:** The interface should be clean, uncluttered, and minimalist. It should feel more like a spiritual or meditative experience than a typical "tech" app. Avoid loud colors, sharp edges, and busy layouts.
3.  **Modern & Intuitive:** The user experience must be frictionless. Interactions should be obvious, and the journey from landing on the page to lighting a diya should be as simple as possible. The design must be mobile-first.

## 3. Detailed Design System

### A. Color Palette
*   **Primary Background:** A very dark, deep midnight blue or a dark charcoal grey with a hint of warmth (`#1A1A2E`, `#2D2D2D`). This is crucial to make the light from the diyas the focal point.
*   **Primary Text/UI Elements:** A soft, off-white (`#F5F5F5`) for readability. Avoid pure white.
*   **Primary Accent (for CTAs, highlights):** A rich, warm gold or saffron color (`#FFC107`, `#E8A317`). This should be used for primary buttons and important interactive elements.
*   **Secondary Accent (Flame Colors):** A gradient of warm colors for the diya flames, ranging from a bright yellow core to a deep orange and hints of red (`#FFEB3B` -> `#FFA000` -> `#D32F2F`).
*   **Subtle Background Elements:** Incorporate very subtle, out-of-focus background elements like a hint of a rangoli pattern or bokeh light effects, using muted festive colors (deep reds, greens, blues).

### B. Typography
*   **Headings Font:** A graceful Serif font that feels both traditional and elegant. **Examples: `Lora`, `Playfair Display`, or `Cormorant Garamond`**. Used for celebration titles and major headings.
*   **Body/UI Font:** A clean, highly readable Sans-Serif font. **Examples: `Inter`, `Poppins`, or `Lato`**. Used for all buttons, labels, and descriptive text.
*   **Font Weights:** Use a limited range of weights (e.g., Regular for body, Medium for buttons, Bold for headings) to maintain a clean look.

### C. Lighting & Effects
*   **Glow Effect:** The most important effect. Lit diyas must cast a soft, warm, ambient glow on the surface beneath them. The flame itself should have a subtle, animated flicker.
*   **Glassmorphism/Frosted Glass:** Use this effect for modals and overlays. The background behind the modal should be blurred and darkened to bring focus to the foreground content.
*   **Shadows:** Use glowing shadows (in the accent gold/orange color) for interactive elements on hover, rather than dark, harsh shadows.

### D. Iconography
*   Use a minimalist, line-art icon set. **Example: `Feather Icons` or similar**. Icons for "Share," "Logout," "Create," etc., should be simple and universally understood.

### E. Components
*   **Buttons:** Softly rounded corners. Primary buttons should have a solid gold background. Secondary buttons can be outlined with gold text. On hover, they should have a subtle glow or slightly increase in size.
*   **Input Fields:** Minimalist design. A simple line or a very light background, with the gold accent color used for the focus state.
*   **Diyas:** The star of the show.
    *   **Unlit State:** A beautifully illustrated but darkened, uncolored terracotta or clay diya. It should look invitingly clickable.
    *   **Lit State:** The diya becomes subtly colored, the flame appears with a beautiful flickering animation, and it casts a soft glow. The name of the person who lit it (`Lit by Priya`) appears below it in a small, elegant font.

## 4. Screen-by-Screen Design Breakdown

Generate high-fidelity mockups for the following screens in **both mobile and desktop views**.

### Screen 1: The Home Page (Unauthenticated)
*   **Layout:** Centered, single-column layout.
*   **Hero Element:** A large, beautiful, high-quality image or illustration of a single lit diya in the center of the screen.
*   **Text:** The app name `light-a-diya` above the hero image, and a simple, heartfelt tagline below it (e.g., "Celebrate together, no matter the distance.").
*   **Call to Action:** A single, prominent primary button (gold accent) that says **"Login with Google to Begin"**.

### Screen 2: The Home Page (Authenticated)
*   **Layout:** Similar to the unauthenticated page, but with more options.
*   **Header:** A welcome message, e.g., "Welcome back, [User Name]!".
*   **Primary Action:** A primary button that now says **"Create a New Celebration"**.
*   **Secondary Content:** (If applicable) A simple list of "Your Past Celebrations" that the user can click to revisit.

### Screen 3: The Celebration Page (The Main Experience)
*   **Header:** The custom name of the celebration is displayed prominently at the top (e.g., "Sharma Family Diwali 2025").
*   **Main Content:** A grid of 10 diyas arranged in a visually pleasing, slightly organic pattern (not a rigid square grid).
*   **Key Information:** A subtle text element showing the count, e.g., **"7 / 10 Diyas Lit"**.
*   **Interactive Elements:**
    *   Unlit diyas should subtly glow or scale up on hover to indicate they are clickable.
    *   Lit diyas should display the name of the person who lit them.
*   **Actions:** A prominent but clean "Share" icon/button that allows the host to copy the link. A "Logout" or "Home" button should be available.

### Screen 4: Modals
*   **"Create Celebration" Modal:**
    *   Appears over the home page with a frosted glass effect.
    *   A single text input field labeled "Celebration Name".
    *   A primary "Create & Go" button.
*   **"Enter Your Name" Modal (for Anonymous Users):**
    *   Appears over the Celebration page.
    *   A single text input field labeled "Enter a display name".
    *   A primary "Light My Diya" button.

## 5. Micro-interactions & Animations
*   **Page Transitions:** Gentle fade transitions between pages.
*   **Diya Lighting:** A smooth, gentle animation. The flame should not just "appear" but fade in and grow over half a second, with the glow expanding softly.
*   **Button Hovers:** A subtle glow or scale effect.

## 6. Final Deliverables
*   High-fidelity mockups for all 4 specified screens (both mobile and desktop).
*   A style guide summary sheet showing the color palette, typography, and iconography.
*   A component library sheet showing the different states of buttons, input fields, and the diya itself.
