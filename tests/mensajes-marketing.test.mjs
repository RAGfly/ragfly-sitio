import test from 'node:test'
import assert from 'node:assert/strict'
import { validarMensaje, cargarMensajeMarketing } from '../lib/mensajes-marketing.ts'
const valid = {version:1,idioma:'en',titulo:[{texto:'A '},{texto:'bigger shell',estilo:'enfasis'}],cuerpo:'Source text'}
test('validates structured copy and rejects injected styles and oversized data',()=>{
 assert.ok(validarMensaje(valid,'en'))
 for(const titulo of [[],[{texto:'x',estilo:'script'}],[{texto:'x',html:'<script>x</script>'}],[{texto:'x'.repeat(501)}]]) assert.equal(validarMensaje({...valid,titulo},'en'),null)
 assert.equal(validarMensaje({...valid,version:2},'en'),null)
 assert.equal(validarMensaje(valid,'es'),null)
 assert.ok(validarMensaje({...valid,bajada:'Subtitle'},'en'))
 for(const bajada of ['', 42, 'x'.repeat(1001)]) assert.equal(validarMensaje({...valid,bajada},'en'),null)
})
test('never requests arbitrary URL content or arrays',async()=>{
 const old=global.fetch;global.fetch=()=>{throw Error('must not fetch')}
 try {for(const id of ['https://evil.test','../SISTEMA', ['i-c4'], undefined])assert.equal(await cargarMensajeMarketing(id),null)}finally{global.fetch=old}
})
test('lookup normalizes identifiers and fails safely on invalid responses',async()=>{
 const old=global.fetch; let requested
 try {global.fetch=async(url)=>{requested=url;return {ok:true,json:async()=>valid}}
 assert.deepEqual(await cargarMensajeMarketing('I-C4'),valid);assert.match(requested,/\/i-c4\?locale=en$/)
 global.fetch=async()=>({ok:true,json:async()=>({html:'bad'})});assert.equal(await cargarMensajeMarketing('i-c4'),null)
 global.fetch=async()=>{throw Error('offline')};assert.equal(await cargarMensajeMarketing('i-c4'),null)
 }finally{global.fetch=old}
})

test('campaign copy follows the visitor language and never another one', async () => {
 const old = global.fetch
 try {
  for (const locale of ['es', 'pt', 'fr', 'de']) {
   let requested
   global.fetch = async (url) => { requested = url; return { ok: true, json: async () => ({ ...valid, idioma: locale }) } }
   assert.equal((await cargarMensajeMarketing('i-c3', locale)).idioma, locale)
   assert.match(requested, new RegExp(`/i-c3\\?locale=${locale}$`))
   // Corp answering in English for another locale is rejected: the landing keeps its localized copy.
   global.fetch = async () => ({ ok: true, json: async () => valid })
   assert.equal(await cargarMensajeMarketing('i-c3', locale), null)
  }
  global.fetch = () => { throw Error('unsupported locales must not fetch') }
  assert.equal(await cargarMensajeMarketing('i-c3', 'it'), null)
 } finally { global.fetch = old }
})
