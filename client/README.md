### isssues

cors blocked 
        Access to XMLHttpRequest at 'http://localhost:3001/login' from origin 'http://localhost:5173' has been blocked by CORS policy: Response to preflight request doesn't pass access control check: No 'Access-Control-Allow-Origin' header is present on the requested resource.
install cors library


error 500
        POST http://localhost:3001/login 500 (Internal Server Error)
use body parser
Body parser is a popular middleware used in web frameworks like Express.js to handle data sent in an HTTP request body. It essentially acts as a translator, taking the raw data from the request and converting it into a format that's easier for your application to work with.


## 400 error from server
        client:
        POST http://localhost:3001/login 400 (Bad Request)

        server:
         WebapiAuthenticationError: An authentication error occurred while communicating with Spotify's Web API.   Details: invalid_grant Invalid authorization code.

In main.jsx file we had React.StrictModem which meant it will render components twice in the development mode. 

**Explanation in Context**

In the useAuth hook, the code is sent to the server inside a useEffect hook. When React.StrictMode is enabled, this useEffect hook runs twice, which results in:

1.The first call to the server with the authorization code succeeds, and the server exchanges the code for tokens.
2.The second call to the server with the same code fails because the authorization code has already been used.

**To Solve the Issue**

- The simplist way to solve the issue is to remove `React.StrictMode` from main.jsx file

- we can also use useRef(). **useRef is helpful for tracking state that doesn’t trigger re-renders when it changes.**
we initialize firstRender with the value of true then the useEffect checks if firstRender.current is true. If it is, it proceeds with the API call and sets firstRender.current to false, preventing the effect from running again on subsequent renders.

        ```
        import { useEffect, useState, useRef } from "react";
        import axios from "axios";

        const useAuth = (code) => {
        const [accessToken, setAccessToken] = useState();
        const [refreshToken, setRefreshToken] = useState();
        const [expiresIn, setExpiresIn] = useState();
        const firstRender = useRef(true);

        useEffect(() => {
        if (!code || !firstRender.current) return;
        firstRender.current = false;

        axios.post('http://localhost:3001/login', { code })
        .then(res => {
                console.log('Response from /login:', res.data);
                setAccessToken(res.data.accessToken);
                setRefreshToken(res.data.refreshToken);
                setExpiresIn(res.data.expiresIn);
                window.history.pushState({}, null, "/");  // Clear the query params
        }).catch((err) => {
                console.log("Error in login useEffect:", err);
                // Handle error appropriately
        });
        }, [code]);

        useEffect(() => {
        if (!refreshToken || !expiresIn) return;
        const interval = setInterval(() => {
        axios.post("http://localhost:3001/refresh", { refreshToken })
                .then(res => {
                setAccessToken(res.data.accessToken);
                setExpiresIn(res.data.expiresIn);
                }).catch(() => {
                window.location = "/";
                });
        }, (expiresIn - 60) * 1000);

        return () => clearInterval(interval);
        }, [refreshToken, expiresIn]);

        return accessToken;
        };

        export default useAuth;

        ```

As this is a small web app we will go with the first way.
