# Product Requirements Document: Collaborative "Light a Diya"

*   **Version:** 1.0
*   **Date:** September 7, 2025
*   **Status:** Proposed

---

## 1. Introduction & Problem Statement

During festive seasons like Diwali, friends and families often wish to celebrate together but may be separated by distance. There is a need for a simple, heartwarming digital experience that allows groups to partake in the tradition of lighting diyas together, fostering a sense of connection and shared celebration in a virtual space.

## 2. Goals & Objectives

*   **Primary Goal:** To create an engaging and emotionally resonant experience that allows users to feel connected with loved ones through a shared, real-time activity.
*   **User Objectives:**
    *   Quickly create a private, shareable space for their group.
    *   Easily invite friends and family with a simple link.
    *   Participate by lighting a diya, whether logged in or anonymously.
    *   See the contributions of others instantly.
*   **Project Objectives:**
    *   Launch a stable and performant V1 of the application before the peak Diwali season.
    *   Ensure a low-friction user experience to maximize participation and sharing.

## 3. Target Audience

*   **The Social Host:** Users who want to initiate a group activity for their friends and family. They are comfortable with technology and are the ones likely to create and share the link.
*   **The Invited Participant:** Friends and family of the host, spanning a wide range of ages and technical abilities. The experience for them must be extremely intuitive and require minimal setup.

## 4. Features & User Stories

### Epic: Celebration Management
*   **US1 (Create):** As a logged-in user, I want to create a new "Celebration" with a custom name, so that I can have a personalized space for my group.
*   **US2 (Share):** As the host of a Celebration, I want to get a unique, shareable link, so that I can easily invite my friends and family.

### Epic: Diya Lighting Experience
*   **US3 (View):** As any user visiting a Celebration link, I want to see a beautiful arrangement of unlit and lit diyas, so I can understand the current state of the celebration.
*   **US4 (Real-time Updates):** As any user, I want to see a diya light up instantly when someone else lights it, without needing to refresh the page, so the experience feels live and collaborative.
*   **US5 (Identify Litters):** As any user, I want to see the name of the person who lit each diya, so I know who has participated.
*   **US6 (Count):** As any user, I want to see a running count of how many diyas have been lit in this Celebration, so I can see our collective progress.

### Epic: User Participation
*   **US7 (Authenticated Lighting):** As a user logged in with Google, I want to click an unlit diya to light it, and have it appear with my Google profile name.
*   **US8 (Anonymous Lighting):** As a user who is not logged in, I want to be prompted for a display name and then be able to light a diya, so I can participate without creating an account.

## 5. Design & UX Requirements

*   **Aesthetics:** The design should be warm, festive, and elegant. It should evoke a feeling of peace and celebration. Use a dark background to make the diyas' glow stand out.
*   **Interaction:** The core interaction of lighting a diya should be simple, satisfying, and immediate.
*   **Mobile-First:** The experience must be seamless and fully functional on mobile devices, as most sharing will happen via messaging apps.
*   **Accessibility:** Ensure sufficient color contrast and that interactive elements are clearly identifiable.

## 6. Out of Scope for V1

*   User accounts beyond Google login (e.g., email/password).
*   Customization of diya designs, colors, or layouts.
*   Sound effects or background music.
*   A public gallery of all celebrations.
*   Ability to un-light or change a lit diya.
