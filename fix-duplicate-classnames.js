const fs = require('fs');

// Read the file
const filePath = './app/(marketing)/products/starter-kit/page.tsx';
let content = fs.readFileSync(filePath, 'utf8');

// Fix the duplicate className patterns
// Pattern 1: className="..." className="font-cormorant"
content = content.replace(/className="([^"]*?)"\s*\n\s*className="font-cormorant"/g, 'className="$1 font-cormorant"');

// Pattern 2: className="..." className="font-neue" 
content = content.replace(/className="([^"]*?)"\s*\n\s*className="font-neue"/g, 'className="$1 font-neue"');

// Write the file back
fs.writeFileSync(filePath, content);

console.log('Fixed duplicate className attributes');
