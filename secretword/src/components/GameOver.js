import './GameOver.css'

const Gameover = ({ retry, score }) => {
  return (
    <div className='end'>
      <h1>Fim de jogo</h1>
      <p>Sua pontuação foi: {score}</p>
        <button onClick={retry}>Reiniciar o jogo</button>
    </div>
  )
}

export default Gameover