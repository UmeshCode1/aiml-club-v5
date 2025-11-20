# Appwrite Functions Setup Guide

This guide explains how to set up Appwrite Cloud Functions for email notifications and ChatGPT integration.

---

## Function 1: sendEmail

**Purpose:** Send email notifications via Gmail SMTP

### Setup Steps

1. Navigate to your Appwrite Console → Functions
2. Click "Create Function"
3. Configure:
   - **Name:** sendEmail
   - **Runtime:** Node.js 18.0
   - **Execute Access:** Users

4. Add Environment Variables:
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=aimlcluboct@gmail.com
SMTP_PASSWORD=your_app_specific_password
```

5. Install Dependencies (package.json):
```json
{
  "name": "send-email",
  "version": "1.0.0",
  "dependencies": {
    "node-appwrite": "^11.0.0",
    "nodemailer": "^6.9.0"
  }
}
```

6. Function Code (index.js):
```javascript
const sdk = require('node-appwrite');
const nodemailer = require('nodemailer');

module.exports = async ({ req, res, log, error }) => {
  try {
    // Parse request payload
    const payload = JSON.parse(req.payload || req.body);
    const { to, subject, html, from } = payload;

    if (!to || !subject || !html) {
      return res.json({
        success: false,
        error: 'Missing required fields: to, subject, html'
      }, 400);
    }

    // Create transporter
    const transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    // Send email
    const info = await transporter.sendMail({
      from: from || `"AIML Club OCT" <${process.env.SMTP_USER}>`,
      to: Array.isArray(to) ? to.join(', ') : to,
      subject: subject,
      html: html,
    });

    log(`Email sent: ${info.messageId}`);

    return res.json({
      success: true,
      messageId: info.messageId
    });

  } catch (err) {
    error(`Failed to send email: ${err.message}`);
    return res.json({
      success: false,
      error: err.message
    }, 500);
  }
};
```

### Usage Example

```javascript
import { functions } from '@/lib/appwrite';

async function sendWelcomeEmail(userEmail, userName) {
  await functions.createExecution(
    'sendEmail', // Function ID
    JSON.stringify({
      to: userEmail,
      subject: 'Welcome to AIML Club!',
      html: `
        <h1>Welcome ${userName}!</h1>
        <p>Thank you for joining the AI & ML Club at OCT.</p>
      `
    })
  );
}
```

---

## Function 2: aiResponder

**Purpose:** Generate ChatGPT responses for suggestions

### Setup Steps

1. Navigate to Appwrite Console → Functions
2. Click "Create Function"
3. Configure:
   - **Name:** aiResponder
   - **Runtime:** Node.js 18.0
   - **Execute Access:** Users

4. Add Environment Variables:
```
OPENAI_API_KEY=your_openai_api_key
```

5. Install Dependencies (package.json):
```json
{
  "name": "ai-responder",
  "version": "1.0.0",
  "dependencies": {
    "node-appwrite": "^11.0.0",
    "openai": "^4.20.0"
  }
}
```

6. Function Code (index.js):
```javascript
const sdk = require('node-appwrite');
const OpenAI = require('openai');

module.exports = async ({ req, res, log, error }) => {
  try {
    // Parse request
    const payload = JSON.parse(req.payload || req.body);
    const { question, context } = payload;

    if (!question) {
      return res.json({
        success: false,
        error: 'Question is required'
      }, 400);
    }

    // Initialize OpenAI
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // Create system prompt
    const systemPrompt = `You are a helpful assistant for the AI & Machine Learning Club at Oriental College of Technology, Bhopal. 

Your role is to:
- Answer questions about AI/ML concepts
- Provide guidance on club activities
- Help students with their queries
- Be friendly, professional, and encouraging

Keep responses concise (2-3 paragraphs max) and student-friendly.`;

    // Generate response
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        {
          role: 'user',
          content: question,
        },
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    const answer = completion.choices[0].message.content;

    log(`Generated response for question: ${question.substring(0, 50)}...`);

    return res.json({
      success: true,
      answer: answer,
      tokens: completion.usage.total_tokens
    });

  } catch (err) {
    error(`AI Response failed: ${err.message}`);
    return res.json({
      success: false,
      error: err.message
    }, 500);
  }
};
```

### Usage Example

```javascript
import { functions } from '@/lib/appwrite';

async function getAIResponse(userQuestion) {
  const execution = await functions.createExecution(
    'aiResponder',
    JSON.stringify({
      question: userQuestion
    })
  );

  const response = JSON.parse(execution.response);
  return response.answer;
}
```

---

## Function 3: sendNotification

**Purpose:** Create and broadcast notifications

### Setup Steps

1. Create Function named "sendNotification"
2. Runtime: Node.js 18.0
3. Add Database permissions

4. Function Code (index.js):
```javascript
const sdk = require('node-appwrite');

module.exports = async ({ req, res, log, error }) => {
  try {
    const payload = JSON.parse(req.payload || req.body);
    const { title, message, type, link, sendEmail, recipients } = payload;

    // Initialize Appwrite client
    const client = new sdk.Client()
      .setEndpoint(process.env.APPWRITE_ENDPOINT)
      .setProject(process.env.APPWRITE_PROJECT_ID)
      .setKey(process.env.APPWRITE_API_KEY);

    const databases = new sdk.Databases(client);

    // Create notification document
    const notification = await databases.createDocument(
      process.env.APPWRITE_DATABASE_ID,
      'notifications',
      sdk.ID.unique(),
      {
        title,
        message,
        type: type || 'Info',
        read: false,
        link: link || null
      }
    );

    log(`Notification created: ${notification.$id}`);

    // If email flag is set, send emails
    if (sendEmail && recipients) {
      const functions = new sdk.Functions(client);
      
      await functions.createExecution(
        'sendEmail',
        JSON.stringify({
          to: recipients,
          subject: title,
          html: `
            <div style="font-family: Arial, sans-serif;">
              <h2>${title}</h2>
              <p>${message}</p>
              ${link ? `<a href="${link}" style="background: #6366f1; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 10px;">View Details</a>` : ''}
            </div>
          `
        })
      );
    }

    return res.json({
      success: true,
      notification: notification
    });

  } catch (err) {
    error(`Notification failed: ${err.message}`);
    return res.json({
      success: false,
      error: err.message
    }, 500);
  }
};
```

---

## Testing Functions

### Using Appwrite Console

1. Go to Functions → Your Function → Execute
2. Enter test payload:
```json
{
  "to": "test@example.com",
  "subject": "Test Email",
  "html": "<p>This is a test</p>"
}
```
3. Click "Execute"
4. Check logs for results

### Using Code

```javascript
import { functions } from '@/lib/appwrite';

async function testFunction() {
  const execution = await functions.createExecution(
    'sendEmail',
    JSON.stringify({
      to: 'test@example.com',
      subject: 'Test',
      html: '<p>Test message</p>'
    })
  );

  console.log('Status:', execution.status);
  console.log('Response:', execution.response);
}
```

---

## Troubleshooting

### Email Not Sending

1. **Check Gmail Settings:**
   - 2FA must be enabled
   - Use App Password, not regular password
   - Less secure app access is disabled (use App Password)

2. **Check Logs:**
   - Go to Function → Executions
   - Click on failed execution
   - Read error logs

3. **Common Errors:**
   - `Invalid login`: Wrong credentials
   - `Connection timeout`: SMTP port blocked
   - `Daily limit exceeded`: Gmail daily limit reached

### AI Responder Not Working

1. **API Key Issues:**
   - Verify OpenAI API key is correct
   - Check if API key has credits
   - Ensure no extra spaces in env variable

2. **Rate Limits:**
   - OpenAI has rate limits
   - Implement caching for common questions
   - Use exponential backoff for retries

### General Debugging

```javascript
// Add detailed logging
log(`Input: ${JSON.stringify(payload)}`);
log(`Processing...`);
log(`Result: ${JSON.stringify(result)}`);

// Catch and log errors
try {
  // code
} catch (err) {
  error(`Error details: ${err.message}`);
  error(`Stack: ${err.stack}`);
}
```

---

## Best Practices

1. **Rate Limiting:** Implement rate limits to prevent abuse
2. **Validation:** Always validate input data
3. **Error Handling:** Use try-catch and return proper error messages
4. **Logging:** Log important steps for debugging
5. **Security:** Never expose API keys in client-side code
6. **Testing:** Test functions thoroughly before deployment

---

## Monitoring

- Check function execution logs regularly
- Set up alerts for failed executions
- Monitor API usage and costs
- Track email delivery rates

---

## Scaling Considerations

- Functions have execution time limits (15 seconds default)
- Batch operations for multiple emails
- Use queues for heavy processing
- Cache ChatGPT responses when possible
