import { NextResponse } from 'next/server';
import { readdir } from 'fs/promises';
import path from 'path';

interface FileNode {
  name: string;
  path: string;
  type: 'file' | 'directory';
  children?: FileNode[];
}

export async function GET() {
  try {
    const projectStructure = await scanDirectory('.');
    
    return NextResponse.json({
      structure: projectStructure,
      summary: {
        totalFiles: countFiles(projectStructure),
        routes: await getRoutes(),
        components: await getComponents()
      }
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to scan project' },
      { status: 500 }
    );
  }
}

async function scanDirectory(dirPath: string, depth = 0, maxDepth = 3): Promise<FileNode[]> {
  if (depth > maxDepth) return [];
  
  const entries = await readdir(dirPath, { withFileTypes: true });
  const nodes: FileNode[] = [];
  
  for (const entry of entries) {
    // Skip node_modules, .git, etc
    if (shouldSkip(entry.name)) continue;
    
    const fullPath = path.join(dirPath, entry.name);
    
    if (entry.isDirectory()) {
      nodes.push({
        name: entry.name,
        path: fullPath,
        type: 'directory',
        children: await scanDirectory(fullPath, depth + 1, maxDepth)
      });
    } else {
      nodes.push({
        name: entry.name,
        path: fullPath,
        type: 'file'
      });
    }
  }
  
  return nodes;
}

function shouldSkip(name: string): boolean {
  const skipList = ['node_modules', '.git', '.next', 'dist', '.env'];
  return skipList.includes(name) || name.startsWith('.');
}

function countFiles(nodes: FileNode[]): number {
  let count = 0;
  for (const node of nodes) {
    if (node.type === 'file') {
      count++;
    } else if (node.children) {
      count += countFiles(node.children);
    }
  }
  return count;
}

async function getRoutes(): Promise<string[]> {
  try {
    const appDir = await scanDirectory('app', 0, 2);
    const routes: string[] = [];
    
    function extractRoutes(nodes: FileNode[], prefix = '') {
      for (const node of nodes) {
        if (node.type === 'file' && node.name === 'page.tsx') {
          routes.push(prefix);
        } else if (node.type === 'directory' && node.children) {
          const newPrefix = prefix ? `${prefix}/${node.name}` : node.name;
          extractRoutes(node.children, newPrefix);
        }
      }
    }
    
    extractRoutes(appDir);
    return routes;
  } catch (error) {
    return [];
  }
}

async function getComponents(): Promise<string[]> {
  try {
    const componentsDir = await scanDirectory('components', 0, 2);
    const components: string[] = [];
    
    function extractComponents(nodes: FileNode[]) {
      for (const node of nodes) {
        if (node.type === 'file' && (node.name.endsWith('.tsx') || node.name.endsWith('.ts'))) {
          components.push(node.name.replace(/\.(tsx|ts)$/, ''));
        } else if (node.type === 'directory' && node.children) {
          extractComponents(node.children);
        }
      }
    }
    
    extractComponents(componentsDir);
    return components;
  } catch (error) {
    return [];
  }
} 