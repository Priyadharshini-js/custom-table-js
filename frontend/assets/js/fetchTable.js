const BASE_URL = "http://localhost:3000/users";

export async function fetchUsers() {
    const response = await fetch(BASE_URL);
    if (!response.ok) {
        throw new Error("Network response was not ok");
    }
    return await response.json();
}
