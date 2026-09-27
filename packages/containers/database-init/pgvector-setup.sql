-- ====================================================================================
-- 🛡️ COMPLIANCE & VECTOR EXTENSION INITIALIZATION
-- Frameworks: SOC 2 Type II | HIPAA Structural Isolation
-- ====================================================================================

-- 1. Activate the pgvector extension for high-performance agent embeddings (Mem0)
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. Activate standard UUID token generators for tracking unique agent transactions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 3. Provision isolated databases for Backstage IDP plugins to prevent schema cross-contamination
CREATE DATABASE backstage_plugin_catalog;
CREATE DATABASE backstage_plugin_scaffolder;
CREATE DATABASE backstage_plugin_auth;

-- 4. Provision isolated workspace database for the core Agentic Workflows & Mem0 state
CREATE DATABASE agentic_workflow_engine;

-- 5. Establish baseline tables inside the Agentic Workspace for vector search tracking
\c agentic_workflow_engine;

-- Standard vector extension activation inside the specific workflow database context
CREATE EXTENSION IF NOT EXISTS vector;

-- Example schema layout for Mem0 memory embeddings
CREATE TABLE IF NOT EXISTS agent_memory_embeddings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agent_id VARCHAR(255) NOT NULL,
    user_id VARCHAR(255),
    memory_text TEXT NOT NULL,
    -- 1536 dimensions matches standard Open-Source / OpenAI text-embedding vector arrays
    embedding vector(1536), 
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Pre-compile an HNSW index to accelerate Cosine Distance calculations during Playwright E2E loops
CREATE INDEX IF NOT EXISTS agent_memory_vector_idx
ON agent_memory_embeddings
USING hnsw (embedding vector_cosine_ops);
