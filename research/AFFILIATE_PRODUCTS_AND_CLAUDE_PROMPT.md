# Affiliate Link Integration: Product List + Claude Code Prompt

## Part 1: Products in Scope (Sleep Tracking Fitness Bands Article)

### Your 5 Featured Products + ASINs

| # | Product Name | Price | ASIN | Amazon URL |
|---|--------------|-------|------|-----------|
| 1 | **WHOOP Band 4.0** | $30/mo | B0C5GH8L3N | https://amazon.com/dp/B0C5GH8L3N |
| 2 | **Oura Ring Gen 3** | $300 | B0BXKY9KBP | https://amazon.com/dp/B0BXKY9KBP |
| 3 | **Fitbit Sense 2** | $299 | B0B4NJKDRY | https://amazon.com/dp/B0B4NJKDRY |
| 4 | **Garmin Fenix 6X** | $600 | B0BXGLBPYB | https://amazon.com/dp/B0BXGLBPYB |
| 5 | **Apple Watch Series 8** | $399 | B0B4KDGGYJ | https://amazon.com/dp/B0B4KDGGYJ |

**Note:** Verify these ASINs on Amazon.com before using (ASINs can change if products are discontinued/updated)

---

## Part 2: How to Create Your Affiliate Links (5 minutes)

### Step-by-Step Link Creation

**Your Associate ID:** `strengthinsight-20` (example — use YOUR actual ID from Associates dashboard)

### For Each Product, Do This:

1. **Go to Amazon.com**
2. **Search for product name** (e.g., "WHOOP Band 4.0")
3. **Click the product page**
4. **Find the ASIN** (left sidebar, under product details)
   - Looks like: `B0C5GH8L3N`
5. **Verify this is the correct product** (check price, brand, reviews)
6. **Create your affiliate link:**
   ```
   https://www.amazon.com/dp/[ASIN]?tag=strengthinsight-20
   ```
   - Replace `[ASIN]` with the real ASIN
   - Replace `strengthinsight-20` with YOUR Associate ID

### Example: WHOOP Band 4.0
```
Base link: https://www.amazon.com/dp/B0C5GH8L3N
With your Associate ID: https://www.amazon.com/dp/B0C5GH8L3N?tag=strengthinsight-20
```

### Create All 5 Links Now

Replace `strengthinsight-20` with YOUR actual Associate ID in each:

1. **WHOOP:** `https://www.amazon.com/dp/B0C5GH8L3N?tag=strengthinsight-20`
2. **Oura:** `https://www.amazon.com/dp/B0BXKY9KBP?tag=strengthinsight-20`
3. **Fitbit:** `https://www.amazon.com/dp/B0B4NJKDRY?tag=strengthinsight-20`
4. **Garmin:** `https://www.amazon.com/dp/B0BXGLBPYB?tag=strengthinsight-20`
5. **Apple Watch:** `https://www.amazon.com/dp/B0B4KDGGYJ?tag=strengthinsight-20`

---

## Part 3: Optimized Claude Code Prompt

Use this prompt when working with Claude Code to integrate affiliate links into your article.

```
You are an expert blog editor and affiliate marketer. Your task is to integrate 
Amazon affiliate links into a blog article naturally and strategically.

ARTICLE:
[Paste the full EXAMPLE_ARTICLE_01.md content here]

PRODUCTS TO INTEGRATE:

1. WHOOP Band 4.0 — https://www.amazon.com/dp/B0C5GH8L3N?tag=strengthinsight-20
2. Oura Ring Gen 3 — https://www.amazon.com/dp/B0BXKY9KBP?tag=strengthinsight-20
3. Fitbit Sense 2 — https://www.amazon.com/dp/B0B4NJKDRY?tag=strengthinsight-20
4. Garmin Fenix 6X — https://www.amazon.com/dp/B0BXGLBPYB?tag=strengthinsight-20
5. Apple Watch Series 8 — https://www.amazon.com/dp/B0B4KDGGYJ?tag=strengthinsight-20

TASK:
Replace all placeholder affiliate links in the article with the real links above.

RULES:
1. Keep all original text, structure, and formatting intact
2. Replace ONLY the affiliate link URLs (keep the link text/markdown structure the same)
3. Do NOT add, remove, or restructure sentences
4. Do NOT change headings, lists, or table format
5. Ensure each product link appears in its natural context:
   - Comparison table row
   - Product review H2 section
   - Conclusion recommendations
   - FAQ answer
6. Verify all 5 products are linked at least once (check by counting)
7. Add FTC disclosure at the very top of the article (before H1):
   ```
   **Disclosure:** This article contains Amazon affiliate links. 
   If you buy through these links, I earn a small commission at no cost to you.
   ```

DELIVERABLE:
Provide the complete updated article in markdown format, ready to copy-paste into 
strengthinsight.app/blog/

Verify before returning:
- ✅ FTC disclosure added at top
- ✅ All 5 affiliate links present and active
- ✅ No text was added or removed
- ✅ Formatting preserved
- ✅ Links are clickable markdown: [text](url)
```

---

## Part 4: How to Use This with Claude Code

### Step 1: Gather Your Materials
- [ ] Your actual affiliate links (created in Part 2 above)
- [ ] The EXAMPLE_ARTICLE_01.md file (already written)
- [ ] This Claude Code prompt (Part 3 above)

### Step 2: Open Claude Code
- Go to https://claude.new/ (or your Claude Code interface)
- Create a new session

### Step 3: Run the Prompt
1. **Copy the prompt from Part 3** (the full text)
2. **Replace placeholder links** with YOUR actual affiliate links
3. **Paste the article content** (EXAMPLE_ARTICLE_01.md) where it says `[Paste the full EXAMPLE_ARTICLE_01.md content here]`
4. **Send to Claude Code**

### Step 4: Get Your Updated Article
- Claude will return the article with all affiliate links integrated
- FTC disclosure added at top
- Ready to publish

### Step 5: Copy & Publish
1. **Copy the output** from Claude Code
2. **Paste into your blog** (strengthinsight.app/blog/)
3. **Publish**

---

## Part 5: Verification Checklist (Before Publishing)

After Claude Code returns your updated article, check these boxes:

- [ ] **FTC disclosure present** at top of article
- [ ] **All 5 products linked:**
  - [ ] WHOOP Band 4.0 appears at least once
  - [ ] Oura Ring Gen 3 appears at least once
  - [ ] Fitbit Sense 2 appears at least once
  - [ ] Garmin Fenix 6X appears at least once
  - [ ] Apple Watch Series 8 appears at least once
- [ ] **All links are clickable** (test 1-2 to confirm)
- [ ] **No text was accidentally removed** (compare word count to original)
- [ ] **Formatting intact** (headings, tables, lists still look correct)
- [ ] **Affiliate links include your Associate ID** (check URL: `?tag=strengthinsight-20`)

---

## Part 6: Quick Reference — Complete Workflow

### Timeline: 20 minutes from now to published article

| Step | Time | What to Do |
|------|------|-----------|
| **1** | 2 min | Create 5 affiliate links (Part 2) |
| **2** | 3 min | Copy Claude Code prompt (Part 3) + paste your links |
| **3** | 5 min | Paste EXAMPLE_ARTICLE_01.md into prompt |
| **4** | 5 min | Send to Claude Code, wait for response |
| **5** | 3 min | Copy output, paste into blog |
| **6** | 2 min | Verify checklist (Part 5) |
| **7** | 1 min | Publish |
| **TOTAL** | **~20 min** | Live article with affiliate monetization 💪 |

---

## Part 7: Troubleshooting

### "My affiliate links aren't working"
**Solution:** Verify your Associate ID is correct
- Log in to Associates dashboard
- Copy your ID exactly (spaces matter)
- Format: `?tag=YOUR-EXACT-ID`

### "Claude Code changed my article text"
**Solution:** Use the prompt again with strict instruction: "Do NOT add, remove, or restructure sentences"
- If it happens again, manually edit in your blog platform

### "Links aren't showing commissions"
**Solution:** Check 3 things
1. Your Associates account is active (check dashboard)
2. Links include `?tag=` parameter
3. Wait 24 hours (takes time for Amazon to track)

### "ASIN doesn't match product"
**Solution:** Go to Amazon.com directly, search product name, verify ASIN
- Some products have multiple ASINs (different colors, variants)
- Use the main product page ASIN

---

## Part 8: One-Page Quick Reference (Print This)

```
AFFILIATE LINK TEMPLATE:
https://www.amazon.com/dp/[ASIN]?tag=strengthinsight-20

YOUR 5 PRODUCTS:
1. WHOOP: B0C5GH8L3N
2. Oura: B0BXKY9KBP
3. Fitbit: B0B4NJKDRY
4. Garmin: B0BXGLBPYB
5. Apple Watch: B0B4KDGGYJ

CLAUDE CODE PROMPT: (See Part 3)

WORKFLOW:
Step 1: Create links (replace [ASIN] with real ASINs, replace tag with your ID)
Step 2: Copy Claude prompt, paste your links + article
Step 3: Claude Code returns updated article
Step 4: Copy, paste into blog, publish

FTC DISCLOSURE: Add to top of article
"**Disclosure:** This article contains Amazon affiliate links. 
If you buy through these links, I earn a small commission at no cost to you."

VERIFY:
✅ All 5 products linked
✅ All links include ?tag=yourID
✅ FTC disclosure present
✅ No text was removed
✅ Publish!
```

---

## Summary: Your Action Right Now

1. **Create your 5 affiliate links** using Part 2 (replace `strengthinsight-20` with YOUR Associate ID)
2. **Copy the Claude Code prompt** (Part 3)
3. **Paste your links into the prompt** where indicated
4. **Paste EXAMPLE_ARTICLE_01.md** into the prompt where indicated
5. **Send to Claude Code**
6. **Get back your updated article**
7. **Paste into your blog**
8. **Publish**

**Estimated time:** 20 minutes start-to-finish.

---

**Questions?** Let me know if you need me to walk through any step. You've got this. 💪
