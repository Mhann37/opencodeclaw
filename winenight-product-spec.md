# WineNight: Complete Product Specification

**Document Version:** 1.0  
**Last Updated:** 2026-03-22  
**Status:** Ready for Implementation  
**Target Launch:** Q2 2026

---

## **TABLE OF CONTENTS**

1. Executive Summary
2. Product Vision & Strategy
3. Target Markets & Personas
4. Feature List (P0/P1/P2 Priority)
5. User Flows & Wireframes
6. Database Schema
7. API Endpoints
8. Email Automation & Templates
9. UI/UX Requirements
10. Monetization & Business Model
11. Implementation Timeline
12. Success Metrics & KPIs
13. Technical Stack & Dependencies

---

## **1. EXECUTIVE SUMMARY**

### What Is WineNight?

WineNight is a **social blind-tasting scoring and analytics platform** with two distinct user experiences:

**Personal Tier:** Friends run blind tastings, score wines, get personalized taste profiles. Free (0-4 participants) + $9.99 one-time purchase (unlimited).

**Winery Tier (B2B):** Cellar door staff run tastings on tablets, capture customer emails automatically, send personalized wine recommendations via email, drive post-visit sales. Recurring: $99/month.

### Why Now?

1. **Personal segment validation:** Real user feedback from wine nights shows product-market fit
2. **Winery opportunity:** Clear B2B ROI ($99/mo cost → $240+/mo extra revenue)
3. **Low CAC channels:** Wineries = direct sales, personal = organic + Reddit/Facebook
4. **High-margin SaaS:** Email automation drives recurring revenue with minimal support cost

### Expected Business Impact (Year 1)

- **Personal:** 1,000+ signups, 50-100 conversions @ $9.99 = $500-1,000 one-time revenue
- **Winery:** 25-50 paying customers @ $99/mo = $30,000-60,000 ARR
- **Total Year 1 ARR:** $90,000-120,000 (winery-driven, sustainable)

---

## **2. PRODUCT VISION & STRATEGY**

### Core Promise

*"Score your wine night. Discover your taste."* (Personal)  
*"Turn your cellar door into a revenue engine."* (Winery)

### Strategic Positioning

| Aspect | Position |
|--------|----------|
| **vs. Vivino** | Vivino is for wine *reviews*. We're for wine *tastings* (blind scoring + group experience) |
| **vs. CellarTracker** | CellarTracker is complex/for collectors. We're frictionless for casual users |
| **vs. Manual scorecards** | We automate data capture, email, follow-up (the upgrade path) |
| **Unique angle** | Blind tasting UX + AI taste profiles + automated winery sales follow-up |

### Why Wineries First?

**Personal tier challenges:**
- Crowded market (Vivino exists)
- Low LTV ($10 one-time)
- High CAC (need marketing spend)
- Ads on $10 product = bad UX

**Winery tier advantages:**
- **Zero competition** (no one owns cellar door UX)
- **Clear ROI** (3x payback in 6 months)
- **Recurring revenue** ($99/mo = sustainable)
- **High LTV** ($1,188/year, expands with enterprise)
- **Low CAC** (direct B2B sales)
- **Expansion potential** (multi-location, white-label, API)

### Go-to-Market Timeline

**Phase 1 (Weeks 1-2):** Build winery MVP features
**Phase 2 (Weeks 3-4):** Beta with 5-10 local Sydney wineries (free trial)
**Phase 3 (Weeks 5-8):** Cold outreach to 50+ regional wineries, close 5-10 paying customers
**Phase 4 (Weeks 9-12):** Launch personal tier (use winery case studies as social proof)

---

## **3. TARGET MARKETS & PERSONAS**

### Primary: Winery Cellar Door Staff

**Persona: Lisa (Winery Manager)**
- Age: 35-55
- Role: Manages cellar door tastings (50-200 visitors/month)
- Pain points:
  - Manual scorecards (paper, time-consuming to tally)
  - Low email capture (30% of visitors, many illegible)
  - No follow-up (no customer data to re-engage)
  - Staff time wasted on admin
  - No insights into which wines are winning
- Wants: Automation that reduces admin, captures emails, drives sales
- WTP: $99-200/month

**Buying decision maker:** Lisa + winery owner  
**Success metric:** "This saved us 5 hours/week and we got 20 new email leads"

### Secondary: Boutique Wine Tourism

**Persona: James (Wine Tour Operator)**
- Age: 40-60
- Role: Runs wine tours across 3-5 wineries
- Pain point: Managing tastings at multiple venues, no unified customer data
- Wants: Centralized platform to track customer preferences across all locations
- WTP: $200-500/month

### Tertiary: Personal / Wine Enthusiasts

**Persona: Sarah (Wine Enthusiast)**
- Age: 30-50
- Role: Hosts monthly wine nights with friends
- Pain point: Manual scoring, no insights into group preferences
- Wants: Fun, frictionless tasting experience + personalized results
- WTP: $10 one-time (low friction preferred)

---

## **4. FEATURE LIST (P0/P1/P2 PRIORITY)**

### P0: MUST SHIP (Winery MVP)

These features are required for winery product-market fit and direct sales.

#### 4.1 Authentication & Access Control

**Feature:** Winery Staff Login
- Email + password authentication (Firebase Auth)
- Optional: Google OAuth (SSO for easier UX)
- Password reset flow
- Role-based access (Owner vs. Staff)
- **Why:** Wineries need private, secure access to customer data

**Feature:** Winery Account Creation
- Sign-up form (winery name, owner email, password)
- Email verification
- Onboarding flow (upload logo, set colors, add staff)
- **Why:** First-time winery setup should be <5 min frictionless

#### 4.2 Winery Setup & Branding

**Feature:** Winery Profile Management
- Upload logo (Firebase Storage)
- Custom brand colors (primary, accent)
- Winery description + website link
- Email domain (optional: custom from address)
- **Why:** Branded results = professional, drives customer trust + sharing

**Feature:** Wine Catalog Management
- Add wines to winery catalog (name, varietal, year, region)
- Import bulk (CSV)
- Edit/delete wines
- **Why:** Enables pre-loaded tasting sessions, staff doesn't re-enter data

#### 4.3 Tasting Session Creation & Management

**Feature:** Create Blind Tasting Session
- Select wines from catalog (or add custom)
- Set tasting date + time
- Set blind order (randomized)
- Generate unique QR code (printable)
- **Why:** Staff can set up on iPad, print at table in <5 min

**Feature:** QR Code Generation & Display
- Unique QR per session (links to join page)
- Print-friendly layout (A4, fits on small card)
- Display on staff tablet during tasting
- **Why:** Customers scan with phone, join instantly (zero email/PIN friction)

**Feature:** Real-Time Staff Dashboard (During Tasting)
- Live scoring results (wine X: avg 7.5/10, 8 participants)
- Participant count + response rate
- Wine leaderboard (highest average scores at top)
- End tasting button
- **Why:** Staff sees instant results, can adjust messaging based on favorites

#### 4.4 Customer Tasting Experience (Reuse from Personal)

**Feature:** Join Tasting via QR Code
- Scan QR → automatically join session
- Enter name (simple form)
- Scoring interface (1-10 slider, flavor tags)
- **Why:** Frictionless mobile-first UX, captures name for follow-up

**Feature:** Blind Tasting Scoring
- Rate each wine (1-10)
- Select 3 flavor descriptors (spicy, fruity, dry, etc.)
- Option to guess wine name (optional, for fun)
- **Why:** Data foundation for taste profile + recommendations

#### 4.5 Email Capture & Customer Data

**Feature:** Post-Tasting Email Capture Modal
- Appears after customer finishes scoring
- Simple form: Name + Email
- Optional: Mobile number (for SMS follow-up later)
- Clear CTA: "Get your tasting profile emailed to you"
- **Why:** Cellar doors want customer emails (default: 30%, with app: 90%)

**Feature:** Automatic Email Validation
- Check if email is valid format
- Re-prompt on invalid entry
- **Why:** Clean data for winery follow-up

**Feature:** Customer Data Storage
- Link email + name to tasting session
- Store in Firestore (Tasting → TastingParticipant → email, name, scores)
- Accessible to winery staff in dashboard
- **Why:** Foundation for winery analytics + CRM exports

#### 4.6 Results Card (Branded)

**Feature:** Branded Results Display
- Shows customer's tasting scores + wine names
- Winery logo + custom colors
- Taste profile summary: "You prefer [flavor profile]"
- CTA buttons: "Order Online" + "Join Wine Club"
- Share options: Text to self, Email, Print
- **Why:** Professional, shareable, drives brand recall + follow-up

#### 4.7 Post-Tasting Email Automation

**Feature:** Immediate Follow-Up Email (Sent Within 5 min)
- Template: Winery branded email
- Content:
  - "Thanks for tasting with us, [Name]!"
  - Their tasting results (wines + scores)
  - Taste profile summary (AI-generated)
  - Personalized wine recommendations (3-5 wines)
  - CTA: "Order these wines online" or "Join our wine club"
- **Why:** Drives immediate post-visit sales, captures customer touch points

**Feature:** Resend Email Service Integration
- API key authentication
- Email sending on participant submit
- Error handling (retry on failure)
- **Why:** Reliable, scalable, $20/month tier supports 100+ wineries

#### 4.8 Wine Recommendation Engine (Simple v1)

**Feature:** AI Taste Profile Generation
- Analyze customer's wine scores
- Identify highest-rated wines (8-10)
- Extract common flavor notes from high-rated wines
- Generate profile text: "You love [flavor profile], especially [varietal]"
- **Why:** Personalization drives email opens + click-through

**Feature:** Wine Recommendation Selection
- Match customer's top-rated wines to winery catalog
- Suggest similar wines (same varietal or flavor profile)
- Rank by match score (weighted by customer's ratings)
- Return top 3-5 wines for email
- **Why:** Customer sees wines they'll likely love, increases conversion

#### 4.9 Winery Dashboard (Basic)

**Feature:** Tasting History
- List all past tastings (date, participant count, avg score)
- Click to view details (wines, participants, scores)
- **Why:** Wineries track activity, prove ROI

**Feature:** Customer Email List
- Export all emails from a tasting (CSV)
- View all customers across all tastings
- **Why:** Wineries build email list for future campaigns

**Feature:** Top Wines Analytics
- Which wines scored highest (avg rating)
- Participation per wine
- Flavor profile trends
- **Why:** Wineries understand their portfolio strengths

#### 4.10 Basic Account Management

**Feature:** Subscription Status
- Show active/trial status
- Upgrade/downgrade CTA
- **Why:** Clear visibility for winery on trial vs. paid

**Feature:** Support & Documentation
- FAQ + getting started guide
- Email support contact
- **Why:** Reduce onboarding friction

---

### P1: SHIP NEXT (v1.1)

These features enhance the winery experience but are not blockers for launch.

#### 4.11 Advanced Analytics Dashboard

**Feature:** Customer Insights Dashboard
- Repeat visitor tracking
- Customer flavor preference aggregation (top 5 flavor profiles seen)
- Email engagement tracking (opens, clicks)
- Post-visit purchase tracking (if integrated with shop)
- **Why:** Proves ROI to wineries, drives retention

**Feature:** Monthly Performance Report
- Customer acquisition (emails captured)
- Email engagement stats
- Top wines (by rating + popularity)
- Trends (month-over-month)
- **Why:** Winery sees value in dashboard, proves subscription ROI

#### 4.12 Email Automation Expansion

**Feature:** Drip Campaign Templates
- Sent 1 week after tasting: "These wines are still available..."
- Sent 1 month after: "New vintage of your favorite wine"
- Sent quarterly: "Join our wine club for exclusive access"
- **Why:** Drives repeat purchases, increases LTV

**Feature:** Abandoned Cart Recovery (Future Integration)
- If winery integrates Shopify/WooCommerce
- Send reminder email if customer viewed wine but didn't buy
- **Why:** Recovers lost sales

#### 4.13 Staff Management

**Feature:** Multiple Staff Login
- Owner creates staff accounts (email-based)
- Assign permissions (can create tastings, view analytics, etc.)
- Deactivate/reactivate staff
- **Why:** Scales to larger wineries with teams

**Feature:** Activity Log
- Track which staff member created tasting, when
- Audit trail for compliance
- **Why:** Larger wineries require accountability

#### 4.14 CRM Integration

**Feature:** Zapier Integration
- Trigger: New email captured in tasting
- Action: Create contact in Zapier-connected CRM (HubSpot, Salesforce, etc.)
- Map fields (name, email, taste profile, wine scores)
- **Why:** Wineries can sync customer data to existing systems

**Feature:** Webhook Support
- Custom endpoint for winery integrations
- Send tasting data to winery's backend
- **Why:** Tech-savvy wineries can build custom workflows

#### 4.15 White-Label / Enterprise

**Feature:** Custom Branding (Winery Level)
- Override WineNight logo/colors with winery branding
- Custom domain (optional: tasting.theirwinery.com)
- **Why:** Enterprise wineries want full brand control

**Feature:** Multi-Location Management
- Owner manages multiple winery locations
- Consolidated analytics across locations
- **Why:** Wine tour operators, large wineries need this

---

### P2: ROADMAP (Future Phases)

These features expand the business but are not essential for MVP.

#### 4.16 Personal Tier (Post-Winery Validation)

**Feature:** Personal Tasting (PIN Join)
- Users create blind tastings (friend groups)
- PIN-based join (no email required)
- Same scoring experience as winery
- Results shared with group (no email follow-up)
- **Why:** Low-friction personal market, funds development

**Feature:** Wine Club Integration**
- Recommend wines from partner wine clubs
- Affiliate commission (10-15%)
- **Why:** Revenue from personal tier recommendations

#### 4.17 Advanced AI Features

**Feature:** Sommelier Notes Generation
- AI-generated tasting notes: "Full-bodied Shiraz with peppery finish, hints of blackberry..."
- **Why:** Educational + shareable content

**Feature:** Wine Pairing Recommendations**
- Suggest food pairings based on customer's taste profile
- "You love peppery reds? Try with grilled lamb..."
- **Why:** Adds value, drives wine education

#### 4.18 Mobile App

**Feature:** iOS/Android Native App
- Faster UX than web
- Offline scoring (sync later)
- Push notifications (reminders to join tastings)
- **Why:** Better UX for frequent users

---

## **5. USER FLOWS & WIREFRAMES**

### 5.1 WINERY STAFF FLOW

```
┌─────────────────────────────────────────────────────┐
│ NEW WINERY SIGNUP                                    │
├─────────────────────────────────────────────────────┤
│ 1. Land on winenight.app/for-wineries               │
│ 2. Click "Start Free Trial"                         │
│ 3. Sign up: Email, password, winery name            │
│ 4. Verify email                                      │
│ 5. Upload logo + brand colors                       │
│ 6. Add wines from catalog (or import CSV)           │
│ 7. Dashboard ready                                  │
│                                                      │
│ Time to first tasting: ~10 minutes                  │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ CREATE & RUN BLIND TASTING                          │
├─────────────────────────────────────────────────────┤
│ 1. Staff login (email + password)                   │
│ 2. Dashboard → "New Tasting"                        │
│ 3. Select wines (from catalog or add custom)        │
│ 4. Set blind order (auto-randomized)                │
│ 5. Generate QR code                                 │
│ 6. Print QR card for table                          │
│ 7. iPad shows "Tasting Active" with QR             │
│ 8. Customers scan QR → join tasting                 │
│ 9. Staff sees real-time results                     │
│ 10. When done, click "End Tasting"                 │
│ 11. Results card displayed to customers             │
│ 12. Emails captured automatically                   │
│ 13. Follow-up emails sent (within 5 min)           │
│                                                      │
│ Time to run tasting: <2 minutes setup               │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ VIEW CUSTOMER DATA & ANALYTICS                      │
├─────────────────────────────────────────────────────┤
│ 1. Dashboard → "Customers" tab                      │
│ 2. View all emails (spreadsheet view)               │
│ 3. Filter by tasting date                           │
│ 4. Export CSV (for email campaigns)                 │
│ 5. View top wines (leaderboard)                     │
│ 6. See flavor preference trends                     │
│ 7. Track email engagement (opens, clicks)           │
│                                                      │
│ Time: <1 minute per report                         │
└─────────────────────────────────────────────────────┘
```

### 5.2 CUSTOMER (PARTICIPANT) FLOW

```
┌─────────────────────────────────────────────────────┐
│ JOIN & SCORE TASTING (Mobile)                       │
├─────────────────────────────────────────────────────┤
│ 1. At table: See printed QR code                    │
│ 2. Scan with phone (any browser, no app needed)    │
│ 3. Enter name (simple prompt)                       │
│ 4. "Ready to taste?" → Start                        │
│ 5. Wine 1 appears: "Blind Tasting (1 of 3)"        │
│ 6. Rate wine (1-10 slider)                          │
│ 7. Select flavor tags (spicy, fruity, etc.)        │
│ 8. Optional: Guess wine name                        │
│ 9. "Next" → Wine 2                                  │
│ 10. Repeat for all wines                            │
│ 11. "Reveal Results?" → Show all scores             │
│ 12. Taste profile card displays (branded)           │
│ 13. Modal appears: "Get your tasting emailed"      │
│ 14. Enter email + name (prefilled)                  │
│ 15. Submit → "Email sent!"                          │
│ 16. Share options (text, email, print, Instagram)  │
│                                                      │
│ Time: ~5-7 minutes per customer                     │
└─────────────────────────────────────────────────────┘
```

### 5.3 POST-TASTING EMAIL FLOW (Automated)

```
┌─────────────────────────────────────────────────────┐
│ CUSTOMER COMPLETES TASTING                          │
├─────────────────────────────────────────────────────┤
│ 1. Customer submits email + name                    │
│ 2. Frontend triggers backend: POST /submit-email    │
│ 3. Backend stores: TastingParticipant record        │
│ 4. Backend calls: generateTasteProfile()            │
│    - Analyze customer's wine scores                 │
│    - Extract flavor tags (aggregated)               │
│    - Generate AI taste profile text                 │
│ 5. Backend calls: recommendWines()                  │
│    - Find wines customer rated highest              │
│    - Find similar wines by varietal/flavor         │
│    - Return top 3-5                                 │
│ 6. Backend renders: HTML email template             │
│    - Winery branding (logo, colors)                 │
│    - Customer name + taste profile                  │
│    - Wine recommendations with links                │
│ 7. Backend calls: Resend API                        │
│    - POST /emails/send with HTML template           │
│ 8. Resend sends email within 5 minutes              │
│ 9. Customer receives "Thanks for tasting! Here's   │
│    what you loved..."                               │
│ 10. Customer clicks wine link → winery shop        │
│ 11. Winery sees purchase (if shop is integrated)   │
│                                                      │
│ Automation: All happens in <10 seconds              │
└─────────────────────────────────────────────────────┘
```

---

## **6. DATABASE SCHEMA**

### Collections/Tables (Firestore)

```
WINERIES/
├── {winery_id}
│   ├── name: string
│   ├── owner_email: string
│   ├── logo_url: string (Firebase Storage)
│   ├── brand_colors: { primary, accent }
│   ├── website: string
│   ├── plan: "trial" | "pro" | "enterprise"
│   ├── monthly_emails_sent: number
│   ├── created_at: timestamp
│   ├── updated_at: timestamp
│   └── stripe_customer_id: string (for payments)
│
├── WINES/
│   └── {wine_id}
│       ├── winery_id: string (FK)
│       ├── name: string
│       ├── varietal: string (Shiraz, Chardonnay, etc.)
│       ├── year: number
│       ├── region: string
│       ├── description: string
│       ├── price: number (USD)
│       ├── shop_url: string (link to buy online)
│       └── flavor_profile: string[] (tags)
│
├── TASTINGS/
│   └── {tasting_id}
│       ├── winery_id: string (FK)
│       ├── date: timestamp
│       ├── wines: string[] (wine_ids in order)
│       ├── blind_order: number[] (randomized indices)
│       ├── status: "active" | "completed"
│       ├── participant_count: number
│       ├── created_by: string (staff email)
│       └── created_at: timestamp
│
├── TASTING_PARTICIPANTS/
│   └── {participant_id}
│       ├── tasting_id: string (FK)
│       ├── name: string
│       ├── email: string
│       ├── phone: string (optional)
│       ├── scores: { wine_id: rating (1-10) }
│       ├── flavor_tags: { wine_id: string[] }
│       ├── guesses: { wine_id: string }
│       ├── taste_profile: string (AI-generated)
│       ├── email_sent: boolean
│       ├── email_opened: boolean
│       ├── email_clicked: boolean
│       ├── recommended_wines: string[] (wine_ids)
│       └── created_at: timestamp
│
├── EMAILS_SENT/
│   └── {email_id}
│       ├── participant_id: string (FK)
│       ├── winery_id: string (FK)
│       ├── subject: string
│       ├── sent_at: timestamp
│       ├── opened_at: timestamp (nullable)
│       ├── clicked_at: timestamp (nullable)
│       ├── resend_id: string (Resend API tracking)
│       └── html_content: string
│
└── WINERY_USERS/
    └── {user_id}
        ├── winery_id: string (FK)
        ├── email: string
        ├── role: "owner" | "staff"
        ├── created_at: timestamp
        └── last_login: timestamp
```

### Indexes Needed
- TASTINGS: winery_id, status
- TASTING_PARTICIPANTS: tasting_id, email
- WINES: winery_id, varietal
- WINERY_USERS: winery_id, email

---

## **7. API ENDPOINTS**

### Authentication
```
POST /auth/signup
  { email, password, winery_name, owner_name }
  → { winery_id, auth_token }

POST /auth/login
  { email, password }
  → { auth_token, winery_id }

POST /auth/verify-email
  { email, code }
  → { success: true }

POST /auth/password-reset
  { email }
  → { success: true }
```

### Winery Management
```
GET /winery/profile
  → { winery_id, name, logo_url, colors, plan, etc. }

PUT /winery/profile
  { name, logo_url, colors, website }
  → { success: true }

POST /winery/upload-logo
  FormData: file
  → { logo_url }

GET /winery/wines
  → { wines: [...] }

POST /winery/wines
  { name, varietal, year, region, price, flavor_profile[] }
  → { wine_id }

PUT /winery/wines/{wine_id}
  { name, varietal, year, price, ... }
  → { success: true }

DELETE /winery/wines/{wine_id}
  → { success: true }

POST /winery/wines/import
  FormData: csv_file
  → { imported_count: number }
```

### Tasting Management
```
POST /tasting/create
  { wine_ids, date, created_by }
  → { tasting_id, qr_code_url }

GET /tasting/{tasting_id}
  → { tasting details, wines, participant_count, scores }

PUT /tasting/{tasting_id}
  { status: "active" | "completed" }
  → { success: true }

DELETE /tasting/{tasting_id}
  → { success: true }

GET /tasting/{tasting_id}/qr-code
  → { qr_code_svg, qr_code_text (for printing) }

GET /tasting/{tasting_id}/live-results
  → { wines: [ { wine_id, avg_score, participant_count }, ... ] }
  (WebSocket for real-time: /ws/tasting/{tasting_id})
```

### Participant Scoring (Customer-Facing)
```
POST /participant/join
  { tasting_id }
  → { session_token, wines: [...], blind_order: [...] }

POST /participant/submit-score
  { tasting_id, wine_id, rating, flavor_tags[], guess }
  → { success: true }

POST /participant/finish
  { tasting_id, name, email, phone }
  → { taste_profile, recommended_wines, email_sent: true }

GET /participant/results/{participant_id}
  → { tasting_summary, taste_profile, recommended_wines }
```

### Analytics & Data Export
```
GET /winery/analytics
  { start_date, end_date }
  → { customers_count, avg_emails_per_tasting, top_wines, flavor_trends }

GET /winery/customers
  { tasting_id (optional), limit, offset }
  → { customers: [ { name, email, scores, taste_profile }, ... ] }

GET /winery/customers/export
  { format: "csv" | "json" }
  → CSV/JSON file download
```

### Email Automation (Internal)
```
POST /email/send-follow-up
  { participant_id, taste_profile, recommended_wines }
  → Resend API call, returns { success: true, resend_id }

GET /email/tracking/{resend_id}
  → { opened: boolean, clicked: boolean, clicked_links: [...] }
```

---

## **8. EMAIL AUTOMATION & TEMPLATES**

### Email 1: Post-Tasting (Immediate)

**Trigger:** Customer submits email + name after scoring

**Template:**
```html
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; }
    .header { background: {winery.brand_colors.primary}; color: white; padding: 20px; }
    .logo { max-width: 150px; }
    .content { padding: 20px; }
    .profile { background: #f5f5f5; padding: 15px; border-radius: 8px; margin: 20px 0; }
    .wine-rec { border: 1px solid #ddd; padding: 15px; margin: 10px 0; border-radius: 8px; }
    .cta-button { background: {winery.brand_colors.primary}; color: white; padding: 12px 20px; text-decoration: none; border-radius: 4px; }
  </style>
</head>
<body>
  <div class="header">
    <img src="{winery.logo_url}" class="logo" alt="{winery.name}">
    <h1>Thanks for Tasting with Us, {name}!</h1>
  </div>
  
  <div class="content">
    <h2>Your Tasting Results</h2>
    <p>Here are the wines you tasted and your ratings:</p>
    
    {for each wine in tasting}
      <p><strong>{wine.name}</strong> ({wine.year}): 
        <span style="font-size: 1.2em;">★★★★★ {score}/10</span>
      </p>
    {/for}
    
    <div class="profile">
      <h3>Your Taste Profile</h3>
      <p>{taste_profile_text}</p>
      <p>Favorite flavors: {top_flavor_tags}</p>
    </div>
    
    <h2>We Think You'll Love These</h2>
    <p>Based on your tasting, we recommend:</p>
    
    {for each wine in recommended_wines[1..3]}
      <div class="wine-rec">
        <h3>{wine.name} ({wine.year})</h3>
        <p>{wine.description}</p>
        <p>Why: {recommendation_reason}</p>
        <a href="{wine.shop_url}" class="cta-button">Order Online</a>
      </div>
    {/for}
    
    <h3>Join Our Wine Club</h3>
    <p>Enjoy exclusive monthly selections tailored to your palate.</p>
    <a href="{winery.wine_club_url}" class="cta-button">Learn More</a>
    
    <hr>
    <p style="font-size: 0.9em; color: #666;">
      Questions? Reply to this email or visit {winery.website}
    </p>
  </div>
</body>
</html>
```

### Email 2: Reminder (1 Week After)

**Trigger:** Automated, 7 days post-tasting

**Subject:** "Remember that Shiraz you loved? It's still on sale"

**Content:** Highlights highest-rated wine, offers limited-time discount code

### Email 3: New Vintage (1 Month After)

**Trigger:** Automated, 30 days post-tasting (only if new vintage released)

**Subject:** "New vintage of your favorite [wine]"

### Email 4: Wine Club (Quarterly)

**Trigger:** Automated, quarterly

**Subject:** "Your curated wine selection this quarter"

---

## **9. UI/UX REQUIREMENTS**

### Design System

**Colors:**
- Primary: Deep Burgundy (#5A1C4A)
- Accent: Gold (#D4AF37)
- Neutral: White, Light Gray (#F5F5F5), Dark Gray (#333)
- Status: Green (#22C55E) for success, Red (#EF4444) for error

**Typography:**
- Heading: Inter Bold 24px
- Body: Inter Regular 16px
- Small: Inter Regular 14px

**Spacing:** 16px base unit (8px, 16px, 24px, 32px, 48px)

**Border Radius:** 8px (cards, buttons), 4px (inputs)

### Winery Login Page
- Email + password fields
- "Forgot password?" link
- "Sign up" CTA
- Responsive (mobile-first)

### Winery Dashboard
- Header: Winery logo, "Welcome back, Lisa", profile menu
- Main nav: Dashboard | Tastings | Customers | Analytics | Settings
- Dashboard card grid:
  - Active tastings (count)
  - Customers this month
  - Avg wine score
  - Emails captured
  - Revenue from follow-ups (if tracked)

### Create Tasting Screen
- Select wines (dropdown + multi-select)
- Date/time picker
- "Generate QR Code" button
- QR code preview (print-friendly)
- "Start Tasting" button

### Real-Time Staff Dashboard (iPad)
- Full-screen QR code display (for table)
- Live leaderboard (wines + avg scores)
- "End Tasting" button (prominent)
- Participant count

### Customer Scoring (Mobile)
- Full-screen, single wine per page
- Large slider (1-10)
- Flavor tag buttons (spicy, fruity, dry, etc.)
- "Next" button (right arrow or button)
- Progress indicator (1 of 3)

### Results Card
- Winery branding (logo, colors)
- Customer name
- Wine ratings (card per wine)
- Taste profile (highlighted)
- Recommendation cards (wine + CTA link)
- Share buttons (email, text, Instagram, print)

### Analytics Dashboard
- Chart: Avg wine score (line chart, last 30 days)
- Leaderboard: Top 5 wines (bar chart)
- Flavor trends: Word cloud or tag list
- Email engagement: Open rate, click rate

### Email List / CSV Export
- Table: Name, Email, Tasting Date, Scores
- Search/filter
- "Download CSV" button
- Bulk actions (mark contacted, delete)

---

## **10. MONETIZATION & BUSINESS MODEL**

### Personal Tier (D2C)

**Free:**
- Up to 4 participants per tasting
- Basic results display
- Lightweight ad banner (wine retailers, clubs)
- No email export

**One-Time Purchase: $9.99**
- Unlimited participants
- AI taste profile breakdown
- Export results (PDF, CSV)
- No ads
- Lifetime access

**Revenue model:**
- Stripe transaction: $9.99 × 2.2% + $0.30 = $0.52 processing fee
- Net per purchase: ~$9.47
- Target: 50-100 purchases Year 1 = $500-1,000 revenue
- Ad revenue: ~$100-200/month at scale (secondary)

### Winery Tier (B2B)

**Free Trial:**
- 1 tasting/month
- Basic email capture
- Branded results
- 30-day trial (no CC required initially)

**Pro: $99/month (or $999/year, 15% discount)**
- Unlimited tastings
- Real-time staff dashboard
- Email capture + automation
- Branded results
- Basic analytics
- Priority support

**Enterprise: Custom ($500-2,000/month)**
- Multi-location management
- White-label branding
- API access + Zapier integration
- Custom email templates
- Advanced analytics
- Dedicated onboarding
- SLA support

**Revenue model:**
- Pro tier: 25-50 customers × $99/month = $2,500-5,000/month by end Q2
- Enterprise: 2-5 customers × $1,000/month = $2,000-5,000/month
- Churn: 10% /month (typical for SMB SaaS early stage)
- Stripe fee: 2.2% + $0.30 per transaction (credit card)
- Net margin: ~85-90% (after payment processing)

**Year 1 Projection:**
- Pro customers by end of year: 50-100
- Enterprise customers: 5-10
- **Annual Recurring Revenue (ARR):** $60,000-120,000

### Profitability

**Monthly Burn (Infrastructure):**
- Firebase (Firestore, Storage): $20-30/month
- Resend (email): $20/month
- Vercel (hosting): $20-50/month (or free tier initially)
- Monitoring/logs: $0-10/month
- **Total:** ~$70-110/month

**At 25 paying winery customers:**
- Revenue: 25 × $99 = $2,475/month
- Burn: $100/month
- **Profit: $2,375/month** (96% margin)

---

## **11. IMPLEMENTATION TIMELINE**

### Phase 1: Winery MVP (Weeks 1-2)

**Week 1:**
- [ ] Winery login + authentication (Firebase Auth)
- [ ] Winery profile setup (logo upload, colors, wine catalog)
- [ ] Create tasting session + QR code generation
- [ ] Reuse customer scoring UI from personal app

**Week 2:**
- [ ] Email capture modal + validation
- [ ] Resend API integration + email sending
- [ ] Wine recommendation engine (simple v1)
- [ ] Real-time staff dashboard (live results)
- [ ] Branded results card display
- [ ] Testing + bug fixes
- [ ] Deploy to Vercel

**Deliverable:** Winery MVP live, ready for beta testing

### Phase 2: Winery Beta (Weeks 3-4)

**Week 3:**
- [ ] Reach out to 5-10 Sydney region wineries
- [ ] Set up free trial (1 month, no CC)
- [ ] Onboarding calls (15-20 min each)
- [ ] Gather feedback on UX, pricing, features

**Week 4:**
- [ ] Iterate on feedback (quick bug fixes)
- [ ] Document case study (1-2 wineries)
- [ ] Create marketing materials (screenshots, demo video)
- [ ] Prepare cold email template for outreach

**Deliverable:** 5-10 beta users, 1-2 case studies, validated product-market fit

### Phase 3: Winery Sales Launch (Weeks 5-8)

**Week 5-6:**
- [ ] Research and list 50+ target wineries (Sydney, NSW, VIC, WA)
- [ ] Cold email outreach campaign (batch 1: 20 wineries)
- [ ] Track response rate + conversions
- [ ] Schedule demo calls

**Week 7-8:**
- [ ] Demo calls with interested wineries
- [ ] Negotiate pricing (mostly $99/month, some enterprise deals)
- [ ] Close 5-10 paying customers
- [ ] Onboard first paying customers
- [ ] Gather more testimonials

**Target:** 5-10 paying winery customers = $500-1,000 MRR

### Phase 4: Personal Tier Launch (Weeks 9-12)

**Week 9:**
- [ ] Deploy personal tier (free + $9.99 one-time)
- [ ] Create landing page (winenight.app)
- [ ] Marketing materials (product screenshots, demo videos)

**Week 10:**
- [ ] Reddit outreach (r/wine, r/WineLovers)
- [ ] Facebook wine groups (soft intro)
- [ ] Email personal network (50-100 people)

**Week 11:**
- [ ] ProductHunt launch (optional, high effort)
- [ ] Wine blog/newsletter sponsorships
- [ ] Monitor conversions, iterate

**Week 12:**
- [ ] Retrospective + planning
- [ ] Consolidate learnings
- [ ] Plan Q3 roadmap

**Target:** 500+ signups, 50-100 paid conversions = $500-1,000 one-time revenue

---

## **12. SUCCESS METRICS & KPIs**

### Winery Tier (Primary Focus)

**Acquisition:**
- [ ] Signups per week (target: 2-3 by week 8)
- [ ] Trial-to-paid conversion (target: 50%+ of trials convert)
- [ ] Customer acquisition cost (target: $0, organic sales)
- [ ] Demo call conversion (target: 20-30% of calls → paid)

**Activation:**
- [ ] Time to first tasting (target: <1 day after signup)
- [ ] Tastings per customer per month (target: 4-8)
- [ ] Emails captured per tasting (target: 80%+ of participants)

**Retention:**
- [ ] Monthly churn rate (target: <10% for winery tier)
- [ ] 30-day retention (target: >80%)
- [ ] Net retention rate (target: >100%, expansions + upsells)

**Revenue:**
- [ ] MRR (target: $500 by week 8, $2,500 by week 12)
- [ ] ARR (target: $30,000 by end Q2)
- [ ] ARPU (target: $99/month base, $200+ with upsells)
- [ ] LTV:CAC ratio (target: >20:1, since CAC ≈ $0)

**Engagement:**
- [ ] Emails sent per customer per month (target: 30+)
- [ ] Email open rate (target: >30%)
- [ ] Email click-through rate (target: >10%)
- [ ] Post-visit purchase conversion (tracked via affiliate/integration, target: 12-15%)

### Personal Tier (Secondary)

**Acquisition:**
- [ ] Signups per week (target: 100+ by week 12)
- [ ] Conversion rate (free to paid, target: 10-15%)
- [ ] Cost per acquisition (target: <$2 via organic)

**Engagement:**
- [ ] Tastings per user (target: 1-2 per month)
- [ ] Shared results per tasting (target: 80%+)
- [ ] Return rate (target: 20%+ create another tasting)

**Revenue:**
- [ ] One-time purchases (target: 50-100 by end Q2)
- [ ] Revenue (target: $500-1,000)
- [ ] Ad impressions (target: 100k+)
- [ ] Ad revenue (target: $100-200/month)

---

## **13. TECHNICAL STACK & DEPENDENCIES**

### Frontend
- **Framework:** React 19 + Vite (existing)
- **State:** Context API or Zustand
- **Routing:** React Router v6
- **Styling:** Tailwind CSS
- **Components:** Shadcn/ui (pre-built components)
- **QR Code:** `qrcode.react` library
- **Charts:** `recharts` (for analytics)
- **Forms:** React Hook Form + Zod validation
- **Icons:** Lucide React (existing)
- **Animation:** Framer Motion (existing)

### Backend / API
- **Runtime:** Node.js (existing, if using Firebase Functions)
- **Database:** Firebase Firestore (existing)
- **Storage:** Firebase Storage (existing)
- **Auth:** Firebase Auth (existing)
- **Email:** Resend API (new, $20/month)
- **Payments:** Stripe API (new, 2.2% + $0.30/transaction)
- **Hosting:** Vercel (existing)

### New Dependencies to Install
```bash
npm install qrcode.react recharts react-hook-form zod resend stripe
```

### Environment Variables
```env
# Firebase
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_PROJECT_ID=...

# Resend (for email sending)
RESEND_API_KEY=...

# Stripe (for payments)
STRIPE_SECRET_KEY=...
STRIPE_PUBLISHABLE_KEY=...

# App
VITE_APP_URL=https://winenight.app
VITE_API_URL=https://api.winenight.app (or Firebase Functions)
```

### Optional: Backend Service (If Not Using Firebase Functions)
- **Framework:** Express.js or Next.js API routes
- **ORM:** Firestore SDK (direct)
- **Environment:** Node.js 18+
- **Deployment:** Vercel, AWS Lambda, or Railway

---

## **14. LAUNCH CHECKLIST**

### Pre-Launch (By End Week 2)

**Product:**
- [ ] Winery login fully functional
- [ ] Create tasting + QR code working
- [ ] Customer scoring experience complete
- [ ] Email capture + Resend sending working
- [ ] Results card displaying correctly
- [ ] Real-time staff dashboard live
- [ ] All features tested (no critical bugs)

**Marketing:**
- [ ] Domain registered (winenight.app)
- [ ] DNS configured + SSL certificate
- [ ] Landing page live (simple one-pager)
- [ ] Privacy policy + ToS drafted
- [ ] Email templates designed

**Operations:**
- [ ] Stripe account set up (webhook testing)
- [ ] Resend API key configured
- [ ] Firebase Firestore indexes created
- [ ] Error tracking (Sentry or equivalent)
- [ ] Analytics tracking (Plausible or Fathom)
- [ ] Support email (support@winenight.app)

**Team:**
- [ ] Developer (Codo) ready for production
- [ ] Matt ready for outreach + demos
- [ ] Beta test plan finalized

### Beta Launch (Week 3)

- [ ] Reach out to 5-10 wineries
- [ ] Set up free trial accounts
- [ ] Schedule onboarding calls
- [ ] Gather feedback + iterate

### Public Launch (Week 5)

- [ ] 50+ wineries identified for outreach
- [ ] Cold email template finalized
- [ ] Demo video / screenshot gallery ready
- [ ] Pricing page live
- [ ] Start outreach campaign

---

## **APPENDIX: FEATURE SUMMARY TABLE**

| Feature | P0 | Hours | Why Critical |
|---------|-----|-------|-------------|
| Winery login | ✅ | 5 | Access control |
| Create tasting | ✅ | 4 | Core workflow |
| QR code generation | ✅ | 3 | Frictionless join |
| Customer scoring | ✅ | 0 | Reuse from personal |
| Email capture | ✅ | 3 | Data collection |
| Resend integration | ✅ | 4 | Email automation |
| Taste profile generation | ✅ | 4 | Personalization |
| Wine recommendations | ✅ | 4 | Follow-up sales |
| Results card (branded) | ✅ | 4 | Professional output |
| Staff dashboard (real-time) | ✅ | 6 | Engagement tool |
| Basic analytics | ✅ | 3 | ROI proof |
| Customer data export | P1 | 3 | CRM integration |
| Drip campaigns | P1 | 5 | Retention |
| **TOTAL MVP** | | **48** | |

---

## **END OF SPEC**

**Document prepared:** 2026-03-22  
**Status:** Ready for development  
**Questions:** Contact Matt (implementation lead)

