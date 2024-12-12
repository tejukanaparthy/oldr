const sqlite3 = require('sqlite3');
const path = require('path');
const dbUtils = require('./dbUtils'); // Adjust the path as necessary

// Mock the sqlite3 module
jest.mock('sqlite3', () => {
    const mDatabase = {
      run: jest.fn((query, params, callback) => callback(null)),
      all: jest.fn((query, params, callback) => callback(null, [])),
    };
    return {
      verbose: jest.fn(() => ({
        Database: jest.fn(() => mDatabase),
      })),
    };
  });
  
jest.mock('path', () => ({
  join: jest.fn()
}));

describe('Database Utility Functions', () => {
  let mockDb;

  beforeEach(() => {
    // Create a mock Database instance
    mockDb = {
      run: jest.fn(),
      all: jest.fn()
    };

    // Replace the actual database instance with our mock
    sqlite3.verbose().Database.mockReturnValue(mockDb);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('runQuery', () => {
    test('should execute a query successfully', async () => {
      const expectedResult = { lastID: 1, changes: 1 };
      mockDb.run.mockImplementation((query, params, callback) => {
        callback.call(expectedResult, null);
      });

      const result = await dbUtils.runQuery('INSERT INTO users (name) VALUES (?)', ['John']);
      
      expect(mockDb.run).toHaveBeenCalledWith(
        'INSERT INTO users (name) VALUES (?)',
        ['John'],
        expect.any(Function)
      );
      expect(result).toEqual(expectedResult);
    });

    test('should reject with an error if query fails', async () => {
      const expectedError = new Error('Database error');
      mockDb.run.mockImplementation((query, params, callback) => {
        callback(expectedError);
      });

      await expect(dbUtils.runQuery('INSERT INTO users (name) VALUES (?)', ['John']))
        .rejects.toThrow('Database error');
    });
  });

  describe('getAll', () => {
    test('should fetch all rows successfully', async () => {
      const expectedRows = [
        { id: 1, name: 'John' },
        { id: 2, name: 'Jane' }
      ];
      mockDb.all.mockImplementation((query, params, callback) => {
        callback(null, expectedRows);
      });

      const result = await dbUtils.getAll('SELECT * FROM users');
      
      expect(mockDb.all).toHaveBeenCalledWith(
        'SELECT * FROM users',
        [],
        expect.any(Function)
      );
      expect(result).toEqual(expectedRows);
    });

    test('should reject with an error if fetching fails', async () => {
      const expectedError = new Error('Database error');
      mockDb.all.mockImplementation((query, params, callback) => {
        callback(expectedError);
      });

      await expect(dbUtils.getAll('SELECT * FROM users'))
        .rejects.toThrow('Database error');
    });
  });
});
