import { config } from 'dotenv';
import path from 'path';

// Load environment variables from .env.test
config({ path: path.resolve(process.cwd(), '.env.test') });

// Import and run the tests
import './test-database-security'; 