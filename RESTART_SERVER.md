# How to Restart the Server

After whitelisting your IP in MongoDB Atlas:

1. **Stop the server**: Press `Ctrl+C` in the terminal running the server

2. **Start the server again**:
   ```bash
   cd server
   npm start
   ```

3. **Look for this success message**:
   ```
   MongoDB Connected: cluster0-shard-00-00.yawqd5y.mongodb.net
   ```

4. **Test signup**: Sign up as "Mahinda Rajapaksha" and the data will appear in MongoDB Atlas

## Quick Command
```powershell
cd server; npm start
```
