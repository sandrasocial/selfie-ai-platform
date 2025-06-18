export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | FormData,
): Promise<any> {
  const isFormData = data instanceof FormData;
  
  const res = await fetch(url, {
    method,
    headers: isFormData ? {} : data ? { "Content-Type": "application/json" } : {},
    body: isFormData ? data : data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ message: res.statusText }));
    const error = new Error(errorData.message || `${res.status}: ${res.statusText}`);
    (error as any).upgradeRequired = errorData.upgradeRequired;
    throw error;
  }

  // Handle blob responses (like PDFs)
  if (res.headers.get("content-type")?.includes("application/pdf")) {
    return res;
  }

  return res.json();
}
