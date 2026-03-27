# Fraud Risk Assessment App — Technical Brief for Codo

## Project Overview
Build a questionnaire → personalized risk assessment → CTA to download playbook ($299).

## User Flow
1. User lands on assessment page
2. Answers 6-7 questions (agency size, volume, experience, past incidents)
3. Gets instant risk assessment (top 3 fraud risks personalized to them)
4. CTA: Download playbook ($299) or email me results

## Tech Stack (Minimal, Fast)

### Option 1: Typeform + No-Code (Simplest)
- Use Typeform for questionnaire
- Typeform conditional logic for personalized results
- Email results to user
- Link to Gumroad purchase on results page
- **Timeline: 2-3 hours**
- **Pros: Zero coding, works immediately**
- **Cons: Less customizable**

### Option 2: Simple Web App (Recommended)
- Frontend: Vue.js or React (simple form)
- Scoring logic: JavaScript (in browser)
- Results: Display dynamically, then email option
- **Timeline: 6-8 hours**
- **Pros: Full control, branded, can collect email**

### Option 3: Full Stack (Over-engineered)
- Skip this one.

## Recommendation
**Start with Option 1 (Typeform).** Fast, works, can upgrade later if needed.

If upgrading to Option 2:
- Simple Vue app (form + scoring + results display)
- Node.js backend (optional, just for email if needed)
- Deploy to Vercel/Netlify (free tier works)

---

## Questionnaire Structure

**6 questions:**

1. **Agency size?**
   - 1-5 agents
   - 6-20 agents
   - 20+ agents

2. **Average monthly transaction volume?**
   - Under $100k
   - $100k-$500k
   - $500k+

3. **Primary focus?**
   - Rentals
   - Sales
   - Both equally

4. **Team fraud training?**
   - None/minimal
   - Some training in place
   - Robust fraud protocols

5. **Fraud incidents in past 2 years?**
   - No
   - Yes (caught in time)
   - Yes (money lost)

6. **Email (for results)? [Optional input field]**

---

## Scoring Logic

Based on responses, assign fraud risk scores:

**Wire fraud risk:**
- High: Large agency + high volume + no training
- Medium: Medium agency + any volume
- Low: Small agency + training

**Invoice fraud risk:**
- High: Any size + no training
- Medium: With some training
- Low: Robust protocols in place

**Account takeover risk:**
- High: Low tech proficiency
- Medium: Medium tech proficiency
- Low: High tech proficiency

**Output: Top 3 risks** (ordered by their specific profile)

---

## Results Page

Show:
- "Based on your responses, here are your top 3 fraud risks:"
- For each risk: 1-2 sentence explanation + severity badge (HIGH/MEDIUM/LOW)
- CTA: "Download the Playbook ($299)" [Gumroad link]
- Optional: "Email me the guide instead" [Capture email]

---

## Deliverables from Codo

1. Working assessment form (Typeform link OR simple web app)
2. Results page (shows personalized risks)
3. Landing page copy (1 simple page explaining the assessment)
4. Gumroad integration instructions (how to link results → purchase)

---

## Timeline
- **Week 1: Typeform version** (Matt launches this for cold outreach)
- **Week 2-3: Vue.js version** (if Typeform performance is good, can stay as-is)

---

## Matt's inputs for Codo
1. Which option? (Recommend: Typeform first, Vue.js if scaling)
2. Email for results capture? (Yes/no)
3. Landing page domain/hosting? (Can use free Vercel + custom domain)
4. Gumroad account ready? (For purchase link)

---

## Next Steps
1. Codo: Confirm approach (Typeform vs. Vue.js)
2. Matt: Write playbook content in parallel
3. Both: Launch assessment + playbook together in Week 1-2
