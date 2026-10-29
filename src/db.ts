import { Pool } from 'pg';

export const pool = new Pool({
  // इथे तुमचा Postgres युझरनेम, पासवर्ड आणि डेटाबेसचे नाव टाका:
  connectionString: 'postgresql://postgres:123456@localhost:5432/swaishma_cafe',
});