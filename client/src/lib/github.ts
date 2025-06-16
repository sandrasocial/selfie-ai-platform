const GITHUB_REPO = 'sandrasocial/selfie-ai-platform';
const BRANCH = 'main';
const TOKEN = process.env.AGENT_GITHUB_TOKEN;

export async function fetchFile(path: string) {
  const res = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/contents/${path}?ref=${BRANCH}`, {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      Accept: 'application/vnd.github.v3+json',
    },
  });

  const data = await res.json();
  return {
    content: Buffer.from(data.content, 'base64').toString('utf8'),
    sha: data.sha,
  };
}

export async function commitFile({
  path,
  content,
  message,
}: {
  path: string;
  content: string;
  message: string;
}) {
  const { sha } = await fetchFile(path);
  const encoded = Buffer.from(content).toString('base64');

  const res = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/contents/${path}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      Accept: 'application/vnd.github.v3+json',
    },
    body: JSON.stringify({
      message,
      content: encoded,
      sha,
      branch: BRANCH,
    }),
  });

  return await res.json();
}
