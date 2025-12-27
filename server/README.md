# GearGuard Maintenance Management System - Backend

A comprehensive REST API for managing equipment maintenance operations, built with Node.js, Express, TypeScript, and PostgreSQL.

## Features

- 🔧 **Equipment Management** - Track all company assets and machinery
- 📋 **Maintenance Requests** - Create and manage corrective & preventive maintenance
- 👥 **Team Management** - Organize maintenance teams and technicians
- 📊 **Dashboard Analytics** - Real-time statistics and KPIs
- 🗄️ **PostgreSQL Database** - Robust relational data storage
- 🔒 **Type-Safe** - Full TypeScript implementation
- ⚡ **Fast & Scalable** - Built with Express.js

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Native pg driver with SQL
- **Validation**: Zod (planned)
- **CORS**: Enabled for frontend integration

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or higher)
- [PostgreSQL](https://www.postgresql.org/) (v14 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

## Installation

1. **Navigate to the server directory:**
   ```bash
   cd server
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   
   Copy the example environment file:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your configuration:
   ```env
   PORT=5000
   NODE_ENV=development
   
   # Database Configuration
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=gearguard
   DB_USER=postgres
   DB_PASSWORD=your_password_here
   
   # CORS Configuration
   CORS_ORIGIN=http://localhost:5173
   ```

4. **Create PostgreSQL database:**
   ```bash
   # Connect to PostgreSQL
   psql -U postgres
   
   # Create database
   CREATE DATABASE gearguard;
   
   # Exit psql
   \q
   ```

5. **Run database migrations:**
   ```bash
   npm run db:migrate
   ```

6. **Seed the database with initial data:**
   ```bash
   npm run db:seed
   ```

## Running the Server

### Development Mode (with auto-reload)
```bash
npm run dev
```

### Production Mode
```bash
npm run build
npm start
```

The server will start on `http://localhost:5000` (or your configured PORT).

## API Endpoints

### Health Check
- `GET /api/health` - Check API status

### Departments
- `GET /api/departments` - Get all departments
- `GET /api/departments/:id` - Get department by ID

### Employees
- `GET /api/employees` - Get all employees
- `GET /api/employees/:id` - Get employee by ID

### Maintenance Teams
- `GET /api/teams` - Get all teams with members
- `GET /api/teams/:id` - Get team by ID
- `POST /api/teams` - Create new team
- `PUT /api/teams/:id` - Update team
- `DELETE /api/teams/:id` - Delete team

### Equipment
- `GET /api/equipment` - Get all equipment
- `GET /api/equipment?isActive=true` - Get active equipment only
- `GET /api/equipment/:id` - Get equipment by ID
- `POST /api/equipment` - Create new equipment
- `PUT /api/equipment/:id` - Update equipment
- `DELETE /api/equipment/:id` - Delete equipment

### Maintenance Requests
- `GET /api/requests` - Get all requests
- `GET /api/requests?status=new` - Filter by status
- `GET /api/requests?equipmentId=equip-1` - Filter by equipment
- `GET /api/requests/:id` - Get request by ID
- `POST /api/requests` - Create new request
- `PUT /api/requests/:id` - Update request
- `PATCH /api/requests/:id/status` - Update request status
- `DELETE /api/requests/:id` - Delete request

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics

## Database Scripts

### Reset Database (CAUTION: Deletes all data)
```bash
npm run db:reset
```

### Re-run Migrations
```bash
npm run db:migrate
```

### Re-seed Data
```bash
npm run db:seed
```

## Database Schema

The system uses the following main tables:

- **departments** - Company departments
- **employees** - Staff members
- **maintenance_teams** - Maintenance teams
- **team_members** - Team membership (junction table)
- **equipment** - Company assets and machinery
- **maintenance_requests** - Maintenance work orders

See [src/database/migrate.ts](src/database/migrate.ts) for full schema details.

## Project Structure

```
server/
├── src/
│   ├── config/           # Configuration files
│   ├── controllers/      # Request handlers
│   ├── database/         # Database setup, migrations, seeds
│   ├── middleware/       # Express middleware
│   ├── routes/           # API route definitions
│   ├── types/            # TypeScript type definitions
│   └── index.ts          # Application entry point
├── dist/                 # Compiled JavaScript (generated)
├── .env                  # Environment variables (create from .env.example)
├── .env.example          # Example environment configuration
├── package.json          # Dependencies and scripts
└── tsconfig.json         # TypeScript configuration
```

## API Response Format

### Success Response
```json
{
  "status": "success",
  "data": { ... }
}
```

### Error Response
```json
{
  "status": "error",
  "message": "Error description"
}
```

## CORS Configuration

The API is configured to accept requests from the frontend running at `http://localhost:5173` by default. Update `CORS_ORIGIN` in your `.env` file to change this.

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## Troubleshooting

### Database Connection Issues
- Ensure PostgreSQL is running: `pg_ctl status`
- Check credentials in `.env` file
- Verify database exists: `psql -U postgres -l`

### Port Already in Use
- Change `PORT` in `.env` file
- Kill process using the port: `netstat -ano | findstr :5000` (Windows)

### Migration Errors
- Drop and recreate database
- Run `npm run db:reset` followed by `npm run db:seed`

## License

MIT License - See LICENSE file for details

## Support

For issues and questions, please open an issue on GitHub.
