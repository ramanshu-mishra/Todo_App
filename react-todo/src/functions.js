export const Server_URL = "http://localhost:3000";
export async function fetchData(url){
    const fetched = await fetch(url);
    const data = await fetched.json();
    return data;
}