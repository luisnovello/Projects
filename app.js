let currentPlayer = "X";
let firstPlayer = "X";
let secondPlayer = "O";
let game;
let playerOneScore;
let playerTwoScore;
let one;
let two;
let three;
let four;
let five;
let six;
let seven;
let eight;
let nine;
let human;
let bot;

function gameStart(){
    function createBoard(){
        let gameBoard = [ `
            <div class="cell 1" id="one"></div>
            <div class="cell 2" id="two"></div>
            <div class="cell 3" id="three"></div>
            <div class="cell 4" id="four"></div>
            <div class="cell 5" id="five"></div>
            <div class="cell 6" id="six"></div>
            <div class="cell 7" id="seven"></div>
            <div class="cell 8" id="eight"></div>
            <div class="cell 9" id="nine"></div>
        `]
        return gameBoard
    }
    
    function renderBoard() {
        let renderBoard = createBoard()
        $(".board").append(renderBoard)
    }
    
    renderBoard()
    retrieveOneScore()
    retrieveTwoScore()
    createScore()
    UpdatePlayerTurn()
}

gameStart()

function playGame(){
    game = true
}

function retrieveOneScore(){
    if (JSON.parse(localStorage.getItem("playerOne")) === null){
        playerOneScore = 0
    }else{
        playerOneScore = JSON.parse(localStorage.getItem("playerOne"))
    }
}

function retrieveTwoScore(){
    if (JSON.parse(localStorage.getItem("playerTwo")) === null){
        playerTwoScore = 0
    }else{
        playerTwoScore = JSON.parse(localStorage.getItem("playerTwo"))
    }
}

function createScore(){
    $(".player-one-score").text(`Player One: ${playerOneScore}`)
    $(".player-two-score").text(`Player Two: ${playerTwoScore}`)
}

function updateScore(){
    $(".player-one-score").text(`Player One: ${playerOneScore}`)
    $(".player-two-score").text(`Player Two: ${playerTwoScore}`)
}

function storeScore(){
    localStorage.setItem("playerOne", JSON.stringify(playerOneScore))
    localStorage.setItem("playerTwo", JSON.stringify(playerTwoScore))
}

function playCurrentMove(clickedCell){
    $(`#${clickedCell}`).html(currentPlayer)
}

function nextPlayer() {
    currentPlayer = currentPlayer === "X" ? secondPlayer : firstPlayer
}

function UpdatePlayerTurn(){
    currentPlayer === "X" ? $(".player-turn").text("Player: X") : $(".player-turn").text("Player: O")
}

function updateCellText(){
    one = $("#one").text();
    two = $("#two").text();
    three = $("#three").text();
    four = $("#four").text();
    five = $("#five").text();
    six = $("#six").text();
    seven = $("#seven").text();
    eight = $("#eight").text();
    nine = $("#nine").text()
}

function clearCells(){
    one = $("#one").text("");
    two = $("#two").text("");
    three = $("#three").text("");
    four = $("#four").text("");
    five = $("#five").text("");
    six = $("#six").text("");
    seven = $("#seven").text("");
    eight = $("#eight").text("");
    nine = $("#nine").text("")
}

function declareWinner(winner){
    $(".main").append(
        `<div class="winner">
        <span class="win-text">${winner} Wins</span>
        <button class="play-again">Play Again</button>
        </div>
        `)
    $(".play-again").click(function(){
        $(".winner").remove()
        clearCells()
        playGame()
    })    
}


function winningMove(){
    if ((one === two) && (two === three)) {
        return three
    }else if ((four === five) && (five === six)){
        return six
    }else if ((seven === eight) && (eight === nine)){
        return nine
    }else if ((one === four) && (four === seven)){
        return seven
    }else if ((two === five) && (five === eight)){
        return eight
    }else if ((three === six) && (six === nine)){
        return nine
    }else if ((one === five) && (five === nine)){
        return nine
    }else if ((three === five) && (five === seven)){
        return seven
    }else if(one !== "",
    two !== "",
    three !== "",
    four !== "",
    five !== "",
    six !== "",
    seven !== "",
    eight !== "",
    nine !== ""){
    return false
}
}

function checkWinningMove(){
    if (winningMove() != false){
        if (winningMove() === firstPlayer){
            playerOneScore++
            storeScore()
            updateScore()
            let playerOneWins = firstPlayer
            playerOneWins = "Player One"
            game = false
            declareWinner(playerOneWins)
        }else if (winningMove() === secondPlayer){
            playerTwoScore++
            storeScore()
            updateScore()
            let playerTwoWins = secondPlayer
            playerTwoWins = "Player Two"
            game = false
            declareWinner(playerTwoWins)
        }
    }else if(winningMove() === false && winningMove() !== ""){
        $(".main").append(
            `<div class="winner">
            <span class="win-text">Draw</span>
            <button class="play-again">Play Again</button>
            </div>
            `)
            game = false
            $(".play-again").click(function(){
                $(".winner").remove()
                clearCells()
                playGame()
            })
}
}

function randomBot(){
    if (currentPlayer === "O"){
        let randomMove = Math.ceil(Math.random() * 9)
        if ($(`.${randomMove}`).text() === ""){
            $(`.${randomMove}`).html(currentPlayer)
            nextPlayer()
            updateCellText()
            checkWinningMove()
            UpdatePlayerTurn()
        }else{
            randomBot()
        }
    }
}

$(".human").on("click", function(){
    clearCells()
    playGame()
    currentPlayer = "X"
    UpdatePlayerTurn()
    human = true
    bot = false
    $(".human").addClass("true")
    $(".bot").removeClass("true")
})

$(".bot").on("click", function(){
    clearCells()
    playGame()
    currentPlayer = "X"
    UpdatePlayerTurn()
    human = false
    bot = true
    $(".bot").addClass("true")
    $(".human").removeClass("true")
})

$(".cell").on("click", function(){
    let clickedCell = $(this).attr("id")
    if ($(this).text() === ""  && human === true && game === true){
        playCurrentMove(clickedCell)
        nextPlayer()
        updateCellText()
        checkWinningMove()
        UpdatePlayerTurn()
    } else{
        return
    }
})

$(".cell").on("click", function(){
    let clickedCell = $(this).attr("id")
    if ($(this).text() === ""  && bot === true && game === true){
        playCurrentMove(clickedCell)
        nextPlayer()
        updateCellText()
        checkWinningMove()
        UpdatePlayerTurn()
        randomBot()
    } else{
        return
    }
})

$(".reset-score").on("click", function(){
    localStorage.clear()
    retrieveOneScore()
    retrieveTwoScore()
    createScore()
})