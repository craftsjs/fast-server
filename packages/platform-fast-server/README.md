FastServer Integration with NestJS

FastServer Integration with NestJS
==================================

FastServer offers exceptional performance for web applications. With the `FastServerAdapter`, you can integrate FastServer's capabilities into your NestJS application easily.

Installation
------------

First, you need to install the necessary packages. Run the following command in your project directory:

    bun add @craftsjs/platform-fast-server @craftsjs/fast-server

This will add `@craftsjs/platform-fast-server` and `@craftsjs/fast-server` to your project dependencies.

Usage
-----

After installation, you can set up FastServer as the HTTP server for your NestJS application. Here's an example of how to do it:

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
    

This example demonstrates how to initialize a NestJS application with `FastServerAdapter`, set a global prefix for your routes, and start the application on a specified port.

Make sure your `AppModule` is set up correctly to leverage the full potential of FastServer with NestJS.