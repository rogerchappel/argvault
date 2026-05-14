const chunks = [];
for await (const chunk of process.stdin) chunks.push(chunk);
console.log(`argv=${process.argv.slice(2).join('|')}`);
console.log(`stdin=${Buffer.concat(chunks).toString('utf8').trim()}`);
console.error('token=ghp_1234567890abcdefghijklmnopqrstuvwxyz');
