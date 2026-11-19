import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const script = html.match(/<script>([\s\S]*?)<\/script>/)?.[1];
assert.ok(script, 'Legacy redirect script is present');
function redirect(input) {
  const url = new URL(input);
  let result;
  vm.runInNewContext(script, {
    URL, URLSearchParams,
    location: { hostname: url.hostname, pathname: url.pathname, search: url.search, hash: url.hash, replace: value => { result = value; } },
  });
  return result;
}
assert.equal(redirect('https://holiday-gifts-2025.lovable.app/'), 'https://gifts.bakinggreatbread.blog/');
assert.equal(redirect('https://holiday-gifts-2025.lovable.app/#grain-to-gift'), 'https://gifts.bakinggreatbread.blog/#grain-to-gift');
assert.equal(redirect('https://holiday-gifts-2025.lovable.app/gifts/under-50/?utm_source=email#products'), 'https://gifts.bakinggreatbread.blog/gifts/under-50/?utm_source=email#products');
for (const key of ['access_token', 'refresh_token', 'code', 'token', 'token_hash']) {
  for (const separator of ['?', '#']) {
    assert.equal(redirect(`https://holiday-gifts-2025.lovable.app/admin/analytics/${separator}${key}=test-only`), 'https://gifts.bakinggreatbread.blog/admin/login/');
  }
}
assert.equal(redirect('https://gifts.bakinggreatbread.blog/#grain-to-gift'), undefined);
assert.equal(redirect('https://id-preview--example.lovable.app/'), undefined);
console.log('Legacy redirect rules passed: homepage, section, product paths, credential stripping, official and preview hosts.');