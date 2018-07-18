import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  if (props.winning) {
    return (
      <button
        className="square winning"
        onClick={props.onClick}
      >
        {props.value}
      </button>
    );
  }
  return (
    <button
      className="square"
      onClick={props.onClick}
    >
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    const winner = calculateWinner(this.props.squares);
    if (winner && winner.winningMoves.includes(i)) {
      return (
        <Square 
          key={i}
          value={this.props.squares[i]}
          onClick={() => this.props.onClick(i)}
          winning={true}
        />
      );
    } else {
      return (
        <Square 
          key={i}
          value={this.props.squares[i]}
          onClick={() => this.props.onClick(i)}
        />
      );
    }
  }

  render() {
    const board = [];
    let currRow = [];
    let value = 0;

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        currRow.push(this.renderSquare(value))
        value++
      }
      board.push(<div key={i} className="board-row">{ currRow }</div>)
      currRow = [];
    }

    return (
      <div>
        {board}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        mostRecentMove: null,
      }],
      xIsNext: true,
      stepNumber: 0,
      isReversed: false,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
        mostRecentMove: i,
      }]),
      xIsNext: !this.state.xIsNext,
      stepNumber: history.length,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0,
    });
  }

  reverseHistory() {
    this.setState({
      isReversed: !this.state.isReversed,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    const gameOverAndNoWinner = !winner && this.state.stepNumber === 9;

    const moves = history.map((step, move) => {
      const desc = move ? 
        `Go to move: ${calculatePosition(step.mostRecentMove)}` :
        'Go to game start';
      return (
        <li key={move}>
          <button 
            className={move === this.state.stepNumber ? "current-move" : ""}
            onClick={() => this.jumpTo(move)}>{desc}
          </button>
        </li>
      );
    });

    if (this.state.isReversed) {
      moves.reverse();
    }

    let status;
    if (winner) {
      status = `Winner: ${winner.player}`;

    } else if (gameOverAndNoWinner) {
      status = 'It\'s a draw!';
    } else {
      status = `Next player: ${this.state.xIsNext ? 'X' : 'O'}`;
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
        <div>
          <button onClick={() => this.reverseHistory()}>Reverse history</button>
        </div>
      </div>
    );
  }
}

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {
        player: squares[a],
        winningMoves: lines[i],
      };
    }
  }
  return null;
};

function calculatePosition(i) {
  const row = Math.floor(i / 3) + 1;
  const col = i % 3 + 1;
  return `row: ${row}, col: ${col}`;
};
