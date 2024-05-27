import _ from 'lodash';
import { StandardError } from 'src/libs/standard-error';

export interface IGenericObject {
    [key: string]: any;
}

interface IModelErrorCode {
    FIND_ONE_DOC_ERROR: string;
    DOC_NOT_FOUND_ERROR: string;
    CREATE_DOC_ERROR: string;
    FIND_BY_ID_AND_UPDATE_DOC_ERROR: string;
    FIND_BY_ID_ERROR: string;
    FIND_BY_QUERY_ERROR: string;
    DUPLICATE_DOC_ERROR: string;
    REMOVE_DOC_ERROR: string;
    UPDATE_MANY_DOC_ERROR: string;
    INSERT_MANY_DOC_ERROR: string;
}

const MONGOOSE_DUPLICATE_ERROR_CODE = 11000;

export enum SortEnum {
    ASCENDING = 'asc',
    DESCENDING = 'desc'
}

export class BaseModel {
    protected model: any;

    protected errorCodes: IModelErrorCode;

    constructor(model: any, errorCodes: IModelErrorCode) {
        this.model = model;
        this.errorCodes = errorCodes;
    }

    public async findOne(query: any): Promise<IGenericObject> {
        const errorContext = { query };

        let doc;

        try {
            doc = await this.model.findOne(query);
        } catch (e) {
            throw new StandardError(this.errorCodes.FIND_ONE_DOC_ERROR, 'Find one doc error', e, errorContext);
        }

        if (!doc) {
            throw new StandardError(this.errorCodes.DOC_NOT_FOUND_ERROR, 'Could not find doc', null, errorContext);
        }

        return doc.toJSON();
    }

    public async create(creationData: any): Promise<IGenericObject> {
        const errorContext = { creationData };

        try {
            const doc = await this.model.create(creationData);

            return doc.toJSON();
        } catch (e) {
            if (e.code === MONGOOSE_DUPLICATE_ERROR_CODE) {
                throw new StandardError(
                    this.errorCodes.DUPLICATE_DOC_ERROR,
                    'Could not create duplicated doc',
                    e,
                    errorContext
                );
            }

            throw new StandardError(this.errorCodes.CREATE_DOC_ERROR, 'Create doc model error', e, errorContext);
        }
    }

    public async findByIdAndUpdate(id: string, updateData: any): Promise<IGenericObject> {
        const errorContext = { id, updateData };

        try {
            const doc = await this.model.findOneAndUpdate({ _id: id }, { $set: updateData }, { new: true });

            if (!doc) {
                throw new StandardError(this.errorCodes.FIND_ONE_DOC_ERROR, 'Find one doc error', null, errorContext);
            }

            return doc.toJSON();
        } catch (e) {
            if (e instanceof StandardError) {
                throw e;
            }

            throw new StandardError(
                this.errorCodes.FIND_BY_ID_AND_UPDATE_DOC_ERROR,
                'Find by id and update doc error',
                e,
                errorContext
            );
        }
    }

    public async findOneAndUpdate(query: any, updateData: any): Promise<IGenericObject> {
        const errorContext = { query, updateData };

        try {
            const doc = await this.model.findOneAndUpdate(query, { $set: updateData }, { new: true });

            if (!doc) {
                throw new StandardError(this.errorCodes.DOC_NOT_FOUND_ERROR, 'Doc not found error', null, errorContext);
            }

            return doc.toJSON();
        } catch (e) {
            if (e instanceof StandardError) {
                throw e;
            }

            throw new StandardError(
                this.errorCodes.FIND_BY_ID_AND_UPDATE_DOC_ERROR,
                'Find by id and update doc error',
                e,
                errorContext
            );
        }
    }

    public async upsert(query: any, updateData: any): Promise<IGenericObject> {
        const errorContext = { query, updateData };

        let doc;

        try {
            doc = await this.model.findOneAndUpdate(query, updateData, {
                new: true,
                upsert: true // Make this update into an upsert
            });
        } catch (e) {
            throw new StandardError(this.errorCodes.FIND_ONE_DOC_ERROR, 'Find one doc error', e, errorContext);
        }

        return doc.toJSON();
    }

    public async update(query: any, updateData: any): Promise<any> {
        const errorContext = { query, updateData };

        let doc;

        try {
            doc = await this.model.updateOne(query, updateData);
        } catch (e) {
            throw new StandardError(this.errorCodes.FIND_ONE_DOC_ERROR, 'Find one doc error', e, errorContext);
        }

        return doc;
    }

    public async findById(id: string): Promise<IGenericObject> {
        const errorContext = { id };

        let doc;

        try {
            doc = await this.model.findById(id);
        } catch (e) {
            throw new StandardError(this.errorCodes.FIND_BY_ID_ERROR, 'Find doc by id error', e, errorContext);
        }

        if (!doc) {
            throw new StandardError(this.errorCodes.DOC_NOT_FOUND_ERROR, 'Could not find doc', null, errorContext);
        }

        return doc.toJSON();
    }

    public async find(query: IGenericObject, sort = SortEnum.ASCENDING): Promise<IGenericObject[]> {
        const errorContext = { query };

        try {
            const docs: IGenericObject[] = await this.model
                .find(query)
                .sort({ created_at: sort === SortEnum.ASCENDING ? 1 : -1 });

            return _.map(docs, (doc) => {
                return doc.toJSON();
            });
        } catch (e) {
            throw new StandardError(this.errorCodes.FIND_BY_QUERY_ERROR, 'Find doc by id error', e, errorContext);
        }
    }

    public async delete(query: IGenericObject): Promise<void> {
        const errorContext = { query };

        try {
            await this.model.deleteOne(query);
        } catch (e) {
            throw new StandardError(this.errorCodes.REMOVE_DOC_ERROR, 'Could not delete document', e, errorContext);
        }
    }

    // only use this function in test mode
    public async deleteMany(query: IGenericObject): Promise<void> {
        const errorContext = { query };

        try {
            await this.model.deleteMany(query);
        } catch (e) {
            throw new StandardError(this.errorCodes.REMOVE_DOC_ERROR, 'Could not delete document', e, errorContext);
        }
    }

    public async insertMany(data: IGenericObject[]): Promise<void> {
        const errorContext = { data };

        try {
            await this.model.insertMany(data);
        } catch (error) {
            throw new StandardError(
                this.errorCodes.INSERT_MANY_DOC_ERROR,
                'Could not create many document',
                error,
                errorContext
            );
        }
    }

    public async updateMany(query: IGenericObject, data: IGenericObject): Promise<void> {
        const errorContext = { data };

        try {
            await this.model.updateMany(query, data);
        } catch (error) {
            throw new StandardError(
                this.errorCodes.UPDATE_MANY_DOC_ERROR,
                'Could not update many document',
                error,
                errorContext
            );
        }
    }
}
