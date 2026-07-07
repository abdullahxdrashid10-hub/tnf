const fs = require('fs');
const path = require('path');

const srcFemale = 'C:\\Users\\assau\\.gemini\\antigravity-ide\\brain\\08249519-81e1-48b9-ba7d-0fb882a7b15d\\fashion_croquis_template_1783027733415.png';
const srcMale = 'C:\\Users\\assau\\.gemini\\antigravity-ide\\brain\\08249519-81e1-48b9-ba7d-0fb882a7b15d\\male_fashion_croquis_1783028086788.png';

// Copy directly to the active webapp's public directory!
const destDir = 'c:\\Users\\assau\\tnf\\website\\public';

try {
  fs.copyFileSync(srcFemale, path.join(destDir, 'croquis-female.png'));
  console.log('Successfully copied female croquis to public/');
} catch (e) {
  console.error('Error writing female croquis:', e.message);
}

try {
  fs.copyFileSync(srcMale, path.join(destDir, 'croquis-male.png'));
  console.log('Successfully copied male croquis to public/');
} catch (e) {
  console.error('Error writing male croquis:', e.message);
}
