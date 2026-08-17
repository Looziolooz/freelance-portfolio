# Generate the vertical footage for the social-content demo (/work/contenuti-social).
#
# Why this exists
# ---------------
# The reel in SocialDemo plays projects/brado.mp4, which is a 16:9 screen
# recording cropped into a 9:16 frame. It reads as a mock to anyone who actually
# posts reels, and the reel is the one format on that page where the medium IS
# the product. Higgsfield generates natively vertical footage, so the demo can
# stop pretending.
#
# It also settles a harder problem than the aspect ratio. The content retainer is
# priced from EUR 400/month; at that number nobody is hiring a crew, so "we shoot
# video" was never really on the table and the offer had a quiet hole in it.
# Generated footage is what makes the service deliverable at the price, which
# means a demo showing generated footage is not a shortcut - it is an accurate
# sample of what a client receives.
#
# Setup (once)
#   npm install -g @higgsfield/cli
#   higgsfield auth login
#   higgsfield account          # check the credit balance before a run
#
# Usage
#   powershell -File scripts/social-reels.ps1              # every clip
#   powershell -File scripts/social-reels.ps1 -Only brado  # just one
#
# Each generation SPENDS CREDITS. The prompts are written to be shot once, not
# iterated: they name subject, light, camera move and closing frame, because the
# vague prompt is the expensive one.

param(
  [ValidateSet("all", "brado", "gelateria", "nordbageriet")]
  [string]$Only = "all",
  # The four gelateria carousel stills instead of the reels. Images are 2
  # credits each against 10 for a clip, so this switch is cheap to re-run.
  [switch]$Carousel
)

$ErrorActionPreference = "Stop"
$out = "public/social"

if (-not (Get-Command higgsfield -ErrorAction SilentlyContinue)) {
  Write-Host "higgsfield CLI not found." -ForegroundColor Yellow
  Write-Host "  npm install -g @higgsfield/cli"
  Write-Host "  higgsfield auth login"
  exit 1
}

if (-not (Test-Path $out)) { New-Item -ItemType Directory -Force -Path $out | Out-Null }

# ── Carousel stills ───────────────────────────────────────────────────────────
# The carousel used to run one photo and three type-only slides. On a feed the
# picture is what stops the thumb, so three slides out of four had nothing to
# stop it with and the sequence read as unfinished. One image per slide, telling
# the same story the copy tells: the rush, the booking, the closed shop.
# Slide 1 is cropped from the gelateria reel poster, so only 2-4 are generated.
if ($Carousel) {
  $stills = @(
    @{ n = "car-slide2"; p = "Interior of a small Italian artisan gelateria at a busy hour, seen from behind the marble counter: an old landline phone left off the hook on the counter top, a blurred queue of customers waiting beyond it, warm afternoon light, cream tiles and brass details, shallow depth of field, documentary photograph, no text, no readable faces." },
    @{ n = "car-slide3"; p = "A smartphone propped against a stack of paper cups on a gelateria marble counter, its screen glowing with an abstract unreadable booking interface, a small printed order ticket lying beside it, warm shop light, cream and pistachio green palette, shallow depth of field, documentary photograph, no legible text, no faces." },
    @{ n = "car-slide4"; p = "An artisan gelateria seen from the street through its window at closing time, warm lights still on inside, the counter tidy and empty, a neat row of prepared paper bags waiting for pickup on the marble, deep blue evening outside, cream and pistachio palette, documentary photograph, no text, no faces." }
  )
  foreach ($st in $stills) {
    Write-Host "-> $($st.n)" -ForegroundColor Cyan
    higgsfield generate create nano_banana_pro `
      --prompt $st.p `
      --aspect_ratio 1:1 `
      --resolution 2k `
      --wait --json | Set-Content -Path (Join-Path $out "$($st.n).json") -Encoding utf8
  }
  Write-Host ""
  Write-Host "Download each result_url, then:" -ForegroundColor Green
  Write-Host "  ffmpeg -i <src>.png -vf scale=1000:1000 -q:v 5 $out/<name>.jpg"
  exit 0
}

# The prompts stay inside what the project pages already claim, so the sample
# content never describes a business that does not exist: Brado is 100% Italian
# pasture-raised beef over beechwood charcoal with bread leavened in house; the
# gelateria has made gelato since 1978; Nordbageriet has supplied bakeries
# since 1952.
$clips = @(
  @{
    name   = "reel-brado"
    prompt = "Vertical food film: a thick beef burger patty searing over glowing beechwood charcoal, close macro, embers pulsing, smoke drifting through a warm side light against a dark kitchen. Slow push in on the crust forming, then a soft rack focus to a hand placing a house-leavened bun beside it. Warm amber and deep brown palette, shallow depth of field, natural grain, no text, no logos, no faces."
  },
  @{
    name   = "reel-gelateria"
    prompt = "Vertical food film: a steel spatula folding fresh pistachio gelato in a chilled artisan tray, slow and heavy, cold vapour lifting off the surface. Warm shop light from the left, cream and green palette, close macro, gentle push in ending on the finished swirl. Analogue warmth, shallow depth of field, no text, no logos, no faces."
  },
  @{
    name   = "reel-nordbageriet"
    prompt = "Vertical bakery film: trays of golden cardamom buns and crusty sourdough loaves sliding out of a large industrial oven, steam rising in cold morning light through a tall window. Nordic and restrained, pale wood and grey steel, slow lateral camera move along the trays ending on a single loaf in focus. No text, no logos, no faces."
  }
)

# 9:16, 5s, pro on every clip.
#   · kling3_0 takes --mode (std | pro | 4k), NOT --resolution.
#   · std, 10 credits. pro (12.5) and 4k are gated behind a Pro/Ultimate
#     SUBSCRIPTION, not just a credit balance, so on the starter plan they fail
#     before spending anything. Raise this to pro only if the plan changes.
#   · five seconds is deliberate: the overlay in SocialDemo carries four lines,
#     and a line needs more than a second to be read with the sound off.
foreach ($clip in $clips) {
  $short = $clip.name -replace "^reel-", ""
  if ($Only -ne "all" -and $Only -ne $short) { continue }

  Write-Host "-> $($clip.name)" -ForegroundColor Cyan
  $json = Join-Path $out "$($clip.name).json"

  higgsfield generate create kling3_0 `
    --prompt $clip.prompt `
    --aspect_ratio 9:16 `
    --duration 5 `
    --mode std `
    --wait --json | Set-Content -Path $json -Encoding utf8

  # The CLI writes its error into stdout and still exits 0, so a failed run
  # would otherwise look like a saved job and be discovered three steps later.
  $body = Get-Content -Raw -Path $json
  if ($body -match '"?[Ee]rror"?\s*:?') {
    Write-Host "   FAILED: $body" -ForegroundColor Red
    continue
  }
  Write-Host "   job saved to $json"
}

Write-Host ""
Write-Host "Then, per clip:" -ForegroundColor Green
Write-Host "  1. download the URL the job returned into $out/<name>.mp4"
Write-Host "  2. re-encode small - the demo plays it muted in a 360px-wide frame:"
Write-Host "     ffmpeg -i $out/<name>.mp4 -an -vf scale=720:-2 -c:v libx264 -crf 28 -preset veryslow -movflags +faststart $out/<name>-web.mp4"
Write-Host "  3. point SOCIAL_REEL_VIDEO in src/lib/social-demos.ts at the new file"
