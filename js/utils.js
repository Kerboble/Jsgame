//refactor collision logic
function checkForCollision({ rectangle1, rectangle2 }) {
    return (
        rectangle1.attackBox.position.x + rectangle1.attackBox.width >=
          rectangle2.position.x &&
        rectangle1.attackBox.position.x <=
          rectangle2.position.x + rectangle2.width &&
        rectangle1.attackBox.position.y + rectangle1.attackBox.height >=
          rectangle2.position.y &&
        rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
      )
}

//timer function
let timerInterval
function timer(){
    let time = document.getElementById('timer').innerHTML;

    timerInterval = setInterval(()=>{
        time -= 1;
        document.getElementById('timer').innerHTML = time;
         if(time === 0){
            determineWinner(player, enemy);
            clearInterval(interval)
        };
    },1000)
};

//check health
function determineWinner(player, enemy){
    let outcome = document.getElementById('displayOutcome');
    outcome.style.display = 'flex'
    clearInterval(timerInterval)

    if(player.health > enemy.health){
        outcome.innerHTML = "Player 1 Wins!"
    } else if(player.health < enemy.health){
        outcome.innerHTML = "Player 2 Wins!"
    } else {
        document.getElementById('rematchButton').style.removeProperty('display')
        outcome.innerHTML = 'Tie!'
    };
}

