/**
 * SITE SETTINGS: edit freely.
 * Text, contact details, CV data and social links for the whole site.
 * Career data comes from Burak-Mestan-CV.pdf (October 2026 version).
 */

export const site = {
  name: "Burak Mestan",
  firstName: "Burak",
  /** Short line used in titles and search results. */
  role: "Video editor & graphic designer",
  description:
    "Burak Mestan is a video editor and graphic designer in Antalya: brand films, social content, gaming videos and 3D/VFX work.",

  /** One sentence under the big greeting on the home page. */
  intro:
    "I'm a video editor and graphic designer in Antalya. I make brand films, social content, gaming videos and 3D work in Blender.",

  photo: "/media/images/profile.jpg",
  /** The CV people can download. Replace the file to update it. */
  cv: "/media/other/burak-mestan-cv.pdf",

  /** Home page highlight video (muted loop) and where "Watch full showreel" goes. */
  reel: {
    video: "/media/videos/highlights-loop.mp4",
    poster: "/media/posters/highlights-loop.jpg",
    link: "/work/showreel-2022",
  },

  email: "bmestanbusiness@gmail.com",
  location: "Antalya, Türkiye",
  availability: "Open to full-time roles and freelance projects",

  /**
   * SOCIAL LINKS
   * Paste full URLs. Links with an empty url are hidden automatically.
   */
  socials: [
    { label: "YouTube", url: "https://www.youtube.com/@soraa2509" },
    { label: "Instagram", url: "" },
    { label: "Behance", url: "" },
    { label: "LinkedIn", url: "" },
  ],

  /** From the CV's "About me". */
  about:
    "I am a video editor with a strong passion for visual storytelling and creative production. My main background is in gaming video production, where I developed strong skills in editing, timing, visual effects and scene composition. I am now expanding into graphic design and visual communication while continuing to build on my video production experience.",

  /**
   * CAREER TIMELINE (oldest first). `type` picks the icon: "work" or "school".
   * `points` are short lines shown under each entry.
   */
  /** Year that "now" means in the timeline chart. Update once a year. */
  timelineUntil: 2026,
  timeline: [
    {
      type: "work",
      years: "2017 – 2020",
      title: "Video Editor & Creative Content Creator",
      place: "Freelance",
      points: [
        "Created and edited gaming videos from concept to final delivery.",
        "Managed virtual camera movements, scene composition and visual storytelling.",
        "Built visual effects, motion graphics and post-production in Sony Vegas Pro and After Effects.",
      ],
      /** Optional archive image shown under the entry. */
      archive: {
        src: "/media/images/archive/ae-2017-csgo-dof.jpg",
        alt: "After Effects CC 2017 project for a CS:GO edit: a composition with a depth pass, glow passes and adjustment layers in the timeline.",
        caption: "After Effects, May 2017 — a CS:GO edit: depth-of-field from a separate depth pass, glow passes added on top, seven adjustment layers.",
        source: "https://x.com/akaSoraa/status/869966398495260672",
      },
    },
    {
      type: "school",
      years: "2018 – 2022",
      title: "Computer Programming",
      place: "Istanbul Gelişim University",
      points: ["Associate degree · Graduated"],
    },
    {
      type: "work",
      years: "2020 – 2025",
      title: "Gaming Industry Specialist",
      place: "OdinBoost",
      points: [
        "Managed customer interactions and online operations in a fast-paced gaming environment.",
        "Worked with gaming-related digital content and customer requirements.",
      ],
    },
    {
      type: "work",
      years: "2025 – 2026",
      title: "Graphic Designer & Digital Content Creator",
      place: "Zonkraft",
      points: [
        "Created product designs and commercial visuals for print-on-demand e-commerce.",
        "Developed product visuals and advertising creatives with Illustrator, Photoshop and AI tools.",
      ],
    },
    {
      type: "school",
      years: "2025 – now",
      title: "International Relations",
      place: "Anadolu University",
      points: ["Open Education · Currently enrolled"],
    },
  ],

  expertise: [
    "Video editing",
    "Post-production",
    "Motion graphics",
    "Graphic design",
    "Visual effects",
    "3D design",
    "AI content creation",
    "Social media content",
  ],
  tools: ["Adobe After Effects", "Adobe Photoshop", "Adobe Illustrator", "Sony Vegas Pro", "Blender", "AI tools"],
  languages: [
    { name: "Turkish", level: "Native" },
    { name: "English", level: "B2" },
  ],
} as const;

export type SiteConfig = typeof site;
export type TimelineEntry = (typeof site.timeline)[number];
