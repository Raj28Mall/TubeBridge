# TubeBridge MVP

A content management platform that streamlines the YouTube upload process for teams.

## Features

- Admin/Editor role management
- Video upload with metadata and thumbnails
- Review and approval workflow
- YouTube publishing integration
- Activity logging
- Email notifications

## Setup

1. Copy `.env.example` to `.env` and fill in your credentials
2. Set up PostgreSQL database
3. Run migrations: `make migrate`
4. Install dependencies: `make deps`
5. Run the application: `make run`

## Development

- Run tests: `make test`
- Run with live reload: `make dev`
- Build for production: `make build`
