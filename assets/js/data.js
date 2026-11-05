/* ==========================================================================
   CompareAI — tool dataset
   Single source of truth for search, the compare tray, calculators and the
   affiliate directory on monetize.html.

   price     : display string for the entry paid plan
   priceNum  : monthly USD number used for sorting / calculators (null = N/A)
   affiliate : program metadata
     status  : "open"   confirmed public program, accepting applications
               "verify" program exists but terms/page could not be confirmed
               "closed" program discontinued / not accepting applications
               "none"   no known program
     pct / months / avgPrice : used by the earnings calculator (percent deals)
     flat                    : used instead of pct for fixed-bounty deals
   Pricing and program terms verified Nov 2026. Always re-check the vendor page.
   ========================================================================== */

window.TOOLS = [
  /* ------------------------------- WRITING ------------------------------- */
  {
    slug: "jasper", name: "Jasper", category: "writing", categoryLabel: "AI Writing",
    tagline: "Brand-trained copy for marketing teams",
    price: "$69/mo", priceNum: 69, planLabel: "Pro, per seat",
    trial: "7-day free trial", rating: 4.5,
    bestFor: "Marketing teams that need every draft on-brand",
    highlights: ["Brand voice + knowledge assets", "Campaign workflows", "GEO / AI-search agents"],
    pros: ["Best brand-voice controls in the category", "Strong campaign and workflow tooling", "Clean output for long-form marketing copy"],
    cons: ["Entry price is high for solo writers", "Credit system on business plans is hard to forecast", "7-day trial is short"],
    verdict: "The pick when output has to sound like your company, not like an AI. Overkill — and overpriced — for a solo blogger.",
    page: "writing-tools.html",
    affiliate: { program: "Jasper Affiliate", status: "open", commission: "25% recurring, 12 months (30% after 100 sales)", cookie: "45 days", network: "Impact", pct: 25, months: 12, avgPrice: 59, url: "https://www.jasper.ai/partners", verified: false }
  },
  {
    slug: "writesonic", name: "Writesonic", category: "writing", categoryLabel: "AI Writing",
    tagline: "SEO + AI-visibility content in one place",
    price: "$99/mo", priceNum: 99, planLabel: "Starter, monthly",
    trial: "Free trial, no card", rating: 4.3,
    bestFor: "Content teams chasing visibility in Google and AI answers",
    highlights: ["AI visibility tracking", "15 AI articles / mo", "Site audits + auto-fixes"],
    pros: ["Combines content creation with AI-search tracking", "Generous article volume on entry plan", "20% recurring affiliate for 12 months"],
    cons: ["Entry plan costs more than pure writing tools", "No permanent free tier", "Interface does a lot at once"],
    verdict: "The most complete 'write it and check whether AI cites it' package. Buy it for the visibility data, not the prose alone.",
    page: "writing-tools.html",
    affiliate: { program: "Writesonic Affiliate", status: "open", commission: "20% recurring, 12 months", cookie: "60 days", network: "FirstPromoter", pct: 20, months: 12, avgPrice: 79, url: "https://affiliates.writesonic.com/signup/36620", verified: true }
  },
  {
    slug: "surfer", name: "Surfer SEO", category: "writing", categoryLabel: "SEO Writing",
    tagline: "Data-backed briefs and on-page scoring",
    price: "$59/mo", priceNum: 59, planLabel: "Discovery, monthly",
    trial: "7-day money-back", rating: 4.4,
    bestFor: "Writers who need to rank, not just publish",
    highlights: ["SERP-driven content briefs", "Real-time on-page score", "AI visibility tracker"],
    pros: ["Briefs are genuinely actionable", "Content editor keeps writers honest", "High-ticket affiliate: 75–125% first-month CPA"],
    cons: ["Expensive relative to a writing assistant", "Can encourage over-optimisation", "Document caps, not word caps"],
    verdict: "Not a copywriter — an optimisation layer. Pair it with one and the output ranks noticeably more often.",
    page: "writing-tools.html",
    affiliate: { program: "Surfer Affiliate", status: "open", commission: "75–125% of first month (tiered), 15–25% on annual", cookie: "60 days", network: "PartnerStack", pct: 25, months: 12, avgPrice: 99, url: "https://surfer.ai/affiliate-program/", verified: true }
  },
  {
    slug: "grammarly", name: "Grammarly", category: "writing", categoryLabel: "Writing Assistant",
    tagline: "The proofreader almost everyone already trusts",
    price: "$12/mo", priceNum: 12, planLabel: "Pro, monthly",
    trial: "Free plan", rating: 4.6,
    bestFor: "Anyone who writes email, docs and reports daily",
    highlights: ["Grammar + tone in every app", "Generative rewrite tools", "90-day cookie"],
    pros: ["Highest conversion rate of any writing tool", "Works everywhere via browser extension", "Free tier makes the pitch easy"],
    cons: ["Commission is a fixed bounty, not a percentage", "Not a long-form content generator", "Premium upsell can feel naggy"],
    verdict: "The easiest recommendation on this page: low price, obvious value, and a 90-day cookie that converts.",
    page: "writing-tools.html",
    affiliate: { program: "Grammarly Affiliates", status: "open", commission: "Fixed bounty per sale (tiered, bonuses for volume)", cookie: "90 days", network: "In-house", pct: null, months: 1, avgPrice: 12, url: "https://www.grammarly.com/affiliates", verified: true }
  },
  {
    slug: "copyai", name: "Copy.ai", category: "writing", categoryLabel: "GTM AI",
    tagline: "Workflow automation for go-to-market teams",
    price: "$29/mo", priceNum: 29, planLabel: "Chat, monthly (5 seats)",
    trial: "Free plan", rating: 4.0,
    bestFor: "RevOps and GTM teams automating repetitive writing",
    highlights: ["5 seats on entry plan", "Multi-model chat", "Workflow + agent builder"],
    pros: ["Cheapest per-seat option for small teams", "Workflows go beyond single prompts", "Free plan to test"],
    cons: ["Pivoted hard to enterprise GTM — less useful for bloggers", "Affiliate terms are not published", "Big price jump to the agents tier"],
    verdict: "A team automation platform wearing a copywriter's name. Great value if you run workflows; confusing if you just want blog posts.",
    page: "writing-tools.html",
    affiliate: { program: "Copy.ai Partner Program", status: "verify", commission: "~45% recurring reported, terms unpublished", cookie: "Not published", network: "PartnerStack", pct: 45, months: 12, avgPrice: 29, url: "https://www.copy.ai/", verified: false }
  },
  {
    slug: "rytr", name: "Rytr", category: "writing", categoryLabel: "Budget Writing",
    tagline: "Cheap, fast short-form generation",
    price: "$9/mo", priceNum: 9, planLabel: "Saver, monthly",
    trial: "Free plan (10k characters/mo)", rating: 4.1,
    bestFor: "Budget-conscious solo creators",
    highlights: ["10,000 free characters / mo", "$9 entry plan", "40+ use-case templates"],
    pros: ["Cheapest paid plan in the category", "Fast for short-form copy", "Useful free tier"],
    cons: ["Output needs heavy editing for long-form", "Fewer brand controls", "Affiliate terms need confirming"],
    verdict: "Fine as a $9 utility. Don't expect Jasper-grade long-form, and don't build a content strategy on it.",
    page: "writing-tools.html",
    affiliate: { program: "Rytr Affiliate", status: "verify", commission: "Reported recurring commission — confirm on application", cookie: "Not published", network: "In-house", pct: 30, months: 12, avgPrice: 9, url: "https://rytr.me/", verified: false }
  },

  /* -------------------------------- IMAGE -------------------------------- */
  {
    slug: "firefly", name: "Adobe Firefly", category: "image", categoryLabel: "AI Image",
    tagline: "Commercially safe generation inside Adobe",
    price: "$9.99/mo", priceNum: 9.99, planLabel: "Standard, monthly",
    trial: "Free daily generations", rating: 4.4,
    bestFor: "Brands and agencies that need IP indemnification",
    highlights: ["Licensed training data", "IP indemnification on paid plans", "Photoshop + Express integration"],
    pros: ["Safest option for client and commercial work", "Deep Adobe app integration", "85% first-month affiliate commission"],
    cons: ["Image quality trails Midjourney", "Credit allowances vanish quickly", "Best value only if you already pay for Creative Cloud"],
    verdict: "Choose it for legal cover and workflow, not for the prettiest pixels. The best-paying affiliate in this category by a mile.",
    page: "image-generators.html",
    affiliate: { program: "Adobe Affiliates", status: "open", commission: "85% of first month / 8.33% annual prepaid", cookie: "30 days", network: "Partnerize", pct: 85, months: 1, avgPrice: 19.99, url: "https://www.adobe.com/affiliates.html", verified: false }
  },
  {
    slug: "midjourney", name: "Midjourney", category: "image", categoryLabel: "AI Image",
    tagline: "Still the aesthetic benchmark",
    price: "$10/mo", priceNum: 10, planLabel: "Basic, monthly",
    trial: "None", rating: 4.7,
    bestFor: "Creators who care most about how the image looks",
    highlights: ["Best-in-class aesthetics", "Style reference + character consistency", "Fast GPU hours"],
    pros: ["Unmatched visual quality out of the box", "Huge community and prompt knowledge base", "Cheap entry tier"],
    cons: ["No free trial at all", "No public API", "No affiliate program — zero monetisation"],
    verdict: "The one to beat on pure image quality. There is no affiliate program, so link it for trust, not for revenue.",
    page: "image-generators.html",
    affiliate: { program: "None", status: "none", commission: "No affiliate or referral program", cookie: "—", network: "—", pct: null, months: 0, avgPrice: 10, url: "https://www.midjourney.com/", verified: true }
  },
  {
    slug: "ideogram", name: "Ideogram", category: "image", categoryLabel: "AI Image",
    tagline: "The best at rendering actual text",
    price: "$20/mo", priceNum: 20, planLabel: "Plus, monthly",
    trial: "Limited free credits", rating: 4.4,
    bestFor: "Designers making posters, logos and type-led graphics",
    highlights: ["Accurate in-image typography", "Character consistency", "Batch generation"],
    pros: ["Only mainstream model that spells reliably", "Strong graphic-design output", "Affiliate pays per sale, apply-gated"],
    cons: ["Fewer style presets than rivals", "Rate not published publicly", "Credits burn fast on high-res batches"],
    verdict: "If your image needs words in it, start here. Nothing else is close on lettering.",
    page: "image-generators.html",
    affiliate: { program: "Ideogram Creators Club", status: "open", commission: "Up to $417 per sale (rate not published)", cookie: "Not stated", network: "In-house", pct: null, months: 1, avgPrice: 20, flat: 417, url: "https://ideogram.ai/", verified: false }
  },
  {
    slug: "canva", name: "Canva", category: "image", categoryLabel: "Design Suite",
    tagline: "Design tool with AI bolted in everywhere",
    price: "$12/mo", priceNum: 12, planLabel: "Pro, billed yearly",
    trial: "Generous free plan", rating: 4.5,
    bestFor: "Non-designers producing social and marketing assets",
    highlights: ["Templates for everything", "Magic Studio AI tools", "Brand kits + team libraries"],
    pros: ["Fastest path from idea to finished asset", "Free tier is genuinely usable", "Best collaboration for non-designers"],
    cons: ["Affiliate program is closed to new applicants", "AI image quality is mid-tier", "Template look is recognisable"],
    verdict: "The default answer for small teams. No affiliate opportunity left here — Canva closed the program.",
    page: "image-generators.html",
    affiliate: { program: "Canva Affiliates", status: "closed", commission: "Closed to new applicants", cookie: "—", network: "Impact", pct: null, months: 0, avgPrice: 12, url: "https://www.canva.com/affiliates/", verified: true }
  },
  {
    slug: "leonardo", name: "Leonardo AI", category: "image", categoryLabel: "AI Image",
    tagline: "Production art with model-level control",
    price: "Freemium", priceNum: null, planLabel: "Free tier + paid plans",
    trial: "Free credits daily", rating: 4.3,
    bestFor: "Game and concept artists who need consistent styles",
    highlights: ["Fine-tuned custom models", "Real-time canvas", "Texture + 3D asset tools"],
    pros: ["Deep control over style and consistency", "Strong free allowance", "Great for game asset pipelines"],
    cons: ["Affiliate program closed April 2026", "Steeper learning curve", "Credit costs vary by model"],
    verdict: "A serious tool for production artists. Promote it only if you're getting paid another way — the program is gone.",
    page: "image-generators.html",
    affiliate: { program: "Leonardo Affiliates", status: "closed", commission: "Program closed 7 April 2026", cookie: "—", network: "Impact", pct: null, months: 0, avgPrice: 12, url: "https://leonardo.ai/", verified: true }
  },

  /* -------------------------------- VIDEO -------------------------------- */
  {
    slug: "synthesia", name: "Synthesia", category: "video", categoryLabel: "AI Video",
    tagline: "Avatar video for training and comms",
    price: "$19/mo", priceNum: 19, planLabel: "Starter, monthly",
    trial: "Free plan (10 min/mo)", rating: 4.6,
    bestFor: "L&D and internal comms teams replacing camera shoots",
    highlights: ["230+ avatars, 140+ languages", "Document-to-video", "Brand kits + templates"],
    pros: ["Most polished corporate avatar output", "Huge language coverage", "25% recurring for 12 months, 90-day cookie"],
    cons: ["Credit model is confusing to explain", "Not built for cinematic content", "Per-minute costs climb fast"],
    verdict: "The safe enterprise pick. Best affiliate deal in the category: 25% for a year on a $59/mo plan.",
    page: "video-tools.html",
    affiliate: { program: "Synthesia Affiliates", status: "open", commission: "25% per sale, 12 months", cookie: "90 days", network: "In-house", pct: 25, months: 12, avgPrice: 59, url: "https://www.synthesia.io/partners/affiliates", verified: true }
  },
  {
    slug: "heygen", name: "HeyGen", category: "video", categoryLabel: "AI Video",
    tagline: "Avatars, translation and video agents",
    price: "$29/mo", priceNum: 29, planLabel: "Creator, monthly",
    trial: "Free plan (3 videos/mo)", rating: 4.5,
    bestFor: "Creators shipping multilingual talking-head video",
    highlights: ["Custom avatars", "Video translation with lip-sync", "Avatar IV + video agent"],
    pros: ["Translation quality is excellent", "Fast avatar rendering", "Open affiliate program with monthly payouts"],
    cons: ["Credits run out on longer videos", "Watermark on free tier", "Avatar realism varies by input footage"],
    verdict: "The best multilingual avatar workflow. Affiliate pays 20% for 12 months, or 35% for 3 months via the creator program.",
    page: "video-tools.html",
    affiliate: { program: "HeyGen Affiliate", status: "open", commission: "20% recurring, 12 months (35% / 3 months creator track)", cookie: "30 days", network: "Rewardful", pct: 20, months: 12, avgPrice: 24, url: "https://www.heygen.com/affiliate-program", verified: true }
  },
  {
    slug: "invideo", name: "InVideo AI", category: "video", categoryLabel: "AI Video",
    tagline: "Prompt-to-video with stock and voiceover",
    price: "$20/mo", priceNum: 20, planLabel: "Starter, monthly",
    trial: "Free plan, weekly credits", rating: 4.2,
    bestFor: "Faceless channels and fast social explainers",
    highlights: ["Full video from one prompt", "Frontier model access", "Timeline editing"],
    pros: ["Genuinely fast first draft", "Wide model + stock library", "Cheap annual pricing"],
    cons: ["Credit costs are opaque per model", "Output needs manual polish", "Affiliate terms need confirming"],
    verdict: "Good for volume content where speed beats craft. Check the current partner terms before you build a page around it.",
    page: "video-tools.html",
    affiliate: { program: "InVideo Affiliate", status: "verify", commission: "Reported ~50% first month — confirm before promoting", cookie: "Not published", network: "In-house", pct: 50, months: 1, avgPrice: 20, url: "https://invideo.io/", verified: false }
  },
  {
    slug: "veed", name: "VEED", category: "video", categoryLabel: "Video Editor",
    tagline: "Browser editor with subtitles that actually work",
    price: "$20/mo", priceNum: 20, planLabel: "Creator, monthly",
    trial: "Free plan", rating: 4.3,
    bestFor: "Social teams that need captions and quick cuts",
    highlights: ["Auto subtitles + translation", "Screen + camera recording", "AI avatars and dubbing"],
    pros: ["Fastest caption workflow online", "No install, works in browser", "30% commission for 12 months"],
    cons: ["Credit system limits heavy AI use", "Not for long-form editing", "Watermark on free plan"],
    verdict: "The practical choice for short-form social. Strong affiliate terms for a tool creators recommend anyway.",
    page: "video-tools.html",
    affiliate: { program: "VEED Affiliates", status: "open", commission: "30% for 12 months", cookie: "Not published", network: "In-house", pct: 30, months: 12, avgPrice: 21, url: "https://www.veed.io/affiliates", verified: false }
  },
  {
    slug: "descript", name: "Descript", category: "video", categoryLabel: "Video Editor",
    tagline: "Edit video by editing the transcript",
    price: "$24/mo", priceNum: 24, planLabel: "Hobbyist, monthly",
    trial: "Free plan", rating: 4.4,
    bestFor: "Podcasters and course creators editing talking video",
    highlights: ["Text-based editing", "Studio Sound cleanup", "Filler-word removal"],
    pros: ["Editing model is genuinely faster for talking heads", "Excellent audio repair", "Free tier to prove it"],
    cons: ["Media-hour limits bite quickly", "Not ideal for motion graphics", "Affiliate rate is modest"],
    verdict: "If you record yourself talking, this halves edit time. The affiliate payout is small; the retention is what sells it.",
    page: "video-tools.html",
    affiliate: { program: "Descript Affiliates", status: "verify", commission: "~15% per sale — confirm current terms", cookie: "Not published", network: "In-house", pct: 15, months: 1, avgPrice: 24, url: "https://www.descript.com/", verified: false }
  },
  {
    slug: "opusclip", name: "OpusClip", category: "video", categoryLabel: "Clip Repurposing",
    tagline: "Long video in, viral shorts out",
    price: "$15/mo", priceNum: 15, planLabel: "Starter, monthly",
    trial: "Free plan (60 credits/mo)", rating: 4.3,
    bestFor: "Podcasters and streamers feeding short-form feeds",
    highlights: ["Auto clip selection", "Virality scoring", "Caption + reframe"],
    pros: ["Best clip-selection model of the bunch", "Fast turnaround on long recordings", "Free tier for testing"],
    cons: ["Watermark on free exports", "Clip choices still need curation", "Affiliate program details need confirming"],
    verdict: "The highest-leverage tool for repurposing, provided you still watch what it picks. Verify program terms before featuring it.",
    page: "video-tools.html",
    affiliate: { program: "Opus Clip Affiliates", status: "verify", commission: "Program reported — confirm current terms", cookie: "Not published", network: "In-house", pct: 30, months: 12, avgPrice: 15, url: "https://www.opus.pro/", verified: false }
  },

  /* -------------------------------- VOICE -------------------------------- */
  {
    slug: "elevenlabs", name: "ElevenLabs", category: "voice", categoryLabel: "AI Voice",
    tagline: "The voice model everyone else is measured against",
    price: "$6/mo", priceNum: 6, planLabel: "Starter, monthly",
    trial: "Free plan (10k credits/mo)", rating: 4.8,
    bestFor: "Creators and developers who need natural speech",
    highlights: ["Best-in-class TTS", "Voice cloning from $6/mo", "Dubbing in 90+ languages"],
    pros: ["Audio quality is the category benchmark", "Cheapest commercial licence in the category", "22% recurring for 12 months, 90-day cookie"],
    cons: ["Credits are consumed fast by long audio", "Cloning requires consent verification", "Free tier is non-commercial"],
    verdict: "The default choice for AI voice, and one of the easiest products to sell honestly. Best overall affiliate on this site.",
    page: "voice-tools.html",
    affiliate: { program: "ElevenLabs Creator Affiliate", status: "open", commission: "22% for 12 months (11% on Business)", cookie: "90 days", network: "PartnerStack", pct: 22, months: 12, avgPrice: 22, url: "https://elevenlabs.io/affiliates", verified: true }
  },
  {
    slug: "murf", name: "Murf AI", category: "voice", categoryLabel: "AI Voice",
    tagline: "Studio voiceover with slides integration",
    price: "$29/mo", priceNum: 29, planLabel: "Creator, monthly",
    trial: "Free plan (10 min total)", rating: 4.5,
    bestFor: "E-learning and presentation voiceovers",
    highlights: ["200+ stock voices", "Canva + PowerPoint plugins", "Timeline-based sync"],
    pros: ["Best workflow for slide-based narration", "24-month commission window", "Simple per-hour pricing"],
    cons: ["Cloning is an enterprise add-on", "Less expressive than ElevenLabs", "Entry price is high"],
    verdict: "The e-learning specialist. A 24-month payout window makes it the better long-term earner of the two big voice programs.",
    page: "voice-tools.html",
    affiliate: { program: "Murf Affiliate", status: "open", commission: "20% recurring, 24 months", cookie: "Not published", network: "In-house", pct: 20, months: 24, avgPrice: 19, url: "https://murf.ai/", verified: false }
  },
  {
    slug: "playht", name: "PlayHT", category: "voice", categoryLabel: "AI Voice",
    tagline: "Voice cloning with a generous API",
    price: "$39/mo", priceNum: 39, planLabel: "Creator, monthly",
    trial: "Free plan", rating: 4.2,
    bestFor: "Developers building speech into products",
    highlights: ["Low-latency streaming API", "Voice cloning", "Multiple languages"],
    pros: ["Developer-friendly API surface", "Competitive per-character pricing", "Solid cloning quality"],
    cons: ["Affiliate program not publicly documented", "UI trails competitors", "Plan limits are character-based"],
    verdict: "A credible API-first alternative. Treat affiliate potential as unproven until you see published terms.",
    page: "voice-tools.html",
    affiliate: { program: "PlayHT Affiliate", status: "verify", commission: "Not publicly documented", cookie: "Not published", network: "In-house", pct: 25, months: 12, avgPrice: 39, url: "https://play.ht/", verified: false }
  },
  {
    slug: "cartesia", name: "Cartesia", category: "voice", categoryLabel: "Realtime Voice",
    tagline: "Low-latency voice for real-time agents",
    price: "$5/mo", priceNum: 5, planLabel: "Entry, monthly",
    trial: "Free credits", rating: 4.3,
    bestFor: "Teams building voice agents and telephony",
    highlights: ["Sub-100ms latency", "Streaming TTS", "Voice cloning"],
    pros: ["Best latency-per-dollar in the category", "Built for conversational agents", "Very cheap entry"],
    cons: ["Fewer stock voices", "No consumer app", "No public affiliate program"],
    verdict: "The infra pick for voice agents. Not a consumer product and not a monetisation play.",
    page: "voice-tools.html",
    affiliate: { program: "None", status: "none", commission: "No public affiliate program", cookie: "—", network: "—", pct: null, months: 0, avgPrice: 5, url: "https://cartesia.ai/", verified: true }
  },

  /* -------------------------------- CODING ------------------------------- */
  {
    slug: "copilot", name: "GitHub Copilot", category: "coding", categoryLabel: "AI Coding",
    tagline: "The default AI pair programmer",
    price: "$10/mo", priceNum: 10, planLabel: "Pro, monthly",
    trial: "Free tier", rating: 4.5,
    bestFor: "Developers who want AI in the editor they already use",
    highlights: ["Widest IDE + GitHub coverage", "Agent mode + code review", "Claude and Codex models"],
    pros: ["Cheapest serious plan at $10", "Works in VS Code, JetBrains, Neovim and more", "Deep GitHub integration"],
    cons: ["No affiliate program at all", "Agent is weaker than Cursor on multi-file work", "Premium request limits"],
    verdict: "Best value in AI coding, especially if you already live in GitHub. No affiliate program — link it for credibility only.",
    page: "coding-tools.html",
    affiliate: { program: "None", status: "none", commission: "No public affiliate program", cookie: "—", network: "—", pct: null, months: 0, avgPrice: 10, url: "https://github.com/features/copilot", verified: true }
  },
  {
    slug: "cursor", name: "Cursor", category: "coding", categoryLabel: "AI Coding",
    tagline: "The AI-native IDE developers actually switched to",
    price: "$20/mo", priceNum: 20, planLabel: "Pro, monthly",
    trial: "Free Hobby tier", rating: 4.6,
    bestFor: "Engineers doing large multi-file changes with agents",
    highlights: ["Codebase-wide context", "Multi-file agent edits", "Tab model that predicts edits"],
    pros: ["Best agentic editing experience", "Fast, familiar VS Code base", "Strong model selection"],
    cons: ["No cash affiliate program (referral credits ended July 2026)", "Usage-based pricing surprises", "Can be slow on huge repos"],
    verdict: "The best agentic editor, but there is no money in promoting it. Include it so your comparison stays credible.",
    page: "coding-tools.html",
    affiliate: { program: "None", status: "none", commission: "Referral credits discontinued July 2026", cookie: "—", network: "—", pct: null, months: 0, avgPrice: 20, url: "https://cursor.com/", verified: true }
  },
  {
    slug: "windsurf", name: "Windsurf", category: "coding", categoryLabel: "AI Coding",
    tagline: "Agent-first IDE with a JetBrains path",
    price: "$20/mo", priceNum: 20, planLabel: "Pro, monthly",
    trial: "Free plan", rating: 4.4,
    bestFor: "Teams that want agents plus JetBrains support",
    highlights: ["Cascade agent", "Cloud agents", "Multi-IDE extensions"],
    pros: ["Better JetBrains support than Cursor", "Clean agent UX", "Free tier is usable"],
    cons: ["Pricing and branding changed repeatedly in 2026", "Affiliate program unconfirmed", "Smaller ecosystem"],
    verdict: "A solid alternative if you're on JetBrains. Confirm current pricing before publishing numbers — it has moved a lot.",
    page: "coding-tools.html",
    affiliate: { program: "Windsurf Affiliates", status: "verify", commission: "Reported 20% recurring — confirm current terms", cookie: "Not published", network: "In-house", pct: 20, months: 12, avgPrice: 20, url: "https://windsurf.com/", verified: false }
  },
  {
    slug: "tabnine", name: "Tabnine", category: "coding", categoryLabel: "AI Coding",
    tagline: "Private, on-prem code completion",
    price: "$39/mo", priceNum: 39, planLabel: "Code Assistant, annual",
    trial: "14-day trial", rating: 4.2,
    bestFor: "Enterprises that cannot send code to a vendor",
    highlights: ["On-prem / air-gapped deployment", "Zero code retention", "15+ IDEs"],
    pros: ["Only mainstream option for air-gapped installs", "20% recurring affiliate for 12 months", "SOC 2 + compliance friendly"],
    cons: ["Expensive per seat", "Weaker models than Copilot/Cursor", "No self-serve pricing"],
    verdict: "Sells to a security team, not a developer. High-intent niche traffic converts well on it.",
    page: "coding-tools.html",
    affiliate: { program: "Tabnine Affiliate", status: "open", commission: "20% recurring, 12 months", cookie: "60 days", network: "In-house", pct: 20, months: 12, avgPrice: 39, url: "https://www.tabnine.com/", verified: false }
  },
  {
    slug: "coderabbit", name: "CodeRabbit", category: "coding", categoryLabel: "Code Review",
    tagline: "AI review on every pull request",
    price: "From $24/mo", priceNum: 24, planLabel: "Pro, per seat",
    trial: "Free for open source", rating: 4.4,
    bestFor: "Teams drowning in pull-request review",
    highlights: ["PR summaries + line comments", "Learns from your repo", "GitHub + GitLab"],
    pros: ["Catches real issues, not just style", "Fits existing review workflow", "$30 per qualified lead affiliate"],
    cons: ["Noisy on very large PRs", "Per-seat cost adds up", "Best value only for active repos"],
    verdict: "Easy add-on sale to any engineering team already using Copilot or Cursor. $30/lead with a 60-day cookie is generous.",
    page: "coding-tools.html",
    affiliate: { program: "CodeRabbit Partner Program", status: "open", commission: "$30 per qualified lead", cookie: "60 days", network: "Dub Partners", pct: null, months: 1, avgPrice: 24, flat: 30, url: "https://www.coderabbit.ai/", verified: false }
  },
  {
    slug: "claude", name: "Claude", category: "coding", categoryLabel: "AI Coding",
    tagline: "The strongest reasoning model for hard bugs",
    price: "$20/mo", priceNum: 20, planLabel: "Pro, monthly",
    trial: "Free plan", rating: 4.7,
    bestFor: "Engineers working through complex, gnarly code",
    highlights: ["Claude Code agent", "Long-context reasoning", "Artifacts + file analysis"],
    pros: ["Best at reasoning through unfamiliar code", "Claude Code runs in your terminal", "Excellent long-form explanations"],
    cons: ["No affiliate program", "Usage limits reset on a rolling window", "Fewer IDE integrations than Copilot"],
    verdict: "Often the best answer, never the one that pays you. Include it and win the reader's trust instead.",
    page: "coding-tools.html",
    affiliate: { program: "None", status: "none", commission: "No public affiliate program", cookie: "—", network: "—", pct: null, months: 0, avgPrice: 20, url: "https://claude.com/", verified: true }
  }
];
