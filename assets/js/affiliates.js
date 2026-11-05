/* ==========================================================================
   CompareAI — YOUR AFFILIATE LINKS
   --------------------------------------------------------------------------
   This is the only file you need to edit to start earning.

   1. Apply to a program (see monetize.html for the directory + apply links).
   2. When you're approved you get a tracking URL, e.g.
        https://jasper.ai/?fpr=yourid
        https://surfer.ai/?fp_ref=yourid
   3. Paste it below, save, reload. Every "Visit" button on the site now
      points at your link, and the affiliate disclosure stays accurate.

   Before you paste: strip nothing. Use the exact URL the network gave you.
   Sub-IDs / campaign parameters are supported on most networks, e.g.
        https://elevenlabs.io/?affiliate_id=abc&utm_content=voice-page
   ========================================================================== */

window.AFFILIATE_LINKS = {
  /* --- AI writing --- */
  jasper:      "",   // Jasper — 25–30% recurring, 12 months (Impact)
  writesonic:  "",   // Writesonic — 20% recurring, 12 months (FirstPromoter)
  surfer:      "",   // Surfer SEO — 75–125% first month / 15–25% annual
  grammarly:   "",   // Grammarly — fixed bounty, 90-day cookie
  copyai:      "",   // Copy.ai — terms unpublished, verify in PartnerStack
  rytr:        "",   // Rytr — confirm terms on application

  /* --- AI image --- */
  firefly:     "",   // Adobe Firefly — 85% first month (Partnerize)
  ideogram:    "",   // Ideogram — up to $417/sale, apply-gated
  midjourney:  "",   // no program — leave empty
  canva:       "",   // closed to new applicants
  leonardo:    "",   // program closed April 2026

  /* --- AI video --- */
  synthesia:   "",   // Synthesia — 25% recurring, 12 months, 90-day cookie
  heygen:      "",   // HeyGen — 20% recurring, 12 months, 30-day cookie
  invideo:     "",   // InVideo — reported ~50% first month, confirm
  veed:        "",   // VEED — 30% for 12 months
  descript:    "",   // Descript — ~15% per sale, confirm
  opusclip:    "",   // Opus Clip — confirm current terms

  /* --- AI voice --- */
  elevenlabs:  "",   // ElevenLabs — 22% for 12 months (PartnerStack)
  murf:        "",   // Murf — 20% recurring, 24 months
  playht:      "",   // PlayHT — not publicly documented
  cartesia:    "",   // no program — leave empty

  /* --- AI coding --- */
  copilot:     "",   // no program — leave empty
  cursor:      "",   // no cash program — leave empty
  windsurf:    "",   // reported 20% recurring, confirm
  tabnine:     "",   // Tabnine — 20% recurring, 12 months
  coderabbit:  "",   // CodeRabbit — $30 per qualified lead (Dub)
  claude:      "",   // no program — leave empty

  /* --- AI SEO / visibility analytics --- */
  semrush:     "",   // Semrush — $100–$450/sale, 120-day cookie (Impact)
  seranking:   "https://seranking.com/?ga=5334938&source=link",   // SE Ranking — 30% recurring, 120-day cookie
  frase:       "",   // Frase — 30% recurring, 12 months, 60-day cookie
  ahrefs:      "",   // no public program — leave empty
  otterly:     ""    // no program — leave empty
};

/* Where a button goes when no affiliate link is configured yet.
   A click always lands somewhere useful instead of dead-ending. */
window.AFFILIATE_FALLBACK = "vendor"; // "vendor" = official site, "program" = apply page
