// Test ConvertKit webhook endpoint
const testWebhookPayload = {
  subscriber: {
    id: 3574920123,
    email_address: "test@example.com",
    first_name: "Test User",
    state: "active",
    created_at: "2025-09-03T05:30:00Z",
    fields: {
      signup_source: "get-involved",
      signup_date: "2025-09-03",
      project_stage: "methodology-development", 
      gdpr_consent: "true",
      consent_timestamp: "2025-09-03T05:30:00Z",
      page_context: "primary-engagement-cta",
      referrer: "direct",
      utm_source: "test"
    }
  },
  subscription: {
    id: 10903336999,
    state: "active",
    created_at: "2025-09-03T05:30:00Z",
    source: "API::V3::SubscriptionsController (external)"
  }
};

async function testWebhook() {
  console.log('🧪 Testing ConvertKit Webhook Endpoint\n');
  
  try {
    const response = await fetch('http://localhost:3000/api/webhook/convertkit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-ConvertKit-Event': 'subscriber.subscriber_activate',
        'X-ConvertKit-Signature': 'test-signature'
      },
      body: JSON.stringify(testWebhookPayload)
    });
    
    const result = await response.json();
    
    console.log(`Status: ${response.status}`);
    console.log('Response:', JSON.stringify(result, null, 2));
    
    if (response.ok) {
      console.log('✅ Webhook endpoint working correctly');
    } else {
      console.log('❌ Webhook endpoint returned error');
    }
    
  } catch (error) {
    console.log('❌ Request failed:', error.message);
  }
}

// Test GET endpoint too
async function testGet() {
  console.log('\n🧪 Testing GET endpoint for webhook info\n');
  
  try {
    const response = await fetch('http://localhost:3000/api/webhook/convertkit');
    const result = await response.json();
    
    console.log(`Status: ${response.status}`);
    console.log('Response:', JSON.stringify(result, null, 2));
    
  } catch (error) {
    console.log('❌ GET request failed:', error.message);
  }
}

async function runTests() {
  await testGet();
  await testWebhook();
}

runTests();