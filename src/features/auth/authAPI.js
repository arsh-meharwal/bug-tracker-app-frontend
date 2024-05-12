export function createUser(userData) {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch("/users/signup", {
        method: "POST",
        body: JSON.stringify(userData),
        headers: { "content-type": "application/json" },
      });
      if (response.ok) {
        const data = await response.json();
        resolve({ data });
      } else {
        const error = await response.json();
        reject(error);
      }
    } catch (error) {
      reject(error);
    }
  });
}

export function checkGuestAdmin() {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch("/users/guestadmin", {
        method: "POST",
        headers: { "content-type": "application/json" },
      });
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        resolve({ data });
      } else {
        const error = await response.json();
        reject(error);
      }
    } catch (error) {
      reject(error);
    }
  });
}
export function checkUser(loginInfo) {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch("/users/login", {
        method: "POST",
        body: JSON.stringify(loginInfo),
        headers: { "content-type": "application/json" },
      });
      if (response.ok) {
        const data = await response.json();
        resolve({ data });
      } else {
        const error = await response.json();
        reject(error);
      }
    } catch (error) {
      reject(error);
    }
  });
}

export async function getAllUsers(paginate, query, sort, classification) {
  let queryString = "";

  for (let key in query) {
    queryString += `${key}=${query[key]}&`;
  }
  for (let key in sort) {
    queryString += `${key}=${sort[key]}&`;
  }
  for (let key in paginate) {
    queryString += `${key}=${paginate[key]}&`;
  }
  for (let key in classification) {
    queryString += `${key}=${classification[key]}&`;
  }

  console.log(queryString);

  try {
    const response = await fetch("/users?" + queryString);
    const data = await response.json();
    const totalItems = await response.headers.get("X-Total-Count");
    return { data, totalItems };
  } catch (error) {
    return error;
  }
}

export async function updateUser(userData) {
  try {
    const response = await fetch(`/users/${userData.id}`, {
      method: "PATCH",
      body: JSON.stringify(userData),
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const res = await response.json();
    return res;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error; // Rethrow the error to handle it at the calling site
  }
}
export async function resetPass(data) {
  try {
    const response = await fetch(`/users/reset`, {
      method: "PATCH",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const res = await response.json();
    console.log(res);
    return res;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error; // Rethrow the error to handle it at the calling site
  }
}
export async function logout() {
  try {
    const response = await fetch(`/users/logout`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
  } catch (error) {
    console.error("Error:", error);
    throw error; // Rethrow the error to handle it at the calling site
  }
}
