# Typeform Setup Guide - Fraud Risk Assessment

## Overview

Typeform will be our quiz delivery engine. We'll use Typeform's built-in logic (branching + calculations) to score responses and show results.

**Why Typeform?** No coding needed, visual conditional logic, form-to-email integration, and results page customization out of the box.

---

## Step 1: Create the Typeform

1. Go to [typeform.com](https://typeform.com) → **Create a new form**
2. Name it: `Real Estate Fraud Risk Assessment`
3. Description: `Discover your top fraud risks in 2 minutes`

---

## Step 2: Add the 6 Questions

### Question 1: Agency Size (Multiple Choice)
**Question:** "How many agents are in your agency?"
- 1-5 agents
- 6-20 agents
- 20+ agents

**Assign points:**
- 1-5 agents = size_score: 1
- 6-20 agents = size_score: 2
- 20+ agents = size_score: 3

### Question 2: Monthly Transaction Volume (Multiple Choice)
**Question:** "What's your approximate monthly transaction volume?"
- Under $100k
- $100k-$500k
- $500k+

**Assign points:**
- Under $100k = volume_score: 1
- $100k-$500k = volume_score: 2
- $500k+ = volume_score: 3

### Question 3: Primary Focus (Multiple Choice)
**Question:** "What's your primary focus?"
- Rentals
- Sales
- Both

**Note:** This is context, not directly scored (used for risk weighting)

### Question 4: Team Fraud Training (Multiple Choice)
**Question:** "How would you rate your team's fraud training?"
- None
- Some (basic awareness)
- Robust (regular training & protocols)

**Assign points:**
- None = training_score: 3
- Some = training_score: 2
- Robust = training_score: 1

### Question 5: Past Fraud Incidents (Multiple Choice)
**Question:** "Have you experienced fraud incidents in the past 2 years?"
- No
- Yes, but we caught it
- Yes, and we lost money

**Assign points:**
- No = incident_score: 1
- Yes/caught = incident_score: 2
- Yes/lost money = incident_score: 3

### Question 6: Email (Short Text - Optional)
**Question:** "Want results emailed to you? (optional)"
- Optional email field
- Store as `user_email`

---

## Step 3: Scoring Logic (Typeform Calculations)

Typeform's **Calculations** feature lets us compute risk scores. Use this order:

### 3a. Wire Fraud Score
**Wire Fraud Logic:**
- HIGH: (size_score ≥ 2 AND volume_score ≥ 2 AND training_score ≥ 2)
- MEDIUM: (size_score ≥ 2 OR volume_score ≥ 2) AND NOT HIGH
- LOW: Everything else

**Typeform setup:** Create a **Calculation** field:
```
IF(AND(Q1≥2, Q2≥2, Q4≥2), 3, IF(OR(AND(Q1≥2, Q4<3), AND(Q2≥2, Q4<3)), 2, 1))
```
*Save as: wire_fraud_score*

### 3b. Invoice Fraud Score
**Invoice Fraud Logic:**
- HIGH: training_score ≥ 2 (any agency size without training is vulnerable)
- MEDIUM: training_score = 2
- LOW: training_score = 1

**Typeform setup:**
```
IF(Q4≥2, 3, IF(Q4=2, 2, 1))
```
*Save as: invoice_fraud_score*

### 3c. Account Takeover Score
**Account Takeover Logic:**
- For now, assume correlation with training + incident history
```
IF(OR(Q4≥2, Q5≥2), 3, IF(OR(Q4=2, Q5=2), 2, 1))
```
*Save as: account_takeover_score*

---

## Step 4: Results Page Logic

After Question 6, add a **Hidden Field** or use Typeform's **Calculation Summary** to display:

1. **Show Top 3 Risks** based on highest scores
2. **Each risk includes:**
   - Risk name (Wire Fraud, Invoice Fraud, Account Takeover)
   - Severity badge (HIGH/MEDIUM/LOW based on score)
   - 1-2 sentence explanation
   - CTA: "Download Playbook ($299)" → Gumroad link

**Typeform's result text can use variables:**
```
Based on your responses, here are your top 3 fraud risks:

{{wire_fraud_score > 2 ? "🔴 HIGH: Wire Fraud - Large transactions + high volume + low training = easy target" : "🟡 MEDIUM: Wire Fraud" : "🟢 LOW: Wire Fraud"}}
```

---

## Step 5: Integrate Email Capture

**If user provided email:**
1. Use Typeform's **Email Notification** feature
2. Send custom email with results
3. Template includes playbook link + brief risk summary

**Setup:**
- Go to **Settings → Integrations → Email**
- Create notification: "Send me to..." → your email
- Template: `fraud-assessment-results.txt` (see below)

---

## Step 6: Add CTA & Gumroad Link

On the **results page** (final step), add:

**Button:** "Download Playbook ($299)"
→ Links to: `https://gumroad.com/YOUR-PRODUCT-ID`

**Note:** We'll create the Gumroad product in Step 2 (see `02-gumroad-integration.md`)

---

## Step 7: Test & Publish

1. **Test the form** with sample answers
2. **Check calculations** are working (scores appear correctly)
3. **Test email delivery** if email capture is enabled
4. **Publish** the form
5. Copy the public link (something like `https://typeform.com/to/xxxxxxxxx`)

---

## Email Template

Save this as `fraud-assessment-results.txt`:

```
Subject: Your Fraud Risk Assessment Results

Hi {{answers_3_email}},

Based on your responses, here are your top 3 fraud risks:

**{{wire_fraud_score}}** Wire Fraud
Large transactions combined with high volume and limited training make wire fraud your highest risk. Implement multi-step verification and staff training immediately.

**{{invoice_fraud_score}}** Invoice Fraud
Invoicing systems are easy targets without proper controls. Any agency size is vulnerable to compromised invoices being sent to customers.

**{{account_takeover_score}}** Account Takeover
Weak authentication and limited training increase risk of staff account compromise, leading to unauthorized transactions and data theft.

---

Ready to protect your agency?

👉 [Download Your Personalized Playbook ($299)](https://gumroad.com/YOUR-PRODUCT-ID)

The playbook includes:
- Specific fraud vectors for your agency size
- Step-by-step prevention protocols
- Training scripts for your team
- Incident response playbook

Questions? Reply to this email.

Best,
Real Estate Fraud Prevention Team
```

---

## Checklist

- [ ] Typeform created
- [ ] 6 questions added
- [ ] Calculation fields created (wire, invoice, account takeover scores)
- [ ] Results page configured
- [ ] Email capture enabled (optional)
- [ ] Gumroad link added
- [ ] Form tested end-to-end
- [ ] Form published
- [ ] Public link shared with Matt

---

## Next Step

Once Typeform is live, move to `02-gumroad-integration.md` to set up the playbook product.
