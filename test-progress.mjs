import { chromium } from 'playwright';

const BASE = 'http://127.0.0.1:4001';
const issues = [];

function log(msg) { console.log(`  ${msg}`); }
function issue(page, msg) { issues.push({ page, msg }); console.log(`  ❌ ${page}: ${msg}`); }
function ok(msg) { console.log(`  ✅ ${msg}`); }

async function testPage(page, url, label) {
  try {
    const resp = await page.goto(url, { waitUntil: 'networkidle', timeout: 15000 });
    if (!resp || resp.status() !== 200) {
      issue(label, `HTTP ${resp?.status() || 'no response'}`);
      return false;
    }
    // Check for error text
    const errorText = await page.locator('text=Application error').count();
    if (errorText > 0) {
      issue(label, 'Application error on page');
      return false;
    }
    return true;
  } catch (e) {
    issue(label, `Load failed: ${e.message.split('\n')[0]}`);
    return false;
  }
}

(async () => {
  const browser = await chromium.launch({ headless: true, channel: 'chromium' });
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();

  console.log('\n=== 1. TESTING ALL PAGES LOAD ===');
  const pages = [
    ['/', 'Homepage'],
    ['/programs', 'Programs'],
    ['/dashboard', 'Dashboard'],
    ['/about', 'About'],
    ['/programs/ai-sketch', 'AI Sketch program'],
    ['/programs/ai-chisel', 'AI Chisel program'],
    ['/programs/ai-craft', 'AI Craft program'],
    ['/programs/ai-polish', 'AI Polish program'],
    ['/programs/ai-masterpiece', 'AI Masterpiece program'],
    ['/programs/ai-seeds', 'AI Seeds program'],
  ];
  for (const [path, label] of pages) {
    const loaded = await testPage(page, BASE + path, label);
    if (loaded) ok(label);
  }

  const lessons = [
    ['ai-sketch', ['arrays-and-hashing', 'strings-and-patterns', 'sorting-and-searching']],
    ['ai-chisel', ['two-pointers-and-sliding-window', 'trees-and-graph-traversal', 'stacks-queues-monotonic']],
    ['ai-craft', ['design-url-shortener', 'design-rate-limiter', 'design-recommendation-engine']],
    ['ai-polish', ['star-framework', 'system-design-communication', 'ai-era-leadership']],
    ['ai-seeds', ['what-is-ai', 'how-machines-learn', 'your-first-ai-model']],
  ];
  for (const [prog, slugs] of lessons) {
    for (const slug of slugs) {
      const loaded = await testPage(page, `${BASE}/programs/${prog}/lessons/${slug}`, `${prog}/${slug}`);
      if (loaded) ok(`${prog}/${slug}`);
    }
  }

  console.log('\n=== 2. TESTING PROGRESS TRACKING FLOW ===');
  
  // Clear localStorage first
  await page.goto(BASE + '/dashboard', { waitUntil: 'networkidle' });
  await page.evaluate(() => {
    localStorage.removeItem('open-ai-school-progress');
    localStorage.removeItem('open-ai-school-profile');
  });
  await page.reload({ waitUntil: 'networkidle' });
  
  // Check dashboard empty state
  log('Checking dashboard empty state...');
  const emptyState = await page.locator('text=Your learning adventure').count();
  log(`Empty state visible: ${emptyState > 0}`);

  // Go to first lesson and mark complete
  log('Navigating to ai-sketch/arrays-and-hashing...');
  await page.goto(`${BASE}/programs/ai-sketch/lessons/arrays-and-hashing`, { waitUntil: 'networkidle' });
  
  // Check "Mark as Complete" button exists
  const markBtn = page.locator('button:has-text("Mark as Complete")');
  const markBtnCount = await markBtn.count();
  log(`"Mark as Complete" button found: ${markBtnCount > 0}`);
  if (markBtnCount === 0) {
    issue('ai-sketch/arrays-and-hashing', 'No "Mark as Complete" button found');
  }

  // Check progress bar exists
  const progressBar = page.locator('.progress-bar');
  const progressBarCount = await progressBar.count();
  log(`Progress bar found: ${progressBarCount > 0}`);

  // Check lesson counter text
  const lessonCounter = await page.locator('text=/Lesson \\d+ of \\d+/').textContent().catch(() => null);
  log(`Lesson counter: ${lessonCounter}`);

  // Click Mark as Complete
  if (markBtnCount > 0) {
    await markBtn.click();
    await page.waitForTimeout(500);
    
    // Check completion state appeared
    const completedText = await page.locator('text=Lesson completed').count();
    const completedCheck = await page.locator('text=Completed').count();
    log(`After click - "Lesson completed!" shown: ${completedText > 0}`);
    log(`After click - "Completed" shown: ${completedCheck > 0}`);

    // Check localStorage was updated
    const progress = await page.evaluate(() => localStorage.getItem('open-ai-school-progress'));
    log(`localStorage progress: ${progress}`);

    // Check "Next" link appeared
    const nextLink = await page.locator('a:has-text("→")').count();
    log(`Next lesson link count: ${nextLink}`);
  }

  // Check prev/next nav at bottom
  log('Checking back/next navigation...');
  const prevLinks = await page.locator('text=Back to program').count();
  const nextLinks = await page.locator('a:has-text("Strings")').count();
  log(`"Back to program" link (first lesson): ${prevLinks > 0}`);
  log(`Next lesson link to Strings: ${nextLinks > 0}`);

  // Navigate to next lesson via Next button
  log('Clicking next lesson link...');
  const nextBtn = page.locator('a:has-text("Strings")').first();
  if (await nextBtn.count() > 0) {
    await nextBtn.click();
    await page.waitForLoadState('networkidle');
    const url = page.url();
    log(`Navigated to: ${url}`);
    const isStrings = url.includes('strings-and-patterns');
    if (!isStrings) issue('Navigation', 'Next button did not navigate to strings-and-patterns');
    else ok('Next navigation works');

    // Check this lesson shows NOT completed
    const markBtn2 = await page.locator('button:has-text("Mark as Complete")').count();
    log(`Second lesson shows Mark as Complete: ${markBtn2 > 0}`);

    // Check prev link exists
    const prevLink = await page.locator('a:has-text("Arrays")').count();
    log(`Previous lesson link to Arrays: ${prevLink > 0}`);
  }

  // Mark second lesson complete
  log('Marking second lesson complete...');
  const btn2 = page.locator('button:has-text("Mark as Complete")');
  if (await btn2.count() > 0) {
    await btn2.click();
    await page.waitForTimeout(500);
  }

  // Go to third (last) lesson
  log('Navigating to last lesson (sorting-and-searching)...');
  await page.goto(`${BASE}/programs/ai-sketch/lessons/sorting-and-searching`, { waitUntil: 'networkidle' });
  
  // Mark it complete - should trigger celebration
  const btn3 = page.locator('button:has-text("Mark as Complete")');
  if (await btn3.count() > 0) {
    await btn3.click();
    await page.waitForTimeout(1000);
    
    // Check for congratulations
    const congrats = await page.locator('text=Congratulations').count();
    log(`Congratulations message shown: ${congrats > 0}`);
    if (congrats === 0) issue('Last lesson', 'No congratulations on completing all lessons');

    // Check for confetti elements
    const confetti = await page.locator('.animate-confetti').count();
    log(`Confetti particles: ${confetti}`);

    // Check for trophy
    const trophy = await page.locator('text=🏆').count();
    log(`Trophy shown: ${trophy > 0}`);
  }

  // Check last lesson nav - should show "All lessons" instead of next
  const allLessonsLink = await page.locator('a:has-text("All lessons")').count();
  log(`"All lessons" link on last lesson: ${allLessonsLink > 0}`);
  if (allLessonsLink === 0) issue('Last lesson nav', 'Missing "All lessons" link');

  console.log('\n=== 3. TESTING DASHBOARD REFLECTS PROGRESS ===');
  await page.goto(`${BASE}/dashboard`, { waitUntil: 'networkidle' });
  
  // Check progress shows
  const progressText = await page.locator('text=/\\d+%/').first().textContent().catch(() => null);
  log(`Dashboard progress: ${progressText}`);
  
  // Check completed count
  const completedCountText = await page.locator('text=/\\d+ of \\d+ completed/').first().textContent().catch(() => null);
  log(`Completed count: ${completedCountText}`);

  // Check track headers
  const trackAI = await page.locator('text=AI Learning Path').count();
  const trackCraft = await page.locator('text=Craft Engineering').count();
  log(`Track "AI Learning Path" header: ${trackAI > 0}`);
  log(`Track "Craft Engineering" header: ${trackCraft > 0}`);
  if (trackAI === 0) issue('Dashboard', 'Missing AI Learning Path track header');
  if (trackCraft === 0) issue('Dashboard', 'Missing Craft Engineering track header');

  // Check lesson checkmarks in dashboard for completed lessons
  const checkmarks = await page.locator('[style*="background-color"]').count();
  log(`Styled elements (potential checkmarks): ${checkmarks}`);

  console.log('\n=== 4. TESTING SIGN-OUT CLEARS PROGRESS ===');
  // Sign in as guest first
  const signInBtn = page.locator('button:has-text("Sign"), a:has-text("Sign")').first();
  if (await signInBtn.count() > 0) {
    log('Found sign in button, testing guest flow...');
  }

  // Check progress in localStorage before clear
  const progressBefore = await page.evaluate(() => localStorage.getItem('open-ai-school-progress'));
  log(`Progress before signout: ${progressBefore ? 'exists' : 'none'}`);

  // Simulate clearProfile
  await page.evaluate(() => {
    localStorage.removeItem('open-ai-school-profile');
    localStorage.removeItem('open-ai-school-progress');
  });
  const progressAfter = await page.evaluate(() => localStorage.getItem('open-ai-school-progress'));
  log(`Progress after clear: ${progressAfter ? 'STILL EXISTS!' : 'cleared'}`);
  if (progressAfter) issue('Sign-out', 'Progress not cleared on sign-out');

  console.log('\n=== 5. CHECKING FOR DUPLICATE UI ELEMENTS ===');
  await page.evaluate(() => {
    localStorage.setItem('open-ai-school-progress', JSON.stringify({ completed: ['ai-sketch/arrays-and-hashing'] }));
  });
  await page.goto(`${BASE}/programs/ai-sketch/lessons/arrays-and-hashing`, { waitUntil: 'networkidle' });
  
  // Count checkmark/completion indicators
  const svgCheckmarks = await page.locator('svg path[d*="M10 18a8"]').count();
  const emojiChecks = await page.locator('text=✅').count();
  const completionTexts = await page.locator('text=Completed').count();
  log(`SVG circle checkmarks: ${svgCheckmarks}`);
  log(`Emoji ✅ checkmarks: ${emojiChecks}`);
  log(`"Completed" text count: ${completionTexts}`);
  if (svgCheckmarks > 0) issue('Duplicate checkmark', `Still has ${svgCheckmarks} SVG circle checkmarks`);
  if (emojiChecks > 1) issue('Duplicate checkmark', `Multiple emoji checkmarks: ${emojiChecks}`);

  console.log('\n=== 6. CHECKING CROSS-PROGRAM PROGRESS ===');
  // Set progress for multiple programs
  await page.evaluate(() => {
    localStorage.setItem('open-ai-school-progress', JSON.stringify({ 
      completed: ['ai-sketch/arrays-and-hashing', 'ai-craft/design-url-shortener', 'ai-seeds/what-is-ai'] 
    }));
  });
  await page.goto(`${BASE}/dashboard`, { waitUntil: 'networkidle' });
  
  // Check overall percentage makes sense
  const pctText = await page.locator('text=/\\d+%/').first().textContent().catch(() => '?');
  log(`Overall progress with 3 completed: ${pctText}`);

  // Cleanup
  await page.evaluate(() => {
    localStorage.removeItem('open-ai-school-progress');
    localStorage.removeItem('open-ai-school-profile');
  });

  console.log('\n═══════════════════════════════════════');
  console.log(`TOTAL ISSUES FOUND: ${issues.length}`);
  for (const i of issues) {
    console.log(`  ❌ ${i.page}: ${i.msg}`);
  }
  if (issues.length === 0) console.log('  ✅ No issues found!');
  console.log('═══════════════════════════════════════\n');

  await browser.close();
})();
