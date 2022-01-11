import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button className="square" onClick={props.onClick} style={props.style}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i, row, col, highlighted = true) {
    return (
      <Square
        key={i}
        value={this.props.squares[i]}
        // row = {row}
        // col = {col}
        // value={i}
        onClick={() => this.props.onClick(i)}
        style={highlighted ? { color: 'rgb(0, 255, 136)' } : {}}
      />
    );
  }

  render() {
    return (
      <div>
        {this.renderBoard(3, 3, this.props.highlighted)}
      </div>
    );
  }
  renderBoard(row, col, highlightSquares = null) {
    let board = Array(row).fill(null);
    let index = 0;
    for (let i = 0; i < row; i++) {
      let cols = Array(col).fill(null)
      for (let j = 0; j < col; j++) {
        if (highlightSquares != null && highlightSquares.includes(index)) {
          cols[j] = this.renderSquare(index, i, j, true);
        }
        else {
          cols[j] = this.renderSquare(index, i, j, false);
        }
        index++;
      }

      board[i] = React.createElement('div', { className: 'board-row' }, cols)
    }
    return board;
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null)
      }],
      xIsNext: true,
      stepNumber: 0,
      sortMoves: false,
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
        squares: squares
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  sortMovesList() {
    this.setState({
      sortMoves: !this.state.sortMoves
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ?
        'Перейти к шагу #' + move + '(' + this.props.row + ')' :
        'Перейти к началу игры';
      return (
        <li key={move}>
          <button onClick={() => { this.jumpTo(move) }} style={move == this.state.stepNumber ? { color: 'green' } : {}}>{desc}</button>
        </li>
      );
    });

    if (this.state.sortMoves) {
      moves.sort((a, b) => b.key - a.key)
    }

    let status;
    if (winner) {
      status = 'Победитель: ' + (this.state.xIsNext ? 'O' : 'X');
    }
    else if (this.state.stepNumber === 9) {
      status = 'Ничья'
    }
    else {
      status = 'Следующий ход: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            highlighted={winner}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div><button onClick={()=> this.sortMovesList()}>Сортировка</button></div>
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

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
      return [a, b, c];
    }
  }
  return null;
}
