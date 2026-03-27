# Deployment Checklist - Fraud Risk Assessment Tool

## 🚀 Go-Live Checklist

Follow this in order. Estimated time: 2-3 hours.

---

## Phase 1: Create the Typeform (30-45 min)

- [ ] Create Typeform account at typeform.com
- [ ] Create new form: "Real Estate Fraud Risk Assessment"
- [ ] Add Question 1: Agency size (1-5, 6-20, 20+)
  - [ ] Assign points: 1, 2, 3
- [ ] Add Question 2: Monthly volume (<$100k, $100k-$500k, $500k+)
  - [ ] Assign points: 1, 2, 3
- [ ] Add Question 3: Primary focus (Rentals, Sales, Both)
- [ ] Add Question 4: Training level (None, Some, Robust)
  - [ ] Assign points: 3, 2, 1
- [ ] Add Question 5: Past incidents (No, Yes/caught, Yes/lost money)
  - [ ] Assign points: 1, 2, 3
- [ ] Add Question 6: Email (optional text field)
- [ ] Create Calculation field: wire_fraud_score
  - [ ] Formula: `IF(AND(Q1≥2, Q2≥2, Q4≥2), 3, IF(AND(OR(Q1≥2, Q2≥2), Q4<3), 2, 1))`
- [ ] Create Calculation field: invoice_fraud_score
  - [ ] Formula: `IF(Q4≥2, 3, IF(Q4=2, 2, 1))`
- [ ] Create Calculation field: account_takeover_score
  - [ ] Formula: `IF(OR(Q4≥2, Q5≥2), 3, IF(OR(Q4=2, Q5=2), 2, 1))`
- [ ] Create Results page with:
  - [ ] Display top 3 risks based on scores
  - [ ] Show risk name + severity badge
  - [ ] Add 1-2 sentence explanation for each
  - [ ] Add CTA button: "Download Playbook ($299)" (link pending)
- [ ] Configure email notifications (optional)
- [ ] Test form with sample inputs (use examples from 03-scoring-logic.md)
- [ ] Publish form
- [ ] Copy public link: `https://typeform.com/to/XXXXXXXXX`

---

## Phase 2: Create Gumroad Product (30-45 min)

### 2a: Create Playbook PDF
- [ ] Open Word/Google Docs
- [ ] Create PDF outline:
  - [ ] Executive Summary (1 page)
  - [ ] Wire Fraud Prevention (3 pages)
  - [ ] Invoice Fraud Prevention (3 pages)
  - [ ] Account Takeover Prevention (3 pages)
  - [ ] Team Training Materials (4 pages)
  - [ ] Incident Response Playbook (2 pages)
  - [ ] Templates & Checklists (4 pages)
- [ ] Write content for each section
- [ ] Export as PDF: `fraud-playbook.pdf`
- [ ] Quality check: 20+ pages, professional formatting

### 2b: Upload to Gumroad
- [ ] Create Gumroad account at gumroad.com
- [ ] Create new product
- [ ] Product details:
  - [ ] Name: "Real Estate Fraud Prevention Playbook"
  - [ ] Price: $299 (one-time)
  - [ ] Type: Digital product
- [ ] Upload `fraud-playbook.pdf`
- [ ] Configure settings:
  - [ ] License key: Optional
  - [ ] Give access instantly: ✅
  - [ ] Require email: ✅
- [ ] Write product description (see 02-gumroad-integration.md)
- [ ] Publish product
- [ ] Copy public link: `https://gumroad.com/l/XXXXXX`

---

## Phase 3: Deploy Landing Page (15 min)

- [ ] Download `landing-page.html` from this folder
- [ ] Replace `https://typeform.com/to/REPLACE_WITH_YOUR_TYPEFORM_ID` with actual Typeform link (2 places)
- [ ] Update `fraud-playbook` Gumroad link if needed
- [ ] Choose hosting:
  - [ ] **Option A:** Netlify (drag & drop, free)
    - [ ] Go to netlify.com → Drag & drop `landing-page.html`
    - [ ] Get public URL
  - [ ] **Option B:** Your own domain
    - [ ] Upload to web host
    - [ ] Point domain DNS to hosting
  - [ ] **Option C:** Vercel (GitHub integration)
    - [ ] Push to GitHub
    - [ ] Connect Vercel
    - [ ] Deploy
- [ ] Test landing page:
  - [ ] All CTAs point to Typeform
  - [ ] Typeform quiz works
  - [ ] Results show properly
  - [ ] "Download Playbook" button links to Gumroad
  - [ ] Gumroad purchase flow works
- [ ] Copy landing page URL: `https://your-domain.com` or `https://your-site.netlify.app`

---

## Phase 4: Test End-to-End (15 min)

**Test User Flow:**
1. [ ] Visit landing page
2. [ ] Click "Start Assessment"
3. [ ] Complete all 6 questions
4. [ ] See results with top 3 risks
5. [ ] Click "Download Playbook" button
6. [ ] Land on Gumroad product page
7. [ ] Complete purchase flow (test payment)
8. [ ] Receive playbook PDF via Gumroad
9. [ ] (Optional) Verify email with results arrives

**Verify Each Integration:**
- [ ] Landing page → Typeform quiz link works
- [ ] Typeform → Scoring logic displays correct risks
- [ ] Typeform → Results page shows all 3 risks with badges
- [ ] Typeform → "Download Playbook" CTA links to Gumroad
- [ ] Gumroad → Product page displays correctly
- [ ] Gumroad → Purchase flow completes
- [ ] Gumroad → Customer receives PDF

---

## Phase 5: Go Live (5 min)

- [ ] **Landing page:** Share link with Matt
- [ ] **Typeform:** Verify it's public (anyone with link can access)
- [ ] **Gumroad:** Verify product is published (anyone can see & buy)
- [ ] Set up tracking (optional):
  - [ ] Typeform form analytics
  - [ ] Gumroad sales dashboard
  - [ ] Google Analytics on landing page (add GA snippet if desired)
- [ ] Share with first users/beta testers
- [ ] Monitor:
  - [ ] Form completion rate
  - [ ] Playbook conversion rate
  - [ ] Customer feedback

---

## Phase 6: Post-Launch (Optional Enhancements)

After day 1:

### Email Capture
- [ ] Set up Zapier/Make workflow:
  - [ ] Trigger: Typeform response submitted
  - [ ] Action: Save to Google Sheets or email list
- [ ] Export Gumroad customers regularly
- [ ] Build email list for future marketing

### Analytics & Iteration
- [ ] Review Typeform analytics: Which questions get most variation?
- [ ] Review Gumroad sales: Conversion rate = sales / completions
- [ ] Gather feedback: Add "feedback" email to results page
- [ ] A/B test CTA copy if conversion is low

### Refine Scoring (if needed)
- [ ] Are the top risks aligned with actual user concerns?
- [ ] Should Account Takeover weight tech proficiency more?
- [ ] Should training be MORE heavily weighted?
- [ ] Adjust formulas in 03-scoring-logic.md and redeploy

---

## File Structure (for Reference)

```
fraud-assessment/
├── README.md                          ← Start here
├── 01-typeform-setup.md               ← Typeform guide
├── 02-gumroad-integration.md          ← Gumroad guide
├── 03-scoring-logic.md                ← Scoring formulas & examples
├── landing-page.html                  ← Deploy this
├── DEPLOYMENT.md                      ← You are here
└── fraud-playbook.pdf                 ← Create this (20+ pages)
```

---

## Quick Links (After Deployment)

Once live, you'll have three public URLs:

1. **Landing page:** `https://your-domain.com`
2. **Typeform quiz:** `https://typeform.com/to/XXXXXXXXX`
3. **Gumroad playbook:** `https://gumroad.com/l/XXXXXX`

Share the **landing page URL** with users. It handles the rest.

---

## Troubleshooting

### Typeform questions
- Use Typeform's chat support or docs at typeform.com/help
- Formula syntax: Check 03-scoring-logic.md for exact formulas

### Gumroad issues
- Product not showing? Verify it's published (not in draft)
- Payment not working? Check Gumroad account is verified
- PDF not delivered? Verify PDF file is attached to product

### Landing page not loading?
- Check HTML file encoding (UTF-8)
- Verify all links are correct
- Check browser console for JS errors

### Low conversion?
- Test the full flow yourself
- Check CTA button colors/placement
- Review risk explanations for clarity
- Gather user feedback

---

## Success Metrics (First Week)

- [ ] Landing page: 10+ visits
- [ ] Typeform: 2+ quiz completions
- [ ] Gumroad: 1+ playbook sale
- [ ] Form completion rate: >50%
- [ ] Quiz to Gumroad click rate: >80%
- [ ] Customer satisfaction: Ask via email

---

## Final Approval Checklist

Before declaring "LIVE":

- [ ] All links tested and working
- [ ] Typeform scores calculate correctly
- [ ] Gumroad payment processes
- [ ] Playbook PDF delivered
- [ ] No broken images or formatting
- [ ] Mobile responsive (tested on phone)
- [ ] Matt has reviewed and approved

---

## Support & Iteration

After launch, Matt will iterate on:
- Risk explanations (if they need more detail)
- Playbook content (add/remove sections)
- Scoring weights (if risks don't feel right)
- Email templates (if follow-up emails added)

Keep this file updated as you make changes. Future deployments = rinse and repeat.

---

**You're ready. Let's go live! 🚀**
