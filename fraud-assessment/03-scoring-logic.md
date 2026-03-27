# Scoring Logic Reference

This document defines the exact scoring rules for the fraud risk assessment.

---

## Question Mapping

| Q# | Question | Answers | Point Values |
|----|----------|---------|--------------|
| 1 | Agency size | 1-5, 6-20, 20+ | 1, 2, 3 |
| 2 | Monthly volume | <$100k, $100k-$500k, $500k+ | 1, 2, 3 |
| 3 | Primary focus | Rentals, Sales, Both | N/A (context) |
| 4 | Training level | None, Some, Robust | 3, 2, 1 |
| 5 | Fraud incidents | No, Yes/caught, Yes/lost money | 1, 2, 3 |
| 6 | Email | Text | user_email |

---

## Risk Scoring Rules

### Wire Fraud Risk

**HIGH:** Large/medium agency + High transaction volume + Weak training
- Logic: `(Q1 ≥ 2) AND (Q2 ≥ 2) AND (Q4 ≥ 2)` → Score = 3
- Explanation: Large agencies handling high transaction volumes with minimal training are prime targets.

**MEDIUM:** Either agency size OR transaction volume is high, but training is present
- Logic: `((Q1 ≥ 2 OR Q2 ≥ 2) AND (Q4 < 3)) AND NOT HIGH` → Score = 2
- Explanation: Some risk factors present, but training/protocols partially mitigate.

**LOW:** Small agency or strong training
- Logic: `NOT (MEDIUM OR HIGH)` → Score = 1
- Explanation: Limited exposure or strong controls in place.

**Typeform formula:**
```
IF(AND(Q1_size>=2, Q2_volume>=2, Q4_training>=2), 3, IF(AND(OR(Q1_size>=2, Q2_volume>=2), Q4_training<3), 2, 1))
```

**Risk explanation (HIGH):**
"Large transactions + high volume + limited training = easy target for wire fraud. Implement multi-step verification and staff training immediately."

**Risk explanation (MEDIUM):**
"Moderate size or transaction volume + some training = manageable risk. Strengthen verification protocols and audit staff training annually."

**Risk explanation (LOW):**
"Small agency or robust training = lower risk. Maintain current protocols and continue staff awareness training."

---

### Invoice Fraud Risk

**HIGH:** No or minimal fraud training (applies to ANY agency size)
- Logic: `Q4_training ≥ 2` → Score = 3
- Explanation: Invoice fraud doesn't discriminate by agency size. Any team without training is vulnerable.

**MEDIUM:** Some fraud training present
- Logic: `Q4_training = 2` → Score = 2
- Explanation: Some awareness/protocols, but not comprehensive.

**LOW:** Robust fraud training & protocols
- Logic: `Q4_training = 1` → Score = 1
- Explanation: Strong training program in place.

**Typeform formula:**
```
IF(Q4_training>=2, 3, IF(Q4_training=2, 2, 1))
```

**Risk explanation (HIGH):**
"Invoicing systems are easy targets without proper controls. Implement email verification protocols and train all staff on spotting fake invoices."

**Risk explanation (MEDIUM):**
"Basic awareness exists, but enforced controls may be weak. Audit your email verification process monthly."

**Risk explanation (LOW):**
"Strong protocols in place. Continue monthly training and incident reviews."

---

### Account Takeover Risk

**HIGH:** Weak training + History of fraud incidents
- Logic: `(Q4_training ≥ 2) OR (Q5_incidents ≥ 2)` → Score = 3
- Explanation: Poor password practices + past incidents = high risk for ATO.

**MEDIUM:** Moderate training or some incident history
- Logic: `(Q4_training = 2 OR Q5_incidents = 2) AND NOT HIGH` → Score = 2
- Explanation: Some mitigating factors, but vulnerabilities remain.

**LOW:** Strong training + No incident history
- Logic: `NOT (MEDIUM OR HIGH)` → Score = 1
- Explanation: Strong controls and clean history.

**Typeform formula:**
```
IF(OR(Q4_training>=2, Q5_incidents>=2), 3, IF(OR(Q4_training=2, Q5_incidents=2), 2, 1))
```

**Risk explanation (HIGH):**
"Weak authentication + past incidents = staff accounts are vulnerable. Implement MFA, enforce strong passwords, and audit access logs weekly."

**Risk explanation (MEDIUM):**
"Moderate risk. Deploy MFA for key staff and review access controls quarterly."

**Risk explanation (LOW):**
"Strong controls in place. Maintain MFA and continue annual audits."

---

## Sorting the Top 3 Risks

After calculating all three scores, rank them:

1. **Highest score** → Risk #1
2. **Second highest** → Risk #2
3. **Third highest** → Risk #3

(Ties: Wire Fraud > Invoice Fraud > Account Takeover)

---

## Results Page Display

**Template:**

```
Based on your responses, here are your top 3 fraud risks:

[RISK #1]
🔴 HIGH / 🟡 MEDIUM / 🟢 LOW: [Risk Name]
[1-2 sentence explanation]

[RISK #2]
🔴 HIGH / 🟡 MEDIUM / 🟢 LOW: [Risk Name]
[1-2 sentence explanation]

[RISK #3]
🔴 HIGH / 🟡 MEDIUM / 🟢 LOW: [Risk Name]
[1-2 sentence explanation]

---

Ready to protect your agency?

👉 DOWNLOAD PLAYBOOK ($299)
Get step-by-step prevention protocols, training scripts, and incident response templates.

[OPTIONAL EMAIL SIGNUP]
Want tips delivered to your inbox?
📧 [Email field]
```

---

## Verification Examples

### Example 1: Large, High-Volume, No Training
- Q1: 20+ agents → 3
- Q2: $500k+ → 3
- Q4: None → 3
- Q5: No → 1

**Scores:**
- Wire Fraud: `(3 ≥ 2 AND 3 ≥ 2 AND 3 ≥ 2)` = **HIGH (3)**
- Invoice Fraud: `(3 ≥ 2)` = **HIGH (3)**
- Account Takeover: `(3 ≥ 2 OR 1 ≥ 2)` = **HIGH (3)**
- **Result:** All three HIGH — Training is critical.

### Example 2: Small, Low Volume, Robust Training
- Q1: 1-5 agents → 1
- Q2: <$100k → 1
- Q4: Robust → 1
- Q5: No → 1

**Scores:**
- Wire Fraud: `NOT (1 ≥ 2 AND 1 ≥ 2 AND 1 ≥ 2)` = **LOW (1)**
- Invoice Fraud: `NOT (1 ≥ 2)` = **LOW (1)**
- Account Takeover: `NOT (1 ≥ 2 OR 1 ≥ 2)` = **LOW (1)**
- **Result:** All three LOW — Minimal risk.

### Example 3: Medium, Medium Volume, Some Training, Past Incident
- Q1: 6-20 agents → 2
- Q2: $100k-$500k → 2
- Q4: Some → 2
- Q5: Yes/caught → 2

**Scores:**
- Wire Fraud: `(2 ≥ 2 AND 2 ≥ 2 AND 2 ≥ 2)` = **HIGH (3)**
- Invoice Fraud: `(2 ≥ 2)` = **HIGH (3)**
- Account Takeover: `(2 ≥ 2 OR 2 ≥ 2)` = **HIGH (3)**
- **Result:** All three HIGH — Multiple risk factors present.

---

## Implementation Notes

### For Typeform
- Create three **Calculation** fields named:
  - `wire_fraud_score`
  - `invoice_fraud_score`
  - `account_takeover_score`
- Use the formulas above
- Display on results page using conditional logic

### For Custom App (if Vue.js later)
- Load Q1-Q5 values
- Run three scoring functions
- Sort by score
- Display top 3 with explanations & badges
- Link to Gumroad

---

## Scoring Assumptions

1. **Training is the strongest mitigator** — No training = HIGH risk for invoice fraud (any size)
2. **Size + Volume = Wire Fraud exposure** — Large agencies + high volume + no training = critical risk
3. **Account Takeover correlates with training + incident history** — Past incidents suggest weak controls
4. **All risks are actionable** — No "CRITICAL" tier; agencies can address HIGH-level risks within weeks

---

## Future Refinements

- Add "tech proficiency" question to refine Account Takeover scoring
- Track conversion rate: Quiz → Playbook purchase
- A/B test risk explanations for higher engagement
- Segment playbook recommendations by agency size

---

## Checklist for Implementation

- [ ] Typeform scoring formulas entered correctly
- [ ] All three calculation fields configured
- [ ] Results page displays top 3 risks with badges
- [ ] Risk explanations match this document
- [ ] Test with example inputs above
- [ ] Verify CTA link to Gumroad works
- [ ] Email template populated with results variables
