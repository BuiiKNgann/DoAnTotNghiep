const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Hàm xử lý response chung
const handleResponse = async (response) => {
  const responseData = await response.json();

  if (!response.ok) {
    const error = new Error(responseData.message || "Lỗi máy chủ");
    error.response = {
      data: responseData,
      status: response.status,
      statusText: response.statusText,
    };
    throw error;
  }

  return { data: responseData };
};

// Wrapper giống axios
const axios = {
  // get: async (url, config) => {
  //   const headers = {
  //     ...getAuthHeaders(),
  //     ...(config?.headers || {}),
  //   };

  //   const response = await fetch(url, {
  //     method: "GET",
  //     headers,
  //   });

  //   return await handleResponse(response);
  // },
  get: async (url, config) => {
    const safeConfig = config || {};
    const headers = {
      ...getAuthHeaders(),
      ...(safeConfig.headers || {}),
    };

    // ✅ Xử lý params nếu có
    if (safeConfig.params) {
      const query = new URLSearchParams(safeConfig.params).toString();
      url += `?${query}`;
    }

    const response = await fetch(url, {
      method: "GET",
      headers,
    });

    return await handleResponse(response);
  },

  post: async (url, data, config) => {
    const headers = {
      ...getAuthHeaders(),
      ...(data instanceof FormData
        ? {}
        : { "Content-Type": "application/json" }),
      ...(config?.headers || {}),
    };

    const response = await fetch(url, {
      method: "POST",
      headers,
      body: data instanceof FormData ? data : JSON.stringify(data),
    });

    return await handleResponse(response);
  },

  put: async (url, data, config) => {
    const headers = {
      ...getAuthHeaders(),
      ...(data instanceof FormData
        ? {}
        : { "Content-Type": "application/json" }),
      ...(config?.headers || {}),
    };

    const response = await fetch(url, {
      method: "PUT",
      headers,
      body: data instanceof FormData ? data : JSON.stringify(data),
    });

    return await handleResponse(response);
  },

  delete: async (url, config) => {
    const headers = {
      ...getAuthHeaders(),
      ...(config?.headers || {}),
    };

    const response = await fetch(url, {
      method: "DELETE",
      headers,
    });

    return await handleResponse(response);
  },
};

export default axios;
