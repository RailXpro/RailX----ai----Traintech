"""
RailX AI: Database Connection Manager
Provides async query execution supporting:
1. PostgreSQL / Supabase (if DATABASE_URL is configured and asyncpg is installed)
2. Local SQLite fallback (aiosqlite) for offline local development and quick tests
"""

import os
import re
import aiosqlite
from typing import List, Dict, Any, Optional
from backend_api.config import settings

try:
    import asyncpg
    HAS_ASYNCPG = True
except ImportError:
    HAS_ASYNCPG = False

class Database:
    def __init__(self):
        self.use_postgres = bool(settings.DATABASE_URL.strip()) and HAS_ASYNCPG
        self.pg_pool = None
        self.sqlite_path = settings.SQLITE_DB_PATH

    def _format_query_for_sqlite(self, query: str) -> str:
        # Replaces $1, $2, $10, etc. with ? safely without turning $10 into ?0
        return re.sub(r'\$\d+', '?', query)

    async def connect(self):
        if self.use_postgres:
            try:
                print(f"[RailX DB] Connecting to PostgreSQL at {settings.DATABASE_URL[:25]}...")
                self.pg_pool = await asyncpg.create_pool(dsn=settings.DATABASE_URL, min_size=2, max_size=10)
                print("[RailX DB] PostgreSQL pool initialized successfully.")
                return
            except Exception as e:
                print(f"[RailX DB] PostgreSQL connection failed: {e}. Falling back to SQLite.")
                self.use_postgres = False

        # SQLite Fallback / Local Dev
        print(f"[RailX DB] Initializing SQLite database at {self.sqlite_path}")
        os.makedirs(os.path.dirname(os.path.abspath(self.sqlite_path)), exist_ok=True)
        
        # Verify tables exist or run db_setup
        from database.db_setup import setup_sqlite
        setup_sqlite(self.sqlite_path)
        print("[RailX DB] SQLite database ready.")

    async def disconnect(self):
        if self.pg_pool:
            await self.pg_pool.close()
            print("[RailX DB] PostgreSQL pool closed.")

    async def fetch_all(self, query: str, *args) -> List[Dict[str, Any]]:
        if self.use_postgres and self.pg_pool:
            async with self.pg_pool.acquire() as conn:
                rows = await conn.fetch(query, *args)
                return [dict(row) for row in rows]
        else:
            async with aiosqlite.connect(self.sqlite_path) as conn:
                conn.row_factory = aiosqlite.Row
                formatted_query = self._format_query_for_sqlite(query)
                cursor = await conn.execute(formatted_query, args)
                rows = await cursor.fetchall()
                return [dict(row) for row in rows]

    async def fetch_one(self, query: str, *args) -> Optional[Dict[str, Any]]:
        if self.use_postgres and self.pg_pool:
            async with self.pg_pool.acquire() as conn:
                row = await conn.fetchrow(query, *args)
                return dict(row) if row else None
        else:
            async with aiosqlite.connect(self.sqlite_path) as conn:
                conn.row_factory = aiosqlite.Row
                formatted_query = self._format_query_for_sqlite(query)
                cursor = await conn.execute(formatted_query, args)
                row = await cursor.fetchone()
                return dict(row) if row else None

    async def execute(self, query: str, *args) -> Any:
        if self.use_postgres and self.pg_pool:
            async with self.pg_pool.acquire() as conn:
                return await conn.execute(query, *args)
        else:
            async with aiosqlite.connect(self.sqlite_path) as conn:
                formatted_query = self._format_query_for_sqlite(query)
                cursor = await conn.execute(formatted_query, args)
                await conn.commit()
                return cursor.rowcount

db = Database()
