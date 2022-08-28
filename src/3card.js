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

function addImage (card) {
    const orientation = card.orientation
    const src = card.src
    $('#images')
        .append($('<figure>')
            .append($('<img>')
                .attr('src', `./res/img/${json[src]['image']}`)
                .attr('class', orientation)
            )
            .append($('<figcaption>')
                .text(caption = json[src][orientation])
            )
        )
}

function drawCards () {
    const selection = generateSelection(3, 78, 0)
    const orientation = selection.map(_ => genOrientation())
    let cards = selection.map((src, idx) => {
        return {
            src: src,
            orientation: orientation[idx]
        }
    })

    $('#images').empty()
    cards.map(x => addImage(x))

    genStory(cards)

    $('#buttons').empty()
    $('#buttons')
        .append($('<input>')
            .prop("type", "button")
            .prop("value", "Reset Draw")
            .on("click", () => reset()))
}

function genOrientation() {
    return (Math.random() <= 0.5) ? 'upright' : 'reversed'
}

function genStory(cards) {
    const captions = cards.map(c => json[c.src][c.orientation])
    // Add a query here
    const story = "The past is characterized by " + captions[0] + "." + "\n\n" +
                "The present is characterized by " + captions[1]  + "." + "\n\n" +
                "The future is characterized by " + captions[2] + "."
    console.log(story)

}

function reset () {
    const cards = [
        {src:'0',orientation: "upright"},
        {src:'0',orientation: "upright"},
        {src:'0',orientation: "upright"}]
    $('#images').empty()
    cards.map(x => addImage(x))
    $('#buttons').empty()
    $('#buttons')
        .append($('<input>')
            .prop("type", "button")
            .prop("value", "Draw Cards")
            .on("click", () => drawCards()))  
}