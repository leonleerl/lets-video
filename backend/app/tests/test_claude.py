# test the connection to the Claude API

from app.services.claude_client import claude_client

print(claude_client.version())