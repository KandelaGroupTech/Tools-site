
import handler from './api/gemini-match.js';
const req = {
  method: 'POST',
  body: {
    idToken: 'fake_token',
    prompt: 'new doors',
    catalogContext: '1000 | GC'
  }
};
const res = {
  status: function(code) { this.statusCode = code; return this; },
  json: function(data) { console.log(this.statusCode, data); return data; }
};
handler(req, res).catch(console.error);

