import desserts from "@/assets/food/desserts.jpg";
import patties from "@/assets/food/patties.jpg";
import pizza from "@/assets/food/pizza.jpg";
import sandwich from "@/assets/food/sandwich.jpg";
import maggie from "@/assets/food/maggie.jpg";
import tea from "@/assets/food/tea.jpg";
import beverages from "@/assets/food/beverages.jpg";
import mojito from "@/assets/food/mojito.jpg";
import pastries from "@/assets/food/pastries.jpg";
import cake from "@/assets/food/cake.jpg";
import burger from "@/assets/food/burger.jpg";
import fries from "@/assets/food/fries.jpg";
import momos from "@/assets/food/momos.jpg";
import d_nutella from "@/assets/food/d-nutella.jpg";
import d_triple from "@/assets/food/d-triple.jpg";
import d_gems from "@/assets/food/d-gems.jpg";
import d_heart from "@/assets/food/d-heart.jpg";
import d_kitkat from "@/assets/food/d-kitkat.jpg";
import d_dark from "@/assets/food/d-dark.jpg";
import d_oreo from "@/assets/food/d-oreo.jpg";
import d_darkmilk from "@/assets/food/d-darkmilk.jpg";
import d_darkwhite from "@/assets/food/d-darkwhite.jpg";
import d_sprinkle from "@/assets/food/d-sprinkle.jpg";
import d_milk from "@/assets/food/d-milk.jpg";

const map: Record<string, string> = {
  desserts,
  patties,
  quickbites: patties,
  pizza,
  sandwich,
  maggie,
  tea,
  beverages,
  mojito,
  pastries,
  "d-nutella": d_nutella,
  "d-triple": d_triple,
  "d-gems": d_gems,
  "d-heart": d_heart,
  "d-kitkat": d_kitkat,
  "d-dark": d_dark,
  "d-oreo": d_oreo,
  "d-darkmilk": d_darkmilk,
  "d-darkwhite": d_darkwhite,
  "d-sprinkle": d_sprinkle,
  "d-milk": d_milk,
  cake,
  burger,
  fries,
  momos,
};

/** image_key from the database → bundled photo; URLs pass through unchanged. */
export function foodImage(key?: string | null) {
  if (!key) return desserts;
  if (key.startsWith("http")) return key;
  return map[key] ?? desserts;
}
export const imageKeys = Object.keys(map);
