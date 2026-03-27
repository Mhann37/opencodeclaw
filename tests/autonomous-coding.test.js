#!/usr/bin/env node

/**
 * TEST SUITE: Autonomous Coding Team
 * 
 * Tests:
 * 1. Task routing
 * 2. Subagent spawning
 * 3. Code generation
 * 4. Validation
 * 5. Error handling
 */

const fs = require('fs');
const path = require('path');

const AutonomousTaskRouter = require('../src/autonomous-task-router.js');
const CodeGeneratorAgent = require('../subagents/code-generator-agent.js');

class TestSuite {
  constructor() {
    this.passed = 0;
    this.failed = 0;
    this.tests = [];
  }

  async test(name, fn) {
    try {
      console.log(`\n[TEST] ${name}...`);
      await fn();
      this.passed++;
      console.log(`[TEST] ✓ PASS`);
    } catch (e) {
      this.failed++;
      console.error(`[TEST] ✗ FAIL: ${e.message}`);
    }
  }

  async testTaskRouterInitialization() {
    return new Promise((resolve, reject) => {
      try {
        const router = new AutonomousTaskRouter();
        if (!router || !router.routeCodeGenerationTask) {
          throw new Error('Router not initialized correctly');
        }
        resolve();
      } catch (e) {
        reject(e);
      }
    });
  }

  async testCodeGeneratorInitialization() {
    return new Promise((resolve, reject) => {
      try {
        const task = {
          id: 'test-init',
          description: 'Test task',
          language: 'javascript'
        };
        const agent = new CodeGeneratorAgent(task);
        if (!agent || !agent.execute) {
          throw new Error('CodeGenerator not initialized correctly');
        }
        resolve();
      } catch (e) {
        reject(e);
      }
    });
  }

  async testPromptBuilding() {
    return new Promise((resolve, reject) => {
      try {
        const task = {
          id: 'test-prompt',
          description: 'Build a test script',
          language: 'javascript'
        };
        const agent = new CodeGeneratorAgent(task);
        const prompt = agent.buildPrompt();
        
        if (!prompt || prompt.length < 50) {
          throw new Error('Prompt not built correctly');
        }
        
        if (!prompt.includes(task.description)) {
          throw new Error('Prompt does not include task description');
        }
        
        resolve();
      } catch (e) {
        reject(e);
      }
    });
  }

  async testDirectoryCreation() {
    return new Promise((resolve, reject) => {
      try {
        const task = {
          id: `test-dir-${Date.now()}`,
          description: 'Test directory creation',
          language: 'javascript'
        };
        const agent = new CodeGeneratorAgent(task);
        
        if (!fs.existsSync(agent.outputDir)) {
          // Will be created on initialize
          if (!agent.outputDir) {
            throw new Error('Output directory path not set');
          }
        }
        
        resolve();
      } catch (e) {
        reject(e);
      }
    });
  }

  async testErrorHandling() {
    return new Promise((resolve, reject) => {
      try {
        const task = null;
        // Should throw error when trying to create agent with null task
        try {
          new CodeGeneratorAgent(task);
          throw new Error('Should have thrown error for null task');
        } catch (e) {
          if (e.message !== 'Should have thrown error for null task') {
            // Expected error, test passes
            resolve();
          } else {
            reject(e);
          }
        }
      } catch (e) {
        reject(e);
      }
    });
  }

  async runAll() {
    console.log('================================================');
    console.log('AUTONOMOUS CODING TEAM - TEST SUITE');
    console.log('================================================');
    
    await this.test('Task Router Initialization', () => this.testTaskRouterInitialization());
    await this.test('CodeGenerator Initialization', () => this.testCodeGeneratorInitialization());
    await this.test('Prompt Building', () => this.testPromptBuilding());
    await this.test('Directory Creation', () => this.testDirectoryCreation());
    await this.test('Error Handling', () => this.testErrorHandling());
    
    console.log('\n================================================');
    console.log(`RESULTS: ${this.passed} passed, ${this.failed} failed`);
    console.log('================================================\n');
    
    return this.failed === 0;
  }
}

// Run tests
if (require.main === module) {
  const suite = new TestSuite();
  suite.runAll().then(success => {
    process.exit(success ? 0 : 1);
  });
}

module.exports = TestSuite;
