const GITHUB_REPO = 'sandrasocial/selfie-ai-platform';
const BRANCH = 'main';
const TOKEN = process.env.AGENT_GITHUB_TOKEN;

const BASE_URL = `https://api.github.com/repos/${GITHUB_REPO}/contents`;

async function fetchGitFile(path: string): Promise<{ content: string; sha: string }> {
  const res = await fetch(`${BASE_URL}/${path}?ref=${BRANCH}`, {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      Accept: 'application/vnd.github.v3+json',
    },
  });

  if (!res.ok) throw new Error(`Failed to fetch file: ${path}`);
  const json = await res.json();
  return {
    content: Buffer.from(json.content, 'base64').toString('utf8'),
    sha: json.sha,
  };
}

async function listGitFiles(folder = ''): Promise<string[]> {
  const res = await fetch(`${BASE_URL}/${folder}?ref=${BRANCH}`, {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      Accept: 'application/vnd.github.v3+json',
    },
  });

  if (!res.ok) throw new Error(`Failed to list folder: ${folder}`);
  const data = await res.json();

  const files = await Promise.all(
    data.map(async (item: any) => {
      if (item.type === 'file') return item.path;
      if (item.type === 'dir') return await listGitFiles(item.path);
      return [];
    })
  );

  return files.flat();
}

export { fetchGitFile, listGitFiles };
