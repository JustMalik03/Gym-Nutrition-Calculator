export const postRequest = async (url, body) => {
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body
  });

  const data = await res.json();

  if (!res.ok) {
    let message;
    if (data?.message) {
      message = data.message;
    } else {
      message = data;
    }

    return { error: true, status: res.status, message };
  }
  return data;
};


