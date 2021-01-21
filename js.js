class Observer {
    constructor() {
        this.observers = []
    }
    addObserver(fn) {
        if (typeof fn === 'function') this.observers.push(fn)
        else throw new Error('Observer must be a Function')
    } 
    notifyObservers() {
        let obsCopyArray = this.observers.slice(0)
        for (let func of obsCopyArray) {
            func()
        }
    }
}


class Model {
    constructor(min, max, val, step) {
        this.min = min
        this.max = max
        this.val = val
        this.step = step
    }
    getDiff = () => {
        return this.max - this.min
    }
    getMax = () => {
        return this.max
    }
    setMax = (val) => {
        this.max = val
    }
    getMin = () => {
        return this.min
    }
    setMin = (val) => {
        this.min = val
    }
    getVal = () => {
        return this.val
    }
    setVal = (val) => {
        if (val >= this.max) {this.val = this.max; return}
        if (val <= this.min) {this.val = this.min; return}
        val = this.getStepNum(val, this.getStep(), this.getMax())
        this.val = val
    }
    getStep = () => {
        return this.step
    }
    setStep = (val) => {
        if (val <= 0) {this.step = 1; return}
        if (val > this.max) {this.step = this.max; return}
        this.step = val
    }
    getStepNum(num, step, max) {
        let res = Math.round(num/step)*step
        if (res >= max) res = max
        return res
    }
}

class Controller {
    constructor (model, view) {
        this.model = model
        this.view = view
        this.bar = this.view.bar
        this.rod = this.view.rod
    }

    currentValToPx(px) {
        return (px/this.model.getMax())*this.view.bar[0].offsetWidth
    }
    currentPxToVal(px) {
        return (px/this.view.bar[0].offsetWidth)*this.model.getMax()
    }
    rodXPositionByClick(event) {
        let px = event.pageX - this.view.bar[0].offsetLeft

        this.model.setVal(this.currentPxToVal(px))
        
        this.view.rod.css({'left' : `${this.currentValToPx(this.model.getVal())}px`})
    }
    
    bind() {
        this.bar.on('mousedown', (e) => {
            this.rodXPositionByClick(e)
            $('html').on('mousemove', (event) => {
                this.rodXPositionByClick(event)
            })
        })

        $('html').on('mouseup', () => {
            $('html').off('mousemove')
        })
    }
}

class View {
    constructor() {
        this.html = $('html')
        this.container = $("<div class='container'></div>").appendTo('body')
        this.bar = $("<div class='range'></div>").appendTo(this.container)
        this.rod = $("<div class='range__rod'></div>").appendTo(this.bar)
    }
}


$(document).ready(() => {
    let model = new Model(0, 100, 80, 12)
    let view = new View()
    let cont = new Controller(model, view)
    let obs = new Observer()
    obs.addObserver(() => {console.log('first')})
    obs.addObserver(() => {console.log('first2')})
    obs.addObserver(() => {console.log('first3')})
    obs.notifyObservers()
    cont.bind()

})