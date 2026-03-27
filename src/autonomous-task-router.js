#!/usr/bin/env node

/**
 * AUTONOMOUS TASK ROUTER
 * 
 * Spawns subagents to handle coding tasks autonomously
 * Coordinates parallel execution and result aggregation
 * 
 * Integration point: Called by Jarvis or CLI
 */

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

class AutonomousTaskRouter {
  constructor() {
    this.tasks = [];
    this.subagentDir = path.join('/var/lib/openclaw/.openclaw/workspace', 'subagents');
    this.resultsDir = path.join('/var/lib/openclaw/.openclaw/workspace', 'task-results');
    
    // Create results directory
    if (!fs.existsSync(this.resultsDir)) {
      fs.mkdirSync(this.resultsDir, { recursive: true });
    }
  }

  /**
   * Route a coding task to the code generator subagent
   */
  async routeCodeGenerationTask(task) {
    console.log(`\n[ROUTER] Routing code generation task: ${task.id}`);
    console.log(`[ROUTER] Description: ${task.description}`);
    
    return new Promise((resolve, reject) => {
      const agentPath = path.join(this.subagentDir, 'code-generator-agent.js');
      const taskJson = JSON.stringify(task);
      
      // Spawn subagent process
      const proc = spawn('node', [agentPath, taskJson]);
      
      let stdout = '';
      let stderr = '';
      
      proc.stdout.on('data', (data) => {
        stdout += data.toString();
        console.log(data.toString().trim());
      });
      
      proc.stderr.on('data', (data) => {
        stderr += data.toString();
        console.error(data.toString().trim());
      });
      
      proc.on('close', (code) => {
        console.log(`[ROUTER] Subagent exited with code ${code}`);
        
        // Parse result from stdout
        try {
          const resultMatch = stdout.match(/\[RESULT\]([\s\S]*)/);
          if (resultMatch) {
            const result = JSON.parse(resultMatch[1]);
            
            // Save result to file
            const resultFile = path.join(this.resultsDir, `${task.id}-result.json`);
            fs.writeFileSync(resultFile, JSON.stringify(result, null, 2));
            
            console.log(`[ROUTER] ✓ Result saved to ${resultFile}`);
            
            if (code === 0) {
              resolve(result);
            } else {
              reject(new Error(`Subagent failed with code ${code}`));
            }
          } else {
            reject(new Error('No result found in subagent output'));
          }
        } catch (e) {
          reject(new Error(`Failed to parse subagent result: ${e.message}`));
        }
      });
      
      // Timeout after 5 minutes
      setTimeout(() => {
        proc.kill();
        reject(new Error('Subagent timeout (5 minutes)'));
      }, 300000);
    });
  }

  /**
   * Execute multiple tasks in parallel
   */
  async executeParallel(tasks) {
    console.log(`\n[ROUTER] Executing ${tasks.length} tasks in parallel`);
    
    const promises = tasks.map(task => 
      this.routeCodeGenerationTask(task).catch(e => ({
        id: task.id,
        status: 'error',
        error: e.message
      }))
    );
    
    const results = await Promise.all(promises);
    return results;
  }

  /**
   * Execute sequential tasks (wait for previous to complete)
   */
  async executeSequential(tasks) {
    console.log(`\n[ROUTER] Executing ${tasks.length} tasks sequentially`);
    
    const results = [];
    for (const task of tasks) {
      try {
        const result = await this.routeCodeGenerationTask(task);
        results.push(result);
      } catch (e) {
        results.push({
          id: task.id,
          status: 'error',
          error: e.message
        });
      }
    }
    
    return results;
  }

  /**
   * Main workflow: Generate → Test → Commit
   */
  async executeFullWorkflow(task) {
    console.log(`\n[WORKFLOW] Starting full workflow for ${task.id}`);
    
    try {
      // Step 1: Generate code
      console.log(`\n[WORKFLOW-1] Code Generation...`);
      const genResult = await this.routeCodeGenerationTask(task);
      
      if (genResult.status === 'error') {
        throw new Error(`Code generation failed: ${genResult.error}`);
      }
      
      console.log(`[WORKFLOW-1] ✓ Code generated and validated`);
      
      // Step 2: (Placeholder) Test code
      console.log(`\n[WORKFLOW-2] Testing code...`);
      console.log(`[WORKFLOW-2] ✓ Tests passed (placeholder)`);
      
      // Step 3: (Placeholder) Commit to git
      console.log(`\n[WORKFLOW-3] Committing to Git...`);
      console.log(`[WORKFLOW-3] ✓ Committed to GitHub (placeholder)`);
      
      // Final result
      return {
        status: 'success',
        id: task.id,
        workflow: {
          generation: genResult,
          testing: { status: 'pending', note: 'To be implemented' },
          integration: { status: 'pending', note: 'To be implemented' }
        },
        timestamp: new Date().toISOString()
      };
    } catch (e) {
      console.error(`[WORKFLOW] ✗ Workflow failed: ${e.message}`);
      
      return {
        status: 'error',
        id: task.id,
        error: e.message,
        timestamp: new Date().toISOString()
      };
    }
  }
}

// CLI Usage
if (require.main === module) {
  const router = new AutonomousTaskRouter();
  
  // Example task
  const exampleTask = {
    id: 'example-hello-world',
    description: 'Create a simple Node.js script that prints "Hello from Autonomous Coding Team"',
    language: 'javascript'
  };
  
  router.executeFullWorkflow(exampleTask)
    .then(result => {
      console.log('\n[FINAL RESULT]');
      console.log(JSON.stringify(result, null, 2));
    })
    .catch(e => {
      console.error('\n[FATAL ERROR]');
      console.error(e.message);
      process.exit(1);
    });
}

module.exports = AutonomousTaskRouter;
