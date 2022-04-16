$(document).ready(() => {
    $('body')
    	.append('<div id="images">')
    	.append('<div id="buttons">')
    	
    reset()
})

function numberToName (n) {
   return "./res/img/C" + String(n).padStart(2, '0') + ".jpg"
}

function generateSelection(length, max, min) {
   const resultsArr = []
   for (let i = 0; i < length; i++) {
       const newNumber = Math.floor(Math.random() * (max - min)) + min
       resultsArr.includes(newNumber) ? length += 1 : resultsArr.push(newNumber)
	}
  			
    return resultsArr.map(x => numberToName(x))
}

function addImage (src) {
    $('#images')
        .append($('<img>')
            .attr('src', src)
            .attr('class',
                (Math.random() <= 0.5) ? 'upright' : 'reversed'
            ))
}

function drawCards () {
    const selection = generateSelection(3, 78, 0)
    $('#images').empty()
    selection.map(x => addImage(x))
    $('#buttons').empty()
    $('#buttons')
        .append($('<input>')
            .prop("type", "button")
            .prop("value", "Reset Draw")
            .on("click", () => reset()))
}

function reset () {
    const selection = ['./res/img/C-0.jpg', 
                        './res/img/C-0.jpg', 
                        './res/img/C-0.jpg']
    $('#images').empty()
    selection.map(x => addImage(x))
    $('#buttons').empty()
    $('#buttons')
        .append($('<input>')
            .prop("type", "button")
            .prop("value", "Draw Cards")
            .on("click", () => drawCards()))
    
}