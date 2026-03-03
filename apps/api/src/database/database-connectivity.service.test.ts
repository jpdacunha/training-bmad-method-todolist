import { DatabaseConnectivityService } from './database-connectivity.service';
import { DATABASE_CONNECTIVITY_QUERY } from '../constants/app.constants';

describe('DatabaseConnectivityService', () => {
  it('executes connectivity query when pool is available', async () => {
    const query = jest.fn().mockResolvedValue({ rows: [] });
    const service = new DatabaseConnectivityService({ query } as never);

    await service.onApplicationBootstrap();

    expect(query).toHaveBeenCalledWith(DATABASE_CONNECTIVITY_QUERY);
  });
});
