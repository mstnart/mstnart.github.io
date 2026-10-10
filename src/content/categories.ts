import type { CategoryId } from "@/lib/types";

export interface Category {
  id: CategoryId;
  label: string;
  /** Two-letter code used in the archive index. */
  code: string;
  blurb: string;
}

/** Order here = order of the filters and the home page entry points. */
export const categories: Category[] = [
  {
    id: "motion-video",
    label: "Motion & Video",
    code: "MV",
    blurb: "Edits, motion graphics and animated type",
  },
  {
    id: "graphic-design",
    label: "Graphic Design",
    code: "GD",
    blurb: "Posters, layouts and visual systems",
  },
  {
    id: "campaigns",
    label: "Campaigns",
    code: "CA",
    blurb: "Ad creative and campaign key visuals",
  },
  {
    id: "product-visualization",
    label: "Product Visualization",
    code: "PV",
    blurb: "Mockups, 3D staging and product light",
  },
  {
    id: "ecommerce",
    label: "E-commerce",
    code: "EC",
    blurb: "Listing imagery for Etsy, Amazon and POD",
  },
  {
    id: "experiments",
    label: "Experiments",
    code: "EX",
    blurb: "Blender, AI and self-initiated studies",
  },
];

export const categoryById = Object.fromEntries(
  categories.map((c) => [c.id, c]),
) as Record<CategoryId, Category>;
