
fastServer: The Ultra-Fast Bun Router Web Framework
===================================================

**Welcome to `fastServer`** — a groundbreaking web framework for bun. Engineered for performance, it operates at speeds **6 times faster** than the renowned Express.js. With `fastServer`, you don't have to compromise on speed or ease of use; you get both.

Features
--------

*   **🚄 Blazing Fast Performance:** Experience speeds that are **6x faster** than Express.js. Ensure your web applications run lightning-quick with `fastServer`.
    
*   **🛠 Intuitive API:** Familiar with Express.js? Transitioning to `fastServer` is a breeze thanks to our similar API design.
    
*   **📦 Flexibility and Extensibility:** Incorporate middleware, define custom routes, and further expand your application as needed.
    
*   **🔒 Robust Error Handling:** Benefit from our built-in error handling mechanisms to ensure application stability.
    

Quick Start
-----------

    const app = fastServer();
    
    app.get('/', (req, res) => {
        res.send('hello world');
    });
    
    app.server();
    

🛣 Routing
----------

Manage your application's endpoints seamlessly:

    // Handling a GET request
    app.get('/example', (req, res) => {
        res.send('This is a GET request');
    });
    
    // Handling a POST request
    app.post('/example', (req, res) => {
        res.send('This is a POST request');
    });
    

📦 `fastServer.Router`
----------------------

Modularize and organize your routes with `fastServer.Router`:

    const router = app.router();
    
    router.get('/', (req, res) => {
        res.send('Router home page');
    });
    
    router.get('/about', (req, res) => {
        res.send('About page via router');
    });
    
    export default router;
    

Then, seamlessly integrate the router into your main application:

    import * as myRoutes from './myRoutesFile';
    
    app.use('/prefix', myRoutes);
    

🖥 Middlewares
--------------

Integrate middleware functions with ease:

    const loggerMiddleware = (req, res, next) => {
        console.log('Logged at:', Date.now());
        next();
    };
    
    app.use(loggerMiddleware);
    

❗ Error Handling
----------------

Handle errors gracefully and respond aptly:

    app.use((req, res, err, next) => {
        console.error(err?.message);
        res.status(500).send('Oops! Something went wrong.');
    });
    

💡 Why `fastServer`?
--------------------

In today's digital age, performance is crucial. Every millisecond saved can lead to better user experience and engagement. `fastServer` doesn't just offer rapid response times but is designed to handle a myriad of requests efficiently. Whether you're developing a small app or a large-scale system, `fastServer` has your back.