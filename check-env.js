import fs from 'fs';
import path from 'path';

const envPath = path.resolve(process.cwd(), '.env.local');

console.log(`Checking file at: ${envPath}`);

if (!fs.existsSync(envPath)) {
    console.error('❌ .env.local not found!');
    process.exit(1);
}

const content = fs.readFileSync(envPath, 'utf-8');
const lines = content.split('\n');

console.log('--- .env.local content analysis ---');
lines.forEach((line, index) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;

    const parts = trimmed.split('=');
    const key = parts[0].trim();
    const value = parts.slice(1).join('=').trim();

    console.log(`Line ${index + 1}: Key="${key}" | Value Length=${value.length} ${value.length > 5 ? '(Present)' : '(Empty/Short)'}`);

    if (key === 'VITE_SUPABASE_URL') {
        console.log(`✅ FOUND VITE_SUPABASE_URL`);
    }
});

console.log('--- End analysis ---');
