const fs = require('fs');
const content = fs.readFileSync('src/App.tsx', 'utf-8');
const lines = content.split('\n');

const startIdx = lines.findIndex(line => line.includes('const MetaCapiVerificationSuite = () => {'));
let endIdx = -1;
for (let i = startIdx; i < lines.length; i++) {
  if (lines[i] === '    };' && lines[i+2] && lines[i+2].includes('return (')) {
    endIdx = i;
    break;
  }
}

if (startIdx !== -1 && endIdx !== -1) {
  lines.splice(startIdx, endIdx - startIdx + 1);
  fs.writeFileSync('src/App.tsx', lines.join('\n'));
  console.log('Deleted component');
} else {
  console.log('Indexes not found', startIdx, endIdx);
}
