# Gumroad Integration Guide - $299 Playbook

## Overview

Gumroad handles payment processing and playbook delivery. We'll create a product that:
1. Charges $299 (or one-time payment)
2. Delivers a PDF playbook instantly
3. Integrates with Typeform results page

---

## Step 1: Create Gumroad Product

1. Go to [gumroad.com](https://gumroad.com) → **Create new product**
2. **Product name:** "Real Estate Fraud Prevention Playbook"
3. **Price:** $299 (one-time purchase)
4. **Type:** Digital product (PDF)

---

## Step 2: Create/Prepare the Playbook PDF

This is the deliverable. Structure:

```
Real Estate Fraud Prevention Playbook ($299 Value)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. EXECUTIVE SUMMARY (1 page)
   - Overview of top 3 fraud vectors for real estate
   - Why this matters (data on losses)
   - How to use this playbook

2. WIRE FRAUD PREVENTION (3 pages)
   - What is wire fraud in real estate? (case study)
   - Red flags to watch
   - Prevention checklist
   - Staff training script

3. INVOICE FRAUD PREVENTION (3 pages)
   - Common invoice fraud tactics
   - Verification procedures
   - Control checklist
   - Email security protocols

4. ACCOUNT TAKEOVER PREVENTION (3 pages)
   - Why agents are targets
   - Multi-factor authentication setup guide
   - Password policy template
   - Incident response steps

5. TEAM TRAINING MATERIALS (4 pages)
   - 30-min training script
   - Slide deck talking points
   - Monthly awareness calendar
   - Fraud reporting form

6. INCIDENT RESPONSE PLAYBOOK (2 pages)
   - Step-by-step response protocol
   - Notification templates
   - Law enforcement contact info
   - Recovery checklist

7. TEMPLATES & CHECKLISTS (4 pages)
   - Email verification script
   - Staff training sign-off form
   - Incident report form
   - Monthly audit checklist

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Total: ~20 pages | Updated: 2026
```

**Create this PDF and save as:** `fraud-playbook.pdf`

---

## Step 3: Upload to Gumroad

1. In product editor, scroll to **Product files**
2. Click **Add file** → Upload `fraud-playbook.pdf`
3. This is what customers receive after purchase

---

## Step 4: Configure Product Settings

**Details tab:**
- License key: Optional (if you want to track licenses)
- Give access instantly: ✅ (auto-deliver PDF)
- Require customer name: Optional
- Require customer email: ✅ (for your CRM)

**Pricing:**
- Price: $299 (USD or your currency)
- License type: One-time purchase
- Variants: None (single price)

**Product description:**
```
Real Estate Fraud Prevention Playbook

Protect your agency from wire fraud, invoice fraud, and account takeover.

This actionable guide includes:
✓ Risk assessment for your agency size
✓ Step-by-step prevention protocols
✓ Staff training scripts & materials
✓ Incident response playbook
✓ Ready-to-use checklists & templates

Written for real estate agents by fraud prevention experts.
```

---

## Step 5: Get Your Gumroad Link

Once product is live:
1. Copy the public product link (e.g., `https://gumroad.com/l/fraud-playbook`)
2. **Keep this handy** — you'll add it to:
   - Typeform results page
   - Landing page CTA
   - Email confirmation

---

## Step 6: Typeform Integration

Go back to your Typeform (from `01-typeform-setup.md`):

1. **Results page → CTA button**
2. Link text: "Download Playbook ($299)"
3. Link URL: Paste your Gumroad link
4. Set to open in **new tab**

---

## Step 7: Track Sales

Gumroad dashboard shows:
- Sales count
- Revenue
- Customer list (name + email)
- Product performance

**Optional:** Export customer list for your CRM/email list.

---

## Advanced: Email Integration (Optional)

If you want to capture emails from Typeform AND Gumroad:

**Option A: Zapier workflow**
1. Trigger: Typeform response submitted
2. Action: Save to Google Sheets or CRM
3. Later: Export Gumroad customers to same sheet

**Option B: Manual export**
- Export Typeform responses → CSV
- Export Gumroad customers → CSV
- Merge in your CRM

---

## Checklist

- [ ] Fraud Prevention Playbook PDF created (20+ pages)
- [ ] Gumroad account active
- [ ] Product created & uploaded
- [ ] Price set to $299
- [ ] Description written
- [ ] Public link copied
- [ ] Link added to Typeform results page
- [ ] Test: Complete quiz → See results → Click Gumroad link → Verify page loads
- [ ] Product published & live

---

## Product Links

Once live, you'll have:
- **Typeform quiz:** `https://typeform.com/to/xxxxxxxxx`
- **Gumroad playbook:** `https://gumroad.com/l/fraud-playbook` (or custom URL)
- **Landing page:** Next (see `landing-page.html`)

---

## Next Step

Move to landing page setup (`landing-page.html`).
