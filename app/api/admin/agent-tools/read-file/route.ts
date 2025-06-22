import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';

// Define allowed directories for security
const ALLOWED_PATHS = [
  'app',
  'components', 
  'lib',
  'public',
  'styles'
];

export async function POST(request: NextRequest) {
  try {
    const { filePath } = await request.json();
    
    // Security check - ensure path is allowed
    const normalizedPath = path.normalize(filePath);
    const isAllowed = ALLOWED_PATHS.some(allowed => 
      normalizedPath.startsWith(allowed)
    );
    
    if (!isAllowed) {
      return NextResponse.json(
        { error: 'Access denied to this path' },
        { status: 403 }
      );
    }
    
    // Read the file
    const fullPath = path.join(process.cwd(), normalizedPath);
    const content = await readFile(fullPath, 'utf-8');
    
    return NextResponse.json({
      path: filePath,
      content: content,
      language: getLanguageFromPath(filePath)
    });
    
  } catch (error) {
    return NextResponse.json(
      { error: 'File not found or cannot be read' },
      { status: 404 }
    );
  }
}

function getLanguageFromPath(filePath: string): string {
  const ext = path.extname(filePath);
  const langMap: Record<string, string> = {
    '.ts': 'typescript',
    '.tsx': 'typescript',
    '.js': 'javascript',
    '.jsx': 'javascript',
    '.css': 'css',
    '.scss': 'scss',
    '.json': 'json',
    '.md': 'markdown'
  };
  return langMap[ext] || 'plaintext';
} 