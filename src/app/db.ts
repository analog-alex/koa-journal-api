import { Mongoose } from 'mongoose';
import { logger } from './logger';

const mongoose = new Mongoose();

const connection = async (connectionUrl: string, username: string, password: string) => {

  await mongoose.connect(connectionUrl, {
    user: username,
    pass: password,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
    socketTimeoutMS: 30000,
    connectTimeoutMS: 30000 });
};

mongoose.connection.on('error', err => logger.error(JSON.stringify(err)));
mongoose.connection.once('open', _ => logger.info('Connection established to MongoDB instance'));

const disconnect = () => mongoose.disconnect();

const connect = async () => {
  const connectionUrl: string =
    `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;
  await connection(connectionUrl, process.env.DB_USERNAME, process.env.DB_PASSWORD);
};

export { connect, disconnect, mongoose };
