import { getIntrospectionQuery, buildClientSchema, printSchema } from 'graphql';

async function introspect() {
  const apiUrl = 'http://localhost:3333/api/graphql';

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: getIntrospectionQuery(),
      }),
    });

    if (!response.ok) {
      console.error(`HTTP error! status: ${response.status}`);
      const text = await response.text();
      console.error('Response:', text);
      process.exit(1);
    }

    const result = await response.json();

    if (result.errors) {
      console.error('GraphQL errors:', result.errors);
      process.exit(1);
    }

    const schema = buildClientSchema(result.data);
    const schemaSDL = printSchema(schema);

    console.log('=== Full GraphQL Schema ===\n');
    console.log(schemaSDL);

    console.log('\n\n=== Looking for uploadFile resolver ===\n');

    // Search for uploadFile in the schema
    const uploadFileMatch = schemaSDL.match(/uploadFile[^\n]*/gi);
    if (uploadFileMatch) {
      uploadFileMatch.forEach(match => console.log(match));
    } else {
      console.log('No uploadFile resolver found');
    }

    // Also look for File related types
    console.log('\n\n=== File-related types ===\n');
    const fileMatch = schemaSDL.match(/type\s+\w*[Ff]ile\w*\s*\{[^}]*\}/gs);
    if (fileMatch) {
      fileMatch.forEach(match => console.log(match));
    }

  } catch (error) {
    console.error('Error introspecting API:', error);
    process.exit(1);
  }
}

introspect();
