const fetcher = async (
  input: RequestInfo | URL,
  init?: RequestInit | undefined,
) => {
  const res = await fetch(input, init);

  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }

  return res.json();
};

export default fetcher;
