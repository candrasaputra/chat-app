/* eslint-disable no-useless-catch */
import fs from 'fs';

export const jsonLoader = (filePath: string) => {
    try {
        const rawData = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(rawData);
    } catch (error) {
        throw error;
    }
};
