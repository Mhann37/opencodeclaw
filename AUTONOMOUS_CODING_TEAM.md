# Autonomous Coding Team Architecture

**Status:** DRAFT (Implementation in progress)
**Hardware:** Raspberry Pi 5, 4GB RAM
**LLM Backend:** Ollama + orca-mini-7b (3GB)
**Code Generation:** opencode-ai CLI
**Coordination:** OpenClaw subagents (parallel execution)
**Cost:** $0 (fully open-source, runs locally)

---

## Overview

**Goal:** Autonomous multi-agent coding team that:
- Generates code without subscription LLMs
- Works on Raspberry Pi 5 (4GB RAM)
- Operates via OpenCode CLI + Ollama
- Spawns subagents for parallel work
- Integrates with Git + GitHub
- Requires zero API keys/subscriptions

**Architecture:**

```
Matt (Requester)
  ↓
Jarvis (Main Agent) — Task Router
  ├→ SubAgent 1: Code Generation (OpenCode + Ollama)
  ├→ SubAgent 2: Testing (Jest/Mocha)
  ├→ SubAgent 3: Integration (Git commits)
  └→ SubAgent 4: Documentation (Auto-generated)

All subagents use:
  • Ollama (local LLM inference)
  • opencode-ai (code generation CLI)
  • Node.js runtime (native)
```

---

## Components

### 1. Ollama (Local LLM Server)

**Purpose:** Serve language model locally (zero API calls)

**Installation:**
```bash
# Install Ollama
curl https://ollama.ai/install.sh | sh

# Pull orca-mini-7b (RPi 5 optimized)
ollama pull orca-mini
```

**Model Choice (for 4GB RAM):**
- `orca-mini:7b` (3GB) — Best for RPi 5
- Fast inference, good reasoning, code-capable
- Response time: 5-15 sec per task (acceptable)

**Run:**
```bash
ollama serve  # Starts server on localhost:11434
```

---

### 2. OpenCode CLI

**Purpose:** Invoke Ollama for code generation tasks

**Already installed:** `npm i -g opencode-ai`

**Usage:**
```bash
opencode generate \
  --prompt "Build a Node.js script that..." \
  --model orca-mini \
  --output ./output.js
```

---

### 3. Autonomous Subagent System

**Architecture:**

#### SubAgent 1: Code Generation
- **Trigger:** `Jarvis spawns with task` → `Generate code using OpenCode`
- **Input:** Task description
- **Output:** Generated code file + validation report
- **Tools:** opencode-ai, Node.js

#### SubAgent 2: Testing
- **Trigger:** Code generation complete → `Run test suite`
- **Input:** Generated code
- **Output:** Test results, coverage report
- **Tools:** Jest, ESLint, Node.js

#### SubAgent 3: Integration
- **Trigger:** Tests pass → `Commit to Git`
- **Input:** Code files, branch name
- **Output:** Git commit hash, PR link
- **Tools:** git, GitHub CLI

#### SubAgent 4: Documentation
- **Trigger:** Code committed → `Auto-generate docs`
- **Input:** Source code
- **Output:** README, API docs, CHANGELOG
- **Tools:** JSDoc, markdown generation

---

### 4. Task Router (Jarvis)

**Workflow:**

```
User Request: "Build power rack attachment blog generator"
  ↓
Jarvis.routeTask({
  description: "...",
  priority: "high",
  deadline: "2026-03-27 22:00"
})
  ↓
Spawn Subagent 1: Generate blog generator script
Spawn Subagent 2: Test the script (in parallel)
  ↓
Wait for both → Collect results
  ↓
Spawn Subagent 3: Commit to Git
Spawn Subagent 4: Auto-generate docs
  ↓
Return: "✅ Code generated, tested, committed to branch feature/blog-gen"
```

---

## Subagent Implementation

### SubAgent Template (Node.js)

```javascript
// subagents/code-generator.js

const { spawn } = require('child_process');

class CodeGeneratorAgent {
  async generateCode(task) {
    console.log(`[CodeGen] Task: ${task.description}`);
    
    // Invoke OpenCode + Ollama
    const result = await this.invokeOpenCode(task);
    
    // Validate output
    const validated = await this.validateCode(result);
    
    // Return result
    return {
      status: validated ? 'success' : 'error',
      code: result.code,
      file: result.filepath,
      validation: validated
    };
  }
  
  async invokeOpenCode(task) {
    return new Promise((resolve, reject) => {
      const proc = spawn('opencode', [
        'generate',
        '--prompt', task.description,
        '--model', 'orca-mini',
        '--output', `./generated/${task.id}.js`
      ]);
      
      proc.on('close', (code) => {
        if (code === 0) {
          resolve({ code: 0, filepath: `./generated/${task.id}.js` });
        } else {
          reject(new Error(`OpenCode failed with code ${code}`));
        }
      });
    });
  }
  
  async validateCode(result) {
    // ESLint validation
    const proc = spawn('eslint', [result.filepath]);
    return new Promise(resolve => {
      proc.on('close', (code) => resolve(code === 0));
    });
  }
}

module.exports = CodeGeneratorAgent;
```

---

## Execution Flow (Tonight)

```
1. User: "I need X feature"
2. Jarvis: Spawn CodeGen subagent
3. CodeGen: 
   - OpenCode generates code (Ollama)
   - ESLint validates
   - Returns file path
4. Jarvis: Spawn Test subagent (parallel)
5. Test:
   - Jest runs test suite
   - Coverage report generated
   - Returns results
6. Jarvis: Spawn Integration subagent
7. Integration:
   - Git commit
   - GitHub push
   - PR creation (optional)
8. Jarvis: Return final status to user

Total time: ~30 seconds (parallel execution)
```

---

## GitHub Integration

**Setup:**
```bash
git clone https://github.com/Mhann37/autonomous-coding-team.git
cd autonomous-coding-team
npm install
```

**Deploy:**
```bash
# On RPi 5:
npm run start

# Listens for task requests via OpenClaw
# Generates code → tests → commits → pushes
```

---

## Resource Requirements (RPi 5)

| Component | Size | RAM | Cost |
|-----------|------|-----|------|
| Ollama + orca-mini | 3.5GB | 3GB | $0 |
| Node.js runtime | 50MB | 0.5GB | $0 |
| OpenCode + deps | 200MB | 0.2GB | $0 |
| **Total** | ~3.8GB | **3.7GB** | **$0** |

**Headroom:** 300MB free (comfortable for Pi 5)

---

## Limitations & Trade-offs

**✅ Advantages:**
- Zero subscription costs
- Runs entirely on RPi 5
- Offline operation (no internet required)
- Private (code never leaves your system)
- Unlimited code generation

**⚠️ Limitations:**
- Orca-mini less capable than GPT-4 (good for scripts, basic apps)
- Inference slow on RPi 5 (5-15 sec per task, acceptable)
- No external API integrations (unless hardcoded)
- Manual approval for production deployments recommended

---

## Success Metrics

✅ **Phase 1 (Tonight):**
- [ ] Ollama running on RPi 5
- [ ] OpenCode + orca-mini integrated
- [ ] SubAgent code generator works
- [ ] Test suite passes
- [ ] GitHub integration live

✅ **Phase 2 (This Weekend):**
- [ ] Subagent 2 (Testing) implemented
- [ ] Subagent 3 (Integration) implemented
- [ ] Parallel execution tested
- [ ] Documentation auto-generated

✅ **Phase 3 (Next Week):**
- [ ] Full autonomous workflow
- [ ] Cron-based task scheduling
- [ ] Dashboard monitoring
- [ ] Production-ready deployment

---

## Files to Create

1. **Architecture:** This file ✅
2. **Ollama setup script:** `scripts/setup-ollama.sh`
3. **SubAgent templates:** `subagents/code-generator.js`, etc.
4. **Task router:** `src/task-router.js`
5. **Tests:** `tests/subagent.test.js`
6. **Docker setup:** `Dockerfile` (optional, for deployment)
7. **GitHub Actions:** `.github/workflows/deploy.yml`

---

## Next Steps

1. Create subagent implementations
2. Test on local Node.js
3. Test with Ollama inference
4. Push to GitHub
5. Deploy to RPi 5 (you handle)

**Timeline:** 80 minutes total
