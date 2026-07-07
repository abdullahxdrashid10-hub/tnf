const fs = require('fs');
const bufF = fs.readFileSync('C:/Users/assau/.gemini/antigravity-ide/brain/08249519-81e1-48b9-ba7d-0fb882a7b15d/fashion_croquis_template_1783027733415.png');
const bufM = fs.readFileSync('C:/Users/assau/.gemini/antigravity-ide/brain/08249519-81e1-48b9-ba7d-0fb882a7b15d/male_fashion_croquis_1783028086788.png');
fs.writeFileSync('c:/Users/assau/tnf/website/public/croquis-female.png', bufF);
fs.writeFileSync('c:/Users/assau/tnf/website/public/croquis-male.png', bufM);
console.log('done');
