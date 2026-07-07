import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

try {
  const dir = 'C:/Users/assau/.gemini/antigravity-ide/brain/08249519-81e1-48b9-ba7d-0fb882a7b15d/.tempmediaStorage';
  const files = fs.readdirSync(dir);
  const list = [];
  for (const f of files) {
    const filePath = path.join(dir, f);
    const stat = fs.statSync(filePath);
    list.push({ name: f, size: stat.size, mtime: stat.mtimeMs });
  }
  list.sort((a, b) => b.mtime - a.mtime);
  fs.writeFileSync('C:/Users/assau/tnf/recent_uploads.json', JSON.stringify(list, null, 2));
} catch (e) {
  fs.writeFileSync('C:/Users/assau/tnf/recent_uploads.json', JSON.stringify({ error: e.message }, null, 2));
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
})
