export async function getProjects(paginate, query, sort) {
  // _page=${page}&_limit=7   &_q=${query}  &_sort=${sort}&_order=${order}

  let queryString = "";

  //need to add debouncing
  for (let key in query) {
    queryString += `${key}=${query[key]}&`;
  }
  for (let key in sort) {
    queryString += `${key}=${sort[key]}&`;
  }
  for (let key in paginate) {
    queryString += `${key}=${paginate[key]}&`;
  }

  const response = await fetch("/project?" + queryString);
  const data = await response.json();
  const totalItems = await response.headers.get("X-Total-Count");

  return {
    data,
    totalItems: +totalItems,
  };
}

export function createProject(projectData) {
  return new Promise(async (resolve) => {
    const response = await fetch("/project", {
      method: "POST",
      body: JSON.stringify(projectData),
      headers: { "content-type": "application/json" },
    });
    const data = await response.json();
    // TODO: on server it will only return some info of user (not password)
    resolve({ data });
  });
}

export async function updateProject(data) {
  try {
    const response = await fetch(`/project/${data.id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const res = await response.json();
    return res;
  } catch (error) {
    return error; // Rethrow the error to handle it at the calling site
  }
}

export async function findProjectById(id) {
  const response = await fetch(`/project/${id}`);
  const data = await response.json();
  return data;
}
