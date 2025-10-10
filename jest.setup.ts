import 'whatwg-fetch';

// Mock for import.meta.env
Object.defineProperty(global, 'import.meta', {
  value: {
    env: {
      VITE_API_URL: 'http://localhost:5000',
    },
  },
  writable: true,
});

// Set a dummy DATABASE_URL for tests that looks more like a real Neon URL
process.env.DATABASE_URL = 'postgresql://testuser:testpassword@ep-test-host-123456.us-east-2.aws.neon.tech/testdb?sslmode=require';