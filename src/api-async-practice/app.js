const fetch = require('node-fetch');

const API_URL = 'https://randomuser.me/api/';
const INVALID_API_URL = 'https://invalid-api-url-down-12345.com/api/';

console.log('=== ASYNC/AWAIT, PROMISES & CALLBACKS ===\n');

// Helper function to format user
function formatUser(user) {
  return `${user.name.first} ${user.name.last} | Email: ${user.email}`;
}

// ============================================
// METHOD 1: CALLBACKS (Old way - nested hell)
// ============================================
function fetchUserCallback(url, callback) {
  fetch(url)
    .then(res => {
      if (!res.ok) throw new Error(`HTTP Status: ${res.status}`);
      return res.json();
    })
    .then(data => callback(null, data.results[0]))
    .catch(err => callback(err));
}

// ============================================
// METHOD 2: PROMISES (Better - chainable)
// ============================================
function fetchUserPromise(url = API_URL) {
  return new Promise((resolve, reject) => {
    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP Status: ${res.status}`);
        return res.json();
      })
      .then(data => resolve(data.results[0]))
      .catch(err => reject(err));
  });
}

// ============================================
// METHOD 3: ASYNC/AWAIT (Best - looks sync!)
// ============================================
async function fetchUserAsync(url = API_URL) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP Status: ${res.status}`);
    const data = await res.json();
    return data.results[0];
  } catch (err) {
    throw err;
  }
}

// ============================================
// BONUS 1: FETCH 5 USERS IN SEQUENCE (All 3 Methods)
// ============================================

// 1a. Sequential Fetch with Async/Await (Loop + Await)
async function fetchFiveInSequenceAsync() {
  console.log('\n[BONUS 1a] Fetching 5 users in SEQUENCE (Async/Await):');
  console.log('----------------------------------------------------');
  for (let i = 1; i <= 5; i++) {
    const user = await fetchUserAsync(API_URL);
    console.log(`  Sequence #${i}: ${formatUser(user)}`);
  }
}

// 1b. Sequential Fetch with Promise Chain
function fetchFiveInSequencePromise() {
  console.log('\n[BONUS 1b] Fetching 5 users in SEQUENCE (Promise Chain):');
  console.log('----------------------------------------------------');
  let p = Promise.resolve();
  for (let i = 1; i <= 5; i++) {
    p = p.then(() => fetchUserPromise()).then(user => {
      console.log(`  Sequence #${i}: ${formatUser(user)}`);
    });
  }
  return p;
}

// 1c. Sequential Fetch with Callback Recursion
function fetchFiveInSequenceCallback(count = 1, done) {
  if (count > 5) return done();
  fetchUserCallback(API_URL, (err, user) => {
    if (err) {
      console.log(`  Sequence #${count} Callback Error:`, err.message);
    } else {
      console.log(`  Sequence #${count}: ${formatUser(user)}`);
    }
    fetchFiveInSequenceCallback(count + 1, done);
  });
}

// ============================================
// BONUS 2: FETCH 5 USERS IN PARALLEL (Promise.all)
// ============================================
async function fetchFiveInParallel() {
  console.log('\n[BONUS 2] Fetching 5 users in PARALLEL (Promise.all):');
  console.log('--------------------------------------------------');
  try {
    const promises = Array.from({ length: 5 }, () => fetchUserAsync(API_URL));
    const users = await Promise.all(promises);
    users.forEach((user, index) => {
      console.log(`  Parallel #${index + 1}: ${formatUser(user)}`);
    });
  } catch (err) {
    console.log('Parallel Error:', err.message);
  }
}

// ============================================
// BONUS 3: ERROR HANDLING (What if API is Down?)
// ============================================
async function testApiDownErrorHandling() {
  console.log('\n[BONUS 3] Testing Error Handling (API Down / Invalid Domain):');
  console.log('------------------------------------------------------------');
  
  // 1. Async/Await Error Handling
  try {
    await fetchUserAsync(INVALID_API_URL);
  } catch (err) {
    console.log('✓ Async/Await caught API Down Error:', err.message);
  }

  // 2. Promise Error Handling
  fetchUserPromise(INVALID_API_URL)
    .catch(err => {
      console.log('✓ Promise .catch() caught API Down Error:', err.message);
    });

  // 3. Callback Error Handling
  fetchUserCallback(INVALID_API_URL, (err, user) => {
    if (err) {
      console.log('✓ Callback error argument caught API Down Error:', err.message);
    }
  });
}

// ============================================
// MAIN EXECUTION RUNNER
// ============================================
console.log('METHOD 1: CALLBACK PATTERN');
console.log('------------------------');
fetchUserCallback(API_URL, (err, user) => {
  if (err) {
    console.log('Error:', err.message);
  } else {
    console.log(`User: ${user.name.first} ${user.name.last}`);
    console.log(`Email: ${user.email}`);
    console.log(`Image: ${user.picture.medium}`);
  }
  console.log('\n');

  console.log('METHOD 2: PROMISE PATTERN');
  console.log('------------------------');
  fetchUserPromise()
    .then(user => {
      console.log(`User: ${user.name.first} ${user.name.last}`);
      console.log(`Email: ${user.email}`);
      console.log(`Image: ${user.picture.medium}`);
    })
    .catch(err => console.log('Error:', err.message))
    .finally(async () => {
      console.log('\n');

      console.log('METHOD 3: ASYNC/AWAIT PATTERN');
      console.log('----------------------------');
      try {
        const user = await fetchUserAsync();
        console.log(`User: ${user.name.first} ${user.name.last}`);
        console.log(`Email: ${user.email}`);
        console.log(`Image: ${user.picture.medium}`);
      } catch (err) {
        console.log('Error:', err.message);
      }

      console.log('\n✓ All three base methods completed!');

      // Run Bonus 1a: Sequence Async/Await
      await fetchFiveInSequenceAsync();

      // Run Bonus 1b: Sequence Promise
      await fetchFiveInSequencePromise();

      // Run Bonus 1c: Sequence Callback
      console.log('\n[BONUS 1c] Fetching 5 users in SEQUENCE (Callback Recursion):');
      console.log('----------------------------------------------------');
      fetchFiveInSequenceCallback(1, async () => {
        // Run Bonus 2: Parallel Promise.all
        await fetchFiveInParallel();

        // Run Bonus 3: Error Handling
        await testApiDownErrorHandling();
      });
    });
});
