const REPO = "yuribeats/skyhouse";
const BRANCH = "main";
const DIR = "ascension/data";

const token = () => {
  const t = process.env.GITHUB_TOKEN;
  if (!t) throw new Error("GITHUB_TOKEN env var is not set");
  return t;
};

const apiUrl = (path: string) =>
  `https://api.github.com/repos/${REPO}/contents/${path}?ref=${BRANCH}`;

const rawUrl = (path: string) =>
  `https://raw.githubusercontent.com/${REPO}/${BRANCH}/${path}`;

const path = (key: string) => `${DIR}/${key}`;

export async function getData<T>(key: string): Promise<T[]> {
  const res = await fetch(`${rawUrl(path(key))}?t=${Date.now()}`, {
    cache: "no-store",
  });
  if (res.status === 404) return [];
  if (!res.ok) return [];
  try {
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export async function setData<T>(key: string, data: T[]) {
  const filePath = path(key);
  const headers = {
    Authorization: `Bearer ${token()}`,
    Accept: "application/vnd.github+json",
    "Content-Type": "application/json",
  };

  const meta = await fetch(apiUrl(filePath), { headers, cache: "no-store" });
  let sha: string | undefined;
  if (meta.ok) {
    const j = await meta.json();
    sha = j.sha;
  } else if (meta.status !== 404) {
    throw new Error(`GitHub metadata fetch failed: ${meta.status}`);
  }

  const content = Buffer.from(JSON.stringify(data, null, 2)).toString("base64");

  const put = await fetch(`https://api.github.com/repos/${REPO}/contents/${filePath}`, {
    method: "PUT",
    headers,
    body: JSON.stringify({
      message: `Update ${key}`,
      content,
      branch: BRANCH,
      ...(sha ? { sha } : {}),
    }),
  });

  if (!put.ok) {
    const text = await put.text();
    throw new Error(`GitHub write failed: ${put.status} ${text}`);
  }
}
