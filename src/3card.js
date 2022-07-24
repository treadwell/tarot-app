var json = $.getJSON({'url': "http://localhost:8080/res/tarot.json", 'async': false})
json = JSON.parse(json.responseText)

$(document).ready(() => {
    $('body')
    	.append('<div id="images">')
    	.append('<div id="buttons">')

    reset()
})

function numberToName (n) {
   //return "./res/img/C" + String(n).padStart(2, '0') + ".jpg"
   return String(n).padStart(2, '0')
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
    const orientation = (Math.random() <= 0.5) ? 'upright' : 'reversed'
    $('#images')
        .append($('<figure>')
            .append($('<img>')
                .attr('src', `./res/img/${json[src]['image']}`)
                .attr('class', orientation)
            )
            .append($('<figcaption>')
                .text(json[src][orientation])
            )
        )
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
    const selection = ['0', '0', '0']
    $('#images').empty()
    selection.map(x => addImage(x))
    $('#buttons').empty()
    $('#buttons')
        .append($('<input>')
            .prop("type", "button")
            .prop("value", "Draw Cards")
            .on("click", () => drawCards()))
    
}