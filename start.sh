#!/bin/sh

# 1. Generate the Prisma schema (from schema.json)
# This requires `ts-node` or `node` running our utility
echo "🔨 Step 1: Generating Prisma schema..."
npx ts-node src/utils/schema-generator.ts


# 2. Wait for database to be ready
# (Alternatively, implement a wait-for-it pattern)
echo "Waiting for database..."
sleep 5

echo "🔄 Step 3: Synchronizing Database..."
# 3. Synchronize database with the generated schema
npx prisma db push --accept-data-loss

echo "⚙️ Step 4: Generating Client..."
# 4. Generate Prisma client
npx prisma generate

echo "🚀 Step 5: Starting Server..."
# 5. Start the application
npm run dev
