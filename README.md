
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

```typescript
const app = fastServer();

app.get('/', (req, res) => {
    res.send('hello world');
});

app.server();
```   

🛣 Routing
----------

Manage your application's endpoints seamlessly:

```typescript
// Handling a GET request
app.get('/example', (req, res) => {
    res.send('This is a GET request');
});

// Handling a POST request
app.post('/example', (req, res) => {
    res.send('This is a POST request');
});
```       

📦 `fastServer.Router`
----------------------

Modularize and organize your routes with `fastServer.Router`:

```typescript
const router = app.router();

router.get('/', (req, res) => {
    res.send('Router home page');
});

router.get('/about', (req, res) => {
    res.send('About page via router');
});

export default router;
``` 

Then, seamlessly integrate the router into your main application:

```typescript
import * as myRoutes from './myRoutesFile';

app.use('/prefix', myRoutes);
``` 

🖥 Middlewares
--------------

Integrate middleware functions with ease:

```typescript
const loggerMiddleware = (req, res, next) => {
    console.log('Logged at:', Date.now());
    next();
};

app.use(loggerMiddleware);
```   

❗ Error Handling
----------------

Handle errors gracefully and respond aptly:

```typescript
app.use((req, res, err, next) => {
    console.error(err?.message);
    res.status(500).send('Oops! Something went wrong.');
});
 ```      

💡 Why `fastServer`?
--------------------

In today's digital age, performance is crucial. Every millisecond saved can lead to better user experience and engagement. `fastServer` doesn't just offer rapid response times but is designed to handle a myriad of requests efficiently. Whether you're developing a small app or a large-scale system, `fastServer` has your back.

wrk -t 10 -c 10 -d 30s http://localhost:3000


🚀 FastServer Integration with NestJS
-------------------------------------

FastServer offers exceptional performance for web applications. With the `FastServerAdapter`, you can integrate FastServer's capabilities into your NestJS application easily.

🔧 Installation
---------------

First, you need to install the necessary packages. Run the following command in your project directory:

```console
    bun add @craftsjs/platform-fast-server @craftsjs/fast-server
```

This will add `@craftsjs/platform-fast-server` and `@craftsjs/fast-server` to your project dependencies.

🛠 Usage
--------

After installation, you can set up FastServer as the HTTP server for your NestJS application. Here's an example of how to do it:

```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { FastServerAdapter } from '@craftsjs/platform-fast-server';

async function bootstrap() {
    // Create a NestJS application using FastServerAdapter
    const app = await NestFactory.create(AppModule, new FastServerAdapter());

    // Set a global prefix for all routes (optional)
    app.setGlobalPrefix('api');

    // Start listening on the specified port
    await app.listen(process.env.PORT || 3000);
}

bootstrap();
 ```     

This example demonstrates how to initialize a NestJS application with `FastServerAdapter`, set a global prefix for your routes, and start the application on a specified port.

Make sure your `AppModule` is set up correctly to leverage the full potential of FastServer with NestJS.