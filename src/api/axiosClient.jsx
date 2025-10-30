// This is for {headers} in api...
/*
| Header                                | Meaning                          | Example Usage                             |
| ------------------------------------- | -------------------------------- | ----------------------------------------- |
| "application/json"                    | You’re sending JSON data         | Most common (used with Axios + .NET APIs) |
| "application/x-www-form-urlencoded"   | Form fields (like HTML <form>)   | Used in login forms (old style)           |
| "multipart/form-data"                 | File upload (images, documents)  | Used with FormData                        |
| "text/plain"                          | Plain text                       | Simple text requests                      |
*/

import axios from "axios";


const protocol = window.location.protocol === "https:" ? "https" : "http";
const port = protocol === "https" ? 5000 : 4000;

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { "Content-Type": "application/json" },
});

export default api;



//import axios from "axios";

//const protocol = window.location.protocol === "https:" ? "https" : "http";
//const port = protocol === "https" ? 5000 : 4000;

//const baseURL = import.meta.env.VITE_API_URL || `${protocol}://${window.location.hostname}:${port}`;

//const api = axios.create({
//    baseURL,
//    headers: { "Content-Type": "application/json" },
//    timeout: 10000,
//});

//export default api;


