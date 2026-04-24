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

const path = (key: string) => `${DIR}/${key}`;

export async function getData<T>(key: string): Promise<T[]> {
  let res: Response;
  try {
    res = await fetch(apiUrl(path(key)), {
      headers: {
        Authorization: `Bearer ${token()}`,
        Accept: "application/vnd.github.raw+json",
      },
      cache: "no-store",
    });
  } catch (err) {
    console.error(`[getData] fetch threw for ${key}:`, err);
    return [];
  }
  if (res.status === 404) return [];
  if (!res.ok) {
    console.error(`[getData] ${key} status=${res.status}`);
    return [];
  }
  const text = await res.text();
  try {
    const data = JSON.parse(text);
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.error(`[getData] parse failed for ${key}: ${(err as Error).message}`);
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
