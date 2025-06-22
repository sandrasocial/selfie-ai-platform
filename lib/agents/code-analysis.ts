export interface CodeAnalysis {
  imports: string[];
  exports: string[];
  components: string[];
  functions: string[];
  dependencies: string[];
  suggestions: string[];
}

export function analyzeTypeScriptFile(content: string): CodeAnalysis {
  const analysis: CodeAnalysis = {
    imports: [],
    exports: [],
    components: [],
    functions: [],
    dependencies: [],
    suggestions: []
  };
  
  // Extract imports
  const importRegex = /import\s+(?:{[^}]+}|\*\s+as\s+\w+|\w+)\s+from\s+['"]([^'"]+)['"]/g;
  let match;
  while ((match = importRegex.exec(content)) !== null) {
    analysis.imports.push(match[1]);
  }
  
  // Extract React components
  const componentRegex = /(?:export\s+)?(?:default\s+)?function\s+([A-Z]\w+)\s*\(/g;
  while ((match = componentRegex.exec(content)) !== null) {
    analysis.components.push(match[1]);
  }
  
  // Extract functions
  const functionRegex = /(?:export\s+)?(?:async\s+)?function\s+([a-z]\w+)\s*\(/g;
  while ((match = functionRegex.exec(content)) !== null) {
    analysis.functions.push(match[1]);
  }
  
  // Extract exports
  const exportRegex = /export\s+(?:default\s+)?(?:function\s+)?(\w+)/g;
  while ((match = exportRegex.exec(content)) !== null) {
    analysis.exports.push(match[1]);
  }
  
  // Extract dependencies from package.json imports
  analysis.dependencies = analysis.imports.filter(imp => 
    !imp.startsWith('.') && !imp.startsWith('@/')
  );
  
  // Add suggestions based on analysis
  if (!content.includes('use client') && content.includes('useState')) {
    analysis.suggestions.push("Add 'use client' directive for client components");
  }
  
  if (content.includes('console.log')) {
    analysis.suggestions.push("Remove console.log statements for production");
  }
  
  if (content.includes('any') && content.includes('TypeScript')) {
    analysis.suggestions.push("Replace 'any' types with proper TypeScript interfaces");
  }
  
  if (content.includes('div') && !content.includes('className')) {
    analysis.suggestions.push("Add proper styling classes to div elements");
  }
  
  if (content.includes('onClick') && !content.includes('useCallback')) {
    analysis.suggestions.push("Consider using useCallback for event handlers");
  }
  
  return analysis;
}

export function analyzeReactComponent(content: string): CodeAnalysis {
  const analysis = analyzeTypeScriptFile(content);
  
  // Additional React-specific analysis
  if (content.includes('useState') && !content.includes('useEffect')) {
    analysis.suggestions.push("Consider adding useEffect for side effects");
  }
  
  if (content.includes('props') && !content.includes('interface')) {
    analysis.suggestions.push("Define TypeScript interface for component props");
  }
  
  if (content.includes('className') && content.includes('"')) {
    analysis.suggestions.push("Use template literals for dynamic className concatenation");
  }
  
  return analysis;
}

export function generateCodeDiff(original: string, modified: string): Array<{
  line: number;
  type: 'add' | 'remove' | 'modify';
  content: string;
}> {
  const originalLines = original.split('\n');
  const modifiedLines = modified.split('\n');
  const diff: Array<{
    line: number;
    type: 'add' | 'remove' | 'modify';
    content: string;
  }> = [];
  
  const maxLines = Math.max(originalLines.length, modifiedLines.length);
  
  for (let i = 0; i < maxLines; i++) {
    const originalLine = originalLines[i] || '';
    const modifiedLine = modifiedLines[i] || '';
    
    if (originalLine !== modifiedLine) {
      if (originalLine && !modifiedLine) {
        diff.push({
          line: i + 1,
          type: 'remove',
          content: originalLine
        });
      } else if (!originalLine && modifiedLine) {
        diff.push({
          line: i + 1,
          type: 'add',
          content: modifiedLine
        });
      } else {
        diff.push({
          line: i + 1,
          type: 'modify',
          content: modifiedLine
        });
      }
    }
  }
  
  return diff;
}

export function validateCodeStructure(content: string): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Check for basic syntax issues
  if (!content.includes('import') && content.includes('React')) {
    warnings.push("Missing React import (not needed in Next.js 13+)");
  }
  
  if (content.includes('export default') && !content.includes('function')) {
    errors.push("Export default without function declaration");
  }
  
  if (content.includes('useState') && !content.includes('use client')) {
    warnings.push("Client component missing 'use client' directive");
  }
  
  // Check for luxury design system compliance
  if (content.includes('rounded-') || content.includes('border-radius')) {
    warnings.push("Using rounded corners - luxury design system uses sharp corners");
  }
  
  if (content.includes('shadow-') || content.includes('box-shadow')) {
    warnings.push("Using shadows - luxury design system is flat");
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
} 