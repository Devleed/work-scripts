import fs from 'fs';
import { PdfReader } from 'pdfreader';
import OpenAI from 'openai';
import { configDotenv } from 'dotenv';

configDotenv();

const openai = new OpenAI({ apiKey: process.env.OPEN_AI_KEY });

(async () => {
  let dataBuffer = fs.readFileSync('./test-files/AccountFullStatement.pdf');

  new PdfReader().parseBuffer(dataBuffer, async (err, item) => {
    if (err) console.error('error ###:', err);
    else if (!item) console.warn('end of buffer');
    else if (item.text) {
      const prompt = `
                    You are an AI that extracts bank statement details into a structured JSON format.
                    Ensure that the output always follows this structure:

                    "transactions": [
                        {
                        "date": "YYYY-MM-DD",
                        "description": "Transaction Description",
                        "amount": -1000.00, 
                        "balance": 5000.00,
                        "transactionType": "debit"
                        }
                    ]

                    Now, extract and format the following bank statement text:
                    "${item.text}"
    `;

      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'system', content: prompt }],
        temperature: 0,
      });
      console.log('🚀 ~ newPdfReader ~ response:', response.choices);

      const parsedResponse = JSON.parse(response.choices[0].message.content);

      fs.writeFileSync(
        './test-files/AccountFullStatement.json',
        JSON.stringify(parsedResponse, null, 2),
      );
    }
  });
})();
