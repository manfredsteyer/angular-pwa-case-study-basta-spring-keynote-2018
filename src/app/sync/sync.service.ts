import { QueuedHttpRequest } from './http-request';
import Dexie  from 'dexie';

const tableName = 'requests';

const schema: { [key: string]: string} = {}
schema[tableName] = '++id,url';

const db = new Dexie('queued_http_requests');
db.version(1).stores(schema);


export class SyncService {

    
    enqueue(req: QueuedHttpRequest): Promise<any> {
        return db.table(tableName).put(req);
    }

    fetchAll(): Promise<QueuedHttpRequest[]> {
        return db.table(tableName).toArray() as Promise<QueuedHttpRequest[]>;
    }

    delete(id: number): Promise<void> {
        return db.table(tableName).delete(id);
    }
    

}