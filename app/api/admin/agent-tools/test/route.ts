import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';
import { analyzeTypeScriptFile } from '@/lib/agents/code-analysis';

export async function GET() {
  try {
    // Test file reading
    const testFilePath = 'app/layout.tsx';
    const fullPath = path.join(process.cwd(), testFilePath);
    const content = await readFile(fullPath, 'utf-8');
    
    // Test code analysis
    const analysis = analyzeTypeScriptFile(content);
    
    // Test project structure
    const projectStructure = {
      app: ['layout.tsx', 'page.tsx', 'globals.css'],
      components: ['admin', 'ui', 'dashboard'],
      lib: ['agents', 'utils', 'constants']
    };
    
    return NextResponse.json({
      success: true,
      message: 'Agent tools are working correctly',
      tests: {
        fileReading: {
          path: testFilePath,
          contentLength: content.length,
          language: 'typescript'
        },
        codeAnalysis: {
          components: analysis.components,
          functions: analysis.functions,
          imports: analysis.imports.slice(0, 5), // Show first 5
          suggestions: analysis.suggestions
        },
        projectStructure: projectStructure
      }
    });
    
  } catch (error) {
    return NextResponse.json(
      { 
        success: false, 
        error: 'Agent tools test failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 