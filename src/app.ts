import { startServer } from './server';

export const initApp = async () => {
  try {
    const { app, port } = await startServer();

    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
      console.log(`Swagger UI available at http://localhost:${port}/api-docs`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

initApp();
