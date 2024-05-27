/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
import mongoose from 'mongoose';

const options = {
    timestamps: {
        createdAt: 'created',
        updatedAt: 'updated'
    },
    toJSON: {
        transform(doc: any, ret: any) {
            ret.id = ret._id.toString();

            delete ret._id;
            delete ret.__v;

            return ret;
        }
    }
};

const definition = {
    roomid: { type: String },
    username: { type: String }
};

export const ActiveUserSchema = new mongoose.Schema(definition, options);

ActiveUserSchema.index({ username: 1 });

export default mongoose.model('ActiveUsers', ActiveUserSchema);
