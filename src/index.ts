import AppServer from './server';

// start server with default dotenv path
const server = new AppServer();
server.start('.env', true);
