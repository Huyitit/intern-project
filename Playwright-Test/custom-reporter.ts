
import type { Reporter, TestCase, TestResult, FullResult } from '@playwright/test/reporter';

class ThresholdReporter implements Reporter {
  private targetTag = '@hard';
  private minPassRate = 90.0;

  private testTotal = 0;
  private testPassed = 0;
  private hasStandardTestFailures = false;

  onTestEnd(test: TestCase, result: TestResult) {
    const isSlaTest = test.title.includes(this.targetTag) || test.tags.includes(this.targetTag);

    if (isSlaTest) {
      this.testTotal++;
      if (result.status === 'passed') {
        this.testPassed++;
      }
    } else {
      // Catch failures in non-SLA functional tests
      if (result.status !== 'passed' && result.status !== 'skipped') {
        this.hasStandardTestFailures = true;
      }
    }
  }

  async onEnd(result: FullResult): Promise<{ status?: FullResult['status'] } | undefined | void> {
    if (this.testTotal === 0) return { status: result.status };

    const passPercentage = (this.testPassed / this.testTotal) * 100;
    const formattedRate = Math.ceil(passPercentage);
 
    console.log('\n==================================================');
    console.log(` TEST TAG   : ${this.targetTag}`);
    console.log(` TEST RUNS (N)   : ${this.testTotal}`);
    console.log(` TEST PASSED     : ${this.testPassed}`);
    console.log(` TEST RATE       : ${formattedRate}% (Thresshold: ${this.minPassRate}%)`);
    console.log('==================================================\n');

    // Rule 1: Fail CI if SLA falls below threshold
    if (passPercentage < this.minPassRate) {
      console.error(`❌ Test FAILED: Result pass rate (${formattedRate}%) fell below ${this.minPassRate}%.`);
      return {status: 'failed'}; // Process exits with Code 1 -> GitHub Actions FAILS
    }

    // Rule 2: Fail CI if any standard functional test failed
    if (this.hasStandardTestFailures) {
      console.error(`❌ Test FAILED: Result met (${formattedRate}%), but a standard test failed.`);
      return {status: 'failed'}; // Process exits with Code 1 -> GitHub Actions FAILS
    }

    // Rule 3: Pass CI
    console.log(`✅ Test PASSED: Result met (${formattedRate}%) and all standard tests passed.`);
    return {status: 'passed'}; // Process exits with Code 0 -> GitHub Actions PASSES
  }
}

export default ThresholdReporter;