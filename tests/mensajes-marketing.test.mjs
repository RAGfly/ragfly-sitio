import test from 'node:test'
import assert from 'node:assert/strict'
import { validarMensaje, cargarMensajeMarketing } from '../lib/mensajes-marketing.ts'
const valid = {version:1,idioma:'en',titulo:[{texto:'A '},{texto:'bigger shell',estilo:'enfasis'}],cuerpo:'Source text'}
test('validates structured copy and rejects injected styles and oversized data',()=>{
 assert.ok(validarMensaje(valid))
 for(const titulo of [[],[{texto:'x',estilo:'script'}],[{texto:'x',html:'<script>x</script>'}],[{texto:'x'.repeat(501)}]]) assert.equal(validarMensaje({...valid,titulo}),null)
 assert.equal(validarMensaje({...valid,version:2}),null)
})
test('never requests arbitrary URL content or arrays',async()=>{
 const old=global.fetch;global.fetch=()=>{throw Error('must not fetch')}
 try {for(const id of ['https://evil.test','../SISTEMA', ['i-c4'], undefined])assert.equal(await cargarMensajeMarketing(id),null)}finally{global.fetch=old}
})
test('lookup normalizes identifiers and fails safely on invalid responses',async()=>{
 const old=global.fetch; let requested
 try {global.fetch=async(url)=>{requested=url;return {ok:true,json:async()=>valid}}
 assert.deepEqual(await cargarMensajeMarketing('I-C4'),valid);assert.match(requested,/\/i-c4$/)
 global.fetch=async()=>({ok:true,json:async()=>({html:'bad'})});assert.equal(await cargarMensajeMarketing('i-c4'),null)
 global.fetch=async()=>{throw Error('offline')};assert.equal(await cargarMensajeMarketing('i-c4'),null)
 }finally{global.fetch=old}
})

test('campaign attribution never overrides the visitor language', async () => {
 const old = global.fetch
 global.fetch = () => { throw Error('English copy must not be fetched for another locale') }
 try {
  for (const locale of ['es', 'pt', 'fr', 'de']) {
   assert.equal(await cargarMensajeMarketing('i-c3', locale), null)
  }
 } finally { global.fetch = old }
})
