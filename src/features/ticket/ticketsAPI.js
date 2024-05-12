export async function getTickets(paginate, query, sort) {
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

  const response = await fetch("http://localhost:8081/tickets?" + queryString);
  const data = await response.json();
  const totalItems = await response.headers.get("X-Total-Count");

  return {
    data,
    totalItems: +totalItems,
  };
}

export function createTicket(ticketData) {
  return new Promise(async (resolve) => {
    const response = await fetch("http://localhost:8081/tickets", {
      method: "POST",
      body: JSON.stringify(ticketData),
      headers: { "content-type": "application/json" },
    });
    const data = await response.json();
    // TODO: on server it will only return some info of user (not password)
    resolve({ data });
    console.log(data);
  });
}

export async function deleteAllTicket() {
  try {
    const response = await fetch(`http://localhost:8081/tickets/delete`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const res = await response.json();
    return res;
  } catch (error) {
    console.error("Error deleting Tickets:", error);
    throw error; // Rethrow the error to handle it at the calling site
  }
}
export async function deleteTicket(id) {
  try {
    const response = await fetch(`http://localhost:8081/tickets/delete/${id}`, {
      method: "DELETE",
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
export async function updateTicket(ticketData) {
  try {
    const response = await fetch(
      `http://localhost:8081/tickets/${ticketData.id}`,
      {
        method: "PATCH",
        body: JSON.stringify(ticketData),
        headers: { "Content-Type": "application/json" },
      }
    );
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

export async function findTicketById(id) {
  const response = await fetch(`http://localhost:8081/tickets/${id}`);
  const data = await response.json();
  return data;
}
