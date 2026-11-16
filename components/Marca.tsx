export function Marca({ nombre }: { nombre: 'RAGfly' | 'REGfly' }) {
  return <span>{nombre.slice(0, -3)}<span className="font-bold italic">fly</span></span>
}
