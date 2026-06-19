const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf-8');

// Replace test event code setting
content = content.replace(/  \/\/ Meta Conversions API \(CAPI\) Testing states\n  const \[testEventCode, setTestEventCode\] = useState<string>\(\(\) => \{\n    return localStorage\.getItem\('meta_capi_test_event_code'\) \|\| '';\n  \}\);\n  const \[isTestModeEnabled, setIsTestModeEnabled\] = useState<boolean>\(\(\) => \{\n    return localStorage\.getItem\('meta_capi_test_mode'\) === 'true';\n  \}\);\n\n  const saveTestEventCode = \(code: string\) => \{\n    setTestEventCode\(code\);\n    localStorage\.setItem\('meta_capi_test_event_code', code\);\n  \};\n\n  const saveTestModeEnabled = \(enabled: boolean\) => \{\n    setIsTestModeEnabled\(enabled\);\n    localStorage\.setItem\('meta_capi_test_mode', enabled \? 'true' : 'false'\);\n  \};\n/g, '');

// Replace trackMetaEvent payload injecting test properties
content = content.replace(/      if \(isTestModeEnabled && testEventCode\) \{\n        bodyPayload\.testEventCode = testEventCode;\n      \}\n/g, '');

fs.writeFileSync('src/App.tsx', content);
console.log('Cleaned up state and test code injection');
