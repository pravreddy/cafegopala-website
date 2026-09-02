# `data/`

Two files, two owners. Keeping them apart is the whole point.

| file | written by | in git? |
| --- | --- | --- |
| `reviews.json` | the **server**, nightly | **no** — gitignored |
| `reviews-fallback.json` | **you**, occasionally | yes |

## `reviews.json` — the live one

Written every night at 03:17 (server time) into
`/home/deploy/careai/sites/cafegopala.in/data/` by the `cafegopala-reviews` cron
job, which lives in the **avyangah-infra** repo under `jobs/cafegopala-reviews/`.
It holds the current Google rating, rating count and latest reviews.

It is **gitignored on purpose**. If it were committed, the site deploy would
upload it and overwrite the server's fresh copy with a stale one every push.
That bug has already happened once — please don't reintroduce it.

## `reviews-fallback.json` — the safety net

Shipped by the deploy. The pages read `reviews.json` first and only use this if
the live file is missing or empty — a rebuilt server, a wiped site directory, or
before the first cron run. In normal operation it is never read.

Refresh it whenever you are committing anyway:

```sh
curl -s https://cafegopala.in/data/reviews.json > data/reviews-fallback.json
```

It goes stale by design. That is acceptable here because the rating moves slowly
(4.6 from 235 → 4.6 from 250 over months), but don't let it drift for years — a
visitor seeing it has no way to know it is a fallback.

## Who reads these

`pages/index.html` (the strip under the Prabhupada quotes) and
`pages/reviews.html` (the card grid). Both hide their section entirely if neither
file is usable, so a total failure degrades to nothing visible rather than to an
empty box.
