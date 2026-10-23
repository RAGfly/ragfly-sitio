import test from 'node:test'
import assert from 'node:assert/strict'
import { ubicacionPublica, iniciarGoogle, medirGoogle, medirAltaGoogle } from '../lib/google-analytics.ts'
function browser(consent = '', host = 'app.ragfly.ai') {
 const sent = [], storage = new Map()
 global.window = { location: { hostname: host, href: `https://${host}/auth/callback?code=SECRET&email=private%40example.com&utm_content=i-c3#access_token=SECRET` }, localStorage: { getItem: k => storage.get(k), setItem: (k,v) => storage.set(k,v) } }
 global.document = { cookie: consent, referrer: 'https://accounts.google.com/oauth?token=PRIVATE', createElement: () => ({}), head: { appendChild: s => sent.push(s) } }
 return sent
}
test('removes credentials, email, fragments and unsafe campaign values', () => {
 assert.equal(ubicacionPublica('https://app.ragfly.ai/auth/callback?code=secret&utm_content=i-c3&utm_term=private%40mail.com#token=secret'), 'https://app.ragfly.ai/auth/callback?utm_content=i-c3')
})
test('does not load Google or send events before optional consent or on TEST/CORP', () => {
 for (const cookie of ['', 'ragfly_analytics_consent=rejected']) { const sent=browser(cookie); assert.equal(iniciarGoogle(), false); assert.equal(medirGoogle('page_view'), false); assert.equal(sent.length,0) }
 for (const host of ['test.ragfly.ai','corp.ragfly.ai','localhost']) { const sent=browser('ragfly_analytics_consent=accepted',host); assert.equal(iniciarGoogle(),false); assert.equal(sent.length,0) }
})
test('one tag, shared cookie domain, safe page URLs and no advertising signals', () => {
 const sent=browser('ragfly_analytics_consent=accepted'); assert.ok(iniciarGoogle()); assert.ok(iniciarGoogle()); assert.equal(sent.length,1)
 const config=Array.from(window.dataLayer[1])[2]; assert.equal(config.cookie_domain,'ragfly.ai'); assert.equal(config.send_page_view,false); assert.equal(config.allow_google_signals,false)
 medirGoogle('signup_start','google')
 assert.equal(JSON.stringify(window.dataLayer).includes('SECRET'),false); assert.equal(JSON.stringify(window.dataLayer).includes('private@'),false)
})
test('successful existing logins never become sign_up; retries of a new registration are deduplicated', () => {
 browser('ragfly_analytics_consent=accepted')
 assert.equal(medirAltaGoogle({nuevo_registro:false,id_registro:'P1'},'google'),false)
 assert.equal(medirAltaGoogle({nuevo_registro:true},'google'),false)
 assert.equal(medirAltaGoogle({nuevo_registro:true,id_registro:'P1'},'google'),true)
 assert.equal(medirAltaGoogle({nuevo_registro:true,id_registro:'P1'},'google'),false)
 const events=window.dataLayer.map(e=>Array.from(e)).filter(e=>e[0]==='event'&&e[1]==='sign_up'); assert.equal(events.length,1)
 assert.equal(JSON.stringify(events).includes('P1'),false)
})
