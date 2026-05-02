const https = require('https');
const apiKey = 'AIzaSyB4W-97MCpDfohtHuejVDAe0BR2LsePXQ0';
const query = encodeURIComponent('test');
const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&type=video&maxResults=1&key=${apiKey}`;
console.log('url', url);
https.get(url, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('status', res.statusCode);
    try {
      console.log(JSON.parse(data));
    } catch (e) {
      console.error('parse error', e.message);
      console.error(data);
    }
  });
}).on('error', (err) => {
  console.error('request error', err.message);
});