let tarotData = null
let currentLayout = 'three'
let lastDraw = null

const layoutConfig = {
  three: {
    count: 3,
    labels: ['Past', 'Present', 'Future'],
    name: 'Past · Present · Future',
  },
  celtic: {
    count: 10,
    labels: [
      'Present',
      'Challenge',
      'Below',
      'Past',
      'Above',
      'Future',
      'Self',
      'Environment',
      'Hopes/Fears',
      'Outcome',
    ],
    name: 'Celtic Cross',
  },
}

async function loadTarot() {
  if (tarotData) return tarotData
  const response = await fetch('./res/tarot.json')
  tarotData = await response.json()
  return tarotData
}

function numberToName(n) {
  return String(n).padStart(2, '0')
}

function generateSelection(length, max, min) {
  const resultsArr = []
  for (let i = 0; i < length; i++) {
    const newNumber = Math.floor(Math.random() * (max - min)) + min
    resultsArr.includes(newNumber) ? (length += 1) : resultsArr.push(newNumber)
  }

  return resultsArr.map((x) => numberToName(x))
}

function addImage(card, data, label, positionClass) {
  const orientation = card.orientation
  const src = card.src
  const container = document.getElementById('images')

  const figure = document.createElement('figure')
  if (positionClass) {
    figure.classList.add(positionClass)
  }
  const labelEl = document.createElement('div')
  labelEl.className = 'card-label'
  labelEl.textContent = label

  const img = document.createElement('img')
  img.src = `./res/img/${data[src]['image']}`
  img.className = orientation

  const caption = document.createElement('figcaption')
  caption.textContent = data[src][orientation]

  figure.appendChild(labelEl)
  figure.appendChild(img)
  figure.appendChild(caption)
  container.appendChild(figure)
}

function getQuestion() {
  return document.getElementById('question').value.trim()
}

function setQuestionError(message) {
  const errorEl = document.getElementById('question-error')
  errorEl.textContent = message || ''
}

async function drawCards() {
  const question = getQuestion()
  if (!question) {
    setQuestionError('Please enter a clear question to begin your reading.')
    return
  }
  setQuestionError('')

  const data = await loadTarot()
  const config = layoutConfig[currentLayout]
  const selection = generateSelection(config.count, 78, 0)
  const orientation = selection.map(() => genOrientation())
  const cards = selection.map((src, idx) => {
    return {
      src: src,
      orientation: orientation[idx],
    }
  })

  renderCards(cards, data)
  lastDraw = { cards, question }
  const storyEl = document.getElementById('story')
  storyEl.textContent = 'Cards drawn. Click “Get Interpretation” to continue.'
}

function genOrientation() {
  return Math.random() <= 0.5 ? 'upright' : 'reversed'
}

function renderCards(cards, data) {
  const config = layoutConfig[currentLayout]
  const images = document.getElementById('images')
  images.innerHTML = ''
  images.classList.toggle('layout-celtic', currentLayout === 'celtic')

  cards.forEach((card, idx) => {
    const positionClass = currentLayout === 'celtic' ? `celtic-pos-${idx + 1}` : null
    addImage(card, data, config.labels[idx], positionClass)
  })
}

async function genStory(cards, data, question) {
  const config = layoutConfig[currentLayout]
  const storyEl = document.getElementById('story')
  storyEl.textContent = 'Consulting the cards…'

  const payload = {
    question,
    layout: config.name,
    cards: cards.map((card, idx) => {
      const meta = data[card.src]
      return {
        id: card.src,
        name: meta.name,
        orientation: card.orientation,
        meaning: meta[card.orientation],
        position: config.labels[idx],
      }
    }),
  }

  try {
    const response = await fetch('/api/reading', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(errorText || 'Request failed')
    }

    const dataResponse = await response.json()
    storyEl.textContent = dataResponse.story || 'No story returned.'
  } catch (err) {
    storyEl.textContent = 'Unable to generate a reading. Check the API service and your OpenAI key.'
    console.error(err)
  }
}

async function resetDraw() {
  const data = await loadTarot()
  const config = layoutConfig[currentLayout]
  const cards = Array.from({ length: config.count }, () => ({
    src: '0',
    orientation: 'upright',
  }))

  renderCards(cards, data)
  lastDraw = null

  const storyEl = document.getElementById('story')
  storyEl.textContent = 'Draw cards to generate a reading.'
}

function setLayout(layout) {
  currentLayout = layout
  const pills = document.querySelectorAll('.pill')
  pills.forEach((pill) => {
    pill.classList.toggle('is-active', pill.dataset.layout === layout)
  })

  resetDraw()
}

async function requestInterpretation() {
  const question = getQuestion()
  if (!question) {
    setQuestionError('Please enter a clear question to begin your reading.')
    return
  }
  if (!lastDraw) {
    const storyEl = document.getElementById('story')
    storyEl.textContent = 'Please draw cards before requesting an interpretation.'
    return
  }
  setQuestionError('')
  const data = await loadTarot()
  await genStory(lastDraw.cards, data, question)
}

document.addEventListener('DOMContentLoaded', () => {
  resetDraw()
})

window.drawCards = drawCards
window.resetDraw = resetDraw
window.setLayout = setLayout
window.requestInterpretation = requestInterpretation
