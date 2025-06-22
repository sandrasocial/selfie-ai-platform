-- Agent Chat System Database Schema
-- Store all agent conversations
CREATE TABLE IF NOT EXISTS agent_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  agent_name TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  status TEXT DEFAULT 'active',
  current_task TEXT,
  metadata JSONB DEFAULT '{}'
);

-- Store individual messages
CREATE TABLE IF NOT EXISTS agent_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES agent_conversations(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  agent_name TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  metadata JSONB DEFAULT '{}',
  deliverables JSONB DEFAULT '[]'
);

-- Store agent handoffs
CREATE TABLE IF NOT EXISTS agent_handoffs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_agent TEXT NOT NULL,
  to_agent TEXT NOT NULL,
  conversation_id UUID REFERENCES agent_conversations(id),
  task_description TEXT,
  context TEXT,
  deliverables JSONB DEFAULT '[]',
  created_at TIMESTAMP DEFAULT NOW(),
  status TEXT DEFAULT 'pending'
);

-- Enable RLS
ALTER TABLE agent_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_handoffs ENABLE ROW LEVEL SECURITY;

-- Policies (adjust based on your auth setup)
CREATE POLICY "Users can view own conversations" ON agent_conversations
  FOR ALL USING (auth.uid() = user_id OR auth.role() = 'service_role');
  
CREATE POLICY "Users can view own messages" ON agent_messages
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM agent_conversations 
      WHERE id = agent_messages.conversation_id 
      AND (user_id = auth.uid() OR auth.role() = 'service_role')
    )
  );

CREATE POLICY "Users can view own handoffs" ON agent_handoffs
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM agent_conversations 
      WHERE id = agent_handoffs.conversation_id 
      AND (user_id = auth.uid() OR auth.role() = 'service_role')
    )
  );

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_agent_conversations_user_id ON agent_conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_agent_conversations_agent_name ON agent_conversations(agent_name);
CREATE INDEX IF NOT EXISTS idx_agent_messages_conversation_id ON agent_messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_agent_messages_created_at ON agent_messages(created_at);
CREATE INDEX IF NOT EXISTS idx_agent_handoffs_conversation_id ON agent_handoffs(conversation_id); 