/* Fetch the Google rating + latest reviews into data/reviews.json.
 *
 * WHY THIS RUNS IN CI AND NOT IN THE BROWSER
 * A Places API key sent from the page is readable by anyone who opens devtools,
 * and it is billed to us. So the key stays a repo secret, this runs on a
 * schedule, and the site ships a plain JSON file it can serve statically.
 *
 * CACHING: Google's Places policy forbids caching most place fields beyond 30
 * days. Running daily keeps us well inside that.
 *
 * FILTERING: by default NOTHING is filtered — whatever Google returns is what
 * the site shows, alongside the true overall rating. Set the repo variable
 * MIN_RATING (e.g. 4) to feature only higher-rated reviews. Read the note in
 * the workflow before you do: the aggregate rating is always shown either way,
 * so nothing is concealed, but displaying a filtered subset of Places data is
 * less clearly within Google's terms than displaying it whole.
 *
 * The Places API returns at most 5 reviews and does not let us choose which.
 */
import { writeFileSync, readFileSync, existsSync } from "node:fs";

const KEY = process.env.GOOGLE_PLACES_API_KEY;
const PLACE_ID = process.env.PLACE_ID || "ChIJgwhbtuMXrjsRKPKZ0trYYL8";
const MIN_RATING = Number(process.env.MIN_RATING || 0);
const OUT = "data/reviews.json";

if (!KEY) {
  console.error("GOOGLE_PLACES_API_KEY is not set — refusing to overwrite " + OUT);
  process.exit(1);
}

const url = `https://places.googleapis.com/v1/places/${encodeURIComponent(PLACE_ID)}?languageCode=en`;
const res = await fetch(url, {
  headers: {
    "X-Goog-Api-Key": KEY,
    "X-Goog-FieldMask": "id,displayName,rating,userRatingCount,googleMapsUri,reviews",
  },
});

if (!res.ok) {
  console.error(`Places API ${res.status}: ${await res.text()}`);
  process.exit(1);
}
const j = await res.json();

const reviews = (j.reviews || [])
  .filter((r) => typeof r.rating === "number" && r.rating >= MIN_RATING)
  .map((r) => ({
    rating: r.rating,
    text: (r.text && r.text.text ? r.text.text : "").trim(),
    author: (r.authorAttribution && r.authorAttribution.displayName) || "A Google user",
    authorUri: (r.authorAttribution && r.authorAttribution.uri) || "",
    photo: (r.authorAttribution && r.authorAttribution.photoUri) || "",
    when: r.relativePublishTimeDescription || "",
    publishTime: r.publishTime || "",
  }))
  .filter((r) => r.text.length > 0);

const out = {
  fetched: new Date().toISOString(),
  rating: typeof j.rating === "number" ? j.rating : null,
  count: typeof j.userRatingCount === "number" ? j.userRatingCount : null,
  mapsUri: j.googleMapsUri || "",
  minRating: MIN_RATING,
  reviews,
};

/* Don't let a bad day wipe a good file: if Google returns nothing usable but we
   already have reviews on disk, keep what we have and fail loudly instead. */
if (reviews.length === 0 && existsSync(OUT)) {
  const prev = JSON.parse(readFileSync(OUT, "utf8"));
  if ((prev.reviews || []).length > 0) {
    console.error("Places returned 0 usable reviews but " + OUT + " has " + prev.reviews.length + " — keeping the existing file.");
    process.exit(1);
  }
}

writeFileSync(OUT, JSON.stringify(out, null, 2) + "\n");
console.log(`Wrote ${OUT}: rating ${out.rating} from ${out.count} ratings, ${reviews.length} review(s).`);
