class Observer {
    constructor() {
        this.observers = []
    }
    addObserver(fn) {
        if (typeof fn === 'function') this.observers.push(fn)
        else throw new Error('Observer must be a Function')
    } 
    notifyObservers(data) {
        let obsCopyArray = this.observers.slice(0)
        for (let func of obsCopyArray) {
            func(data)
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
    modelChangedVal = new Observer()
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
    
    currentValToPx(val) {
        return ((val - this.model.getMin())/this.model.getDiff())*this.view.bar[0].offsetWidth
    }
    currentPxToVal(px) {
        return (px/this.view.bar[0].offsetWidth)*(this.model.getDiff()) + this.model.getMin()
    }
    rodXPositionByClick(event) {
        let px = event.pageX - this.view.bar[0].offsetLeft

        let modelVal = this.currentPxToVal(px)
        this.model.setVal(modelVal)

        let pxForRange = this.currentValToPx(this.model.getVal())
        this.view.rod.css({'left' : `${pxForRange}px`})
    }
    
    bind() {
        this.bar.on('mousedown', (event) => {
            this.rodXPositionByClick(event)
            console.log(event)
            $('html').on('mousemove', (e) => {
                this.rodXPositionByClick(e)
                console.log(this.model.getVal())
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
    let model = new Model(200, 1000, 80, 55)
    let view = new View()
    let cont = new Controller(model, view)
    cont.bind()
    let obs = new Observer()

})