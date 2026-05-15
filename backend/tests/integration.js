#!/usr/bin/env node
/**
 * Integration smoke test for RAG + External APIs
 *
 * Prerequisites:
 * 1. Backend running at http://localhost:5000
 * 2. RAG server running at http://localhost:8501 (optional)
 * 3. Google Places API key configured in backend .env (optional)
 *
 * Run: node tests/integration.js
 */

const http = require('http');

const API_BASE = process.env.API_BASE || 'http://localhost:5000/api';

function buildUrl(path) {
  const base = API_BASE.endsWith('/') ? API_BASE.slice(0, -1) : API_BASE;
  const cleanPath = path.startsWith('/') ? path : '/' + path;
  return base + cleanPath;
}

async function testEndpoint(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const urlStr = buildUrl(path);
    const url = new URL(urlStr);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch {
          resolve({ status: res.statusCode, data: data });
        }
      });
    });

    req.on('error', reject);
    req.setTimeout(30000);

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function runTests() {
  console.log('🧪 Running Integration Tests\n');
  console.log(`API Base: ${API_BASE}\n`);

  const results = [];
  let passed = 0;
  let failed = 0;

  // Test 1: Weaver Generate (Database)
  try {
    console.log('Test 1: Weaver Generate (Database mode)');
    const res1 = await testEndpoint('POST', '/weaver/generate', {
      query: 'I want a peaceful beach trip for 3 days in Goa',
      duration: 3
    });

    if (res1.status === 200 && res1.data.success) {
      console.log(`  ✅ Success - Source: ${res1.data.source}`);
      console.log(`     Destination: ${res1.data.destination}`);
      console.log(`     Duration: ${res1.data.itinerary?.duration} days`);
      if (res1.data.externalHotels) console.log(`     External Hotels: ${res1.data.externalHotels.length}`);
      if (res1.data.externalActivities) console.log(`     External Activities: ${res1.data.externalActivities.length}`);
      passed++;
    } else {
      console.log(`  ❌ Failed - Status: ${res1.status}`);
      failed++;
    }
  } catch (e) {
    console.log(`  ❌ Error: ${e.message}`);
    failed++;
  }

  // Test 2: RAG Health
  try {
    console.log('\nTest 2: RAG Service Health');
    const res2 = await testEndpoint('GET', '/weaver/rag/health');

    if (res2.status === 200 && res2.data.status) {
      console.log(`  ✅ RAG Status: ${res2.data.status}`);
      passed++;
    } else {
      console.log(`  ⚠️  RAG unavailable (expected if not running)`);
      console.log(`     Response: ${JSON.stringify(res2.data)}`);
      passed++; // Don't fail if RAG is optional
    }
  } catch (e) {
    console.log(`  ⚠️  RAG check failed: ${e.message}`);
    passed++;
  }

  // Test 3: External Hotels Search
  try {
    console.log('\nTest 3: External Hotels Search');
    const res3 = await testEndpoint('POST', '/weaver/hotels/search', {
      destination: 'Goa'
    });

    if (res3.status === 200) {
      console.log(`  ✅ Hotels endpoint working`);
      if (res3.data.hotels) {
        console.log(`     Hotels found: ${res3.data.hotels.length}`);
      }
      passed++;
    } else {
      console.log(`  ❌ Failed - Status: ${res3.status}`);
      failed++;
    }
  } catch (e) {
    console.log(`  ❌ Error: ${e.message}`);
    failed++;
  }

  // Test 4: Activities Search
  try {
    console.log('\nTest 4: Activities Search');
    const res4 = await testEndpoint('GET', '/weaver/activities/Goa');

    if (res4.status === 200) {
      console.log(`  ✅ Activities endpoint working`);
      if (res4.data.results) {
        console.log(`     Activities found: ${res4.data.results.length}`);
      }
      passed++;
    } else {
      console.log(`  ❌ Failed - Status: ${res4.status}`);
      failed++;
    }
  } catch (e) {
    console.log(`  ❌ Error: ${e.message}`);
    failed++;
  }

  // Test 5: External Generate
  try {
    console.log('\nTest 5: External-Only Generation');
    const res5 = await testEndpoint('POST', '/weaver/generate-external', {
      destination: 'Paris',
      duration: 3
    });

    if (res5.status === 200 && res5.data.success) {
      console.log(`  ✅ External generation working`);
      console.log(`     Hotels: ${res5.data.hotels?.length || 0}`);
      console.log(`     Activities: ${res5.data.activities?.length || 0}`);
      passed++;
    } else {
      console.log(`  ❌ Failed - Status: ${res5.status}`);
      failed++;
    }
  } catch (e) {
    console.log(`  ❌ Error: ${e.message}`);
    failed++;
  }

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`Results: ${passed} passed, ${failed} failed`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  process.exit(failed > 0 ? 1 : 0);
}

runTests().catch(console.error);