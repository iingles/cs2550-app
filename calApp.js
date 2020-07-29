const calRoot = document.querySelector('#calGrid')

class Month {
    constructor(name, year, monthNum) {
        this.name = name
        this.year = year
        this.monthNum = monthNum
    }

    /* Date object syntax: 
    *
    *  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/Date
    */

    daysInMonth = function () {
        return 32 - new Date(this.year, this.monthNum, 32).getDate()
    }

    firstDayOfMonth = function () {
        return new Date(this.year, this.monthNum, 1)
    }

    lastDayOfMonth = function () {
        return new Date(this.year, this.monthNum + 1, 0)
    }

    firstDayNum = function () {
        return new Date(this.year, this.monthNum).getDay()
    }
}


class Day {
    constructor(name, date, events, gridNum) {
        this.name = name
        this.date = date
        this.events = events
        this.gridNum = gridNum
    }
}

// Could make this dynamic later on but lets focus on the current year
let year = new Date().getFullYear()

// Months are numbered 2-13 for obscure reasons
let theMonth = new Date().getMonth()

// Once again, we can make this dynamic later
let selectedMonth = new Month('July', '2020', 6)

const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
]


const calendarState = {
    "year": year,
    "month": selectedMonth,
    "firstDayName": selectedMonth.firstDayOfMonth(),
    "firstDayNum": selectedMonth.firstDayNum(),
    // "firstSquare": document.getElementById(`row-1-col-${firstNum}`),
    "lastDay": selectedMonth.lastDayOfMonth(),
    "currentDays": selectedMonth.daysInMonth(),
    "events": ["07/01/2020 10:00", "07/10/2020 14:00"],
    "days": []
}

// Number of cells/rows in the table

// Days in a week
const days = 7
// 6 weeks plus an extra row for the table header
const rows = 7

function createTable(rows, cols) {
    // This creates 7 rows of 7 days, or 49 cells

    let grid = document.createElement('table')
    let head = document.createElement('thead')
    let body = document.createElement('tbody')

    let squareNum = 0
    let dayCount = 0
    let prevMonthCount = 0

    // Create the table head

    const days = [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday'
    ]

    for (let i = 0; i < rows; i++) {
        const row = document.createElement('tr')  

        if (i > 0) {
            row.setAttribute('id', `row-${i}`)
            body.appendChild(row)
        }

        for (let j = 0; j < cols; j++) {

            if (i == 0) {

                if (j == 0) {
                    head.appendChild(row)
                    grid.appendChild(head)
                }

                const heading = document.createElement('th')
                heading.innerHTML = days[j]
                row.appendChild(heading)

            } else {

                // Get the number of the first day (Sun - Sat, 0-6)
                firstDayNum = calendarState.firstDayNum

                let dayObj = new Day()

                const cell = document.createElement('td')
                cell.setAttribute('id', `cell-${j}`)

                const day = document.createElement('div')
                const number = document.createElement('div')

                day.classList.add('day')
                day.setAttribute('id', `${squareNum}`)
                number.classList.add('number')

                dayObj.gridNum = squareNum
                squareNum++

                if (dayCount >= 1) {
                    let state = calendarState.firstDayName
                    dayObj.date = new Date(state.setDate(state.getDate() + 1))
                    dayCount++
                    number.innerHTML = dayObj.date.getDate()

                    if (dayObj.date.getMonth() > selectedMonth.monthNum) {
                        day.classList.add('nextMonth')
                    }
                } 

                if (dayCount === 0 && j <= firstDayNum) {
                    let state = calendarState.firstDayName
                    
                    if (j === 0) {                
                        dayObj.date = new Date(state.setDate(state.getDate() - firstDayNum))

                    } else {
                        dayObj.date = new Date(state.setDate(state.getDate() + 1))
                    }

                    number.innerHTML = dayObj.date.getDate()
                    
                    if (j < firstDayNum) {
                        day.classList.add('prevMonth')
                    }
                }

                if (i == 1 && j == firstDayNum) {
                    dayCount = 1
                    dayObj.date = calendarState.firstDayName
                    number.innerHTML = dayObj.date.getDate()
                }
               

                calendarState.days.push(dayObj)

                cell.appendChild(day)
                day.appendChild(number)
                row.appendChild(cell)

            }

        }
    }

    grid.appendChild(body)

    return grid
}

const table = createTable(rows, days)

calRoot.appendChild(table)

const cells = document.querySelectorAll('td')
const displayElement = document.getElementById('gridOutput')


cells.forEach(el => {
  
    const parent = el.parentNode

    el.addEventListener('click', () => {
        displayElement.innerHTML = `${parent.id}  ${el.id}`    
    })

    el.addEventListener('mousedown', () => {
        el.firstChild.style.border = '2px solid powderblue'
        el.firstChild.style.boxShadow = '1px 1px 5px #aaa'
        el.firstChild.style.fontSize = "2rem"
    })

    el.addEventListener('mouseup', () => {
        el.firstChild.style.border = '1px solid #ccc'
        el.firstChild.style.boxShadow = 'none'
        el.firstChild.style.fontSize = "100%"
    })
})

const monthSelect = document.getElementById('monthSelect')
const debugValues = document.getElementById('debugValues')


months.forEach(el => {
    const opt = document.createElement('option')
    opt.setAttribute('value', el) 
    opt.innerHTML = el
    monthSelect.appendChild(opt)
})

const selectedMonthInput = document.getElementById('selectedMonthInput')

monthSelect.addEventListener('change', evt => {    
    selectedMonthInput.value = evt.target.value

    debugValues.innerHTML = `select value: ${evt.target.value}`
})

selectedMonthInput.addEventListener('blur', evt => {
    debugValues.innerHTML = `input value: ${evt.target.value}`
})

