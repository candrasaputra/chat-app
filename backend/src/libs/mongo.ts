/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-console */
import mongoose from 'mongoose';
import { MONGO_URI } from 'src/config';

export class Mongo {
    public async connect(): Promise<void> {
        mongoose.Promise = Promise;
        mongoose.connect(MONGO_URI);

        const db = mongoose.connection;

        db.once('open', function callback() {
            console.log('Successfully connected to mongodb');
        });
        db.on('error', (err) => console.error('Error connecting to mongodb', err));
    }

    public async disconnect(): Promise<void> {
        if (await this.isDBReady()) await mongoose.disconnect();
    }

    public async isDBReady(): Promise<boolean> {
        return mongoose.connection.readyState === 1;
    }
}
