const fs = require('fs');

// Read the file
const filePath = './app/tools/starter-kit/page.tsx';
let content = fs.readFileSync(filePath, 'utf8');

// Log initial content for debugging
console.log('Original content length:', content.length);

// Fix all variations of duplicate className patterns
// Pattern 1: className="..." \n className="font-cormorant"
content = content.replace(/className="([^"]*?)"\s*\n\s*className="font-cormorant"/g, 'className="$1 font-cormorant"');

// Pattern 2: className="..." \n className="font-neue"
content = content.replace(/className="([^"]*?)"\s*\n\s*className="font-neue"/g, 'className="$1 font-neue"');

// Pattern 3: className="..." className="font-cormorant" (same line)
content = content.replace(/className="([^"]*?)"\s+className="font-cormorant"/g, 'className="$1 font-cormorant"');

// Pattern 4: className="..." className="font-neue" (same line)
content = content.replace(/className="([^"]*?)"\s+className="font-neue"/g, 'className="$1 font-neue"');

// Extra patterns for multiple line breaks
content = content.replace(/className="([^"]*?)"\s*\n\s*\n\s*className="font-cormorant"/g, 'className="$1 font-cormorant"');
content = content.replace(/className="([^"]*?)"\s*\n\s*\n\s*className="font-neue"/g, 'className="$1 font-neue"');

// Write the file back
fs.writeFileSync(filePath, content);

console.log('Fixed duplicate className attributes in tools/starter-kit');
console.log('New content length:', content.length);
