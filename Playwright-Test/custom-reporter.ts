// sla-reporter.ts
import type { Reporter, TestCase, TestResult, FullResult } from '@playwright/test/reporter';

class SlaThresholdReporter implements Reporter {
  private targetTag = '@hard';
  private minPassRate = 95.0;

  private totalRuns = 0;
  private passedRuns = 0;

  onTestEnd(test: TestCase, result: TestResult) {
    // Filter only for the target test by tag or title
    if (test.title.includes(this.targetTag) || test.tags.includes(this.targetTag)) {
      this.totalRuns++;
      if (result.status === 'passed') {
        this.passedRuns++;
      }
    }
  }

  async onEnd(result: FullResult): Promise<{ status?: FullResult['status'] } | undefined | void> {
    if (this.totalRuns === 0) {
      console.log(`\n[SLA Reporter] No tests matching '${this.targetTag}' were found.`);
      return { status: result.status };
    }

    const passPercentage = (this.passedRuns / this.totalRuns) * 100;
    const formattedRate = passPercentage.toFixed(2);

    console.log('\n==================================================');
    console.log(` TARGET TEST   : ${this.targetTag}`);
    console.log(` TOTAL RUNS (N): ${this.totalRuns}`);
    console.log(` PASSED        : ${this.passedRuns}`);
    console.log(` FAILED        : ${this.totalRuns - this.passedRuns}`);
    console.log(` SUCCESS RATE  : ${formattedRate}% (Threshold: ${this.minPassRate}%)`);
    console.log('==================================================\n');

    // Fail the report if success percentage is below 95%
    if (passPercentage < this.minPassRate) {
      console.error(`❌ REPORT FAILED: Success rate (${formattedRate}%) is under the ${this.minPassRate}% threshold.`);
      return { status: 'failed' };
    }

    console.log(`✅ REPORT PASSED: Success rate meets requirement.`);
    return { status: 'passed' };
  }
}

export default SlaThresholdReporter;