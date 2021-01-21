class Observer {
    constructor() {
        this.observers = this.observers
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
        this.hand = this.view.handler
        this.barAbsX = this.view.bar[0].offsetLeft
        this.handWidth = this.hand[0].offsetWidth
        this.rangeWidth = this.view.bar[0].offsetWidth
    }

    currentValToPx(px) {
        return (px/this.model.getMax())*this.rangeWidth
    }
    currentPxToVal(px) {
        return (px/this.rangeWidth)*this.model.getMax()
    }
    handXPositionByClick(event) {
        let px = event.pageX - this.barAbsX
        let modelVal = this.currentPxToVal(px)
        this.model.setVal(modelVal)
        let pxForRange = this.currentValToPx(this.model.getVal())
        console.log(this.model.getVal())
        this.hand.css({'left' : `${pxForRange}px`})
    }
    
    bind() {
        //console.log(this.hand)
        this.hand.css({'left' : `${this.model.getVal()}px`})

        this.bar.on('mousedown', (e) => {
            this.handXPositionByClick(e)
            $('html').on('mousemove', (event) => {
                this.handXPositionByClick(event)
            })
        })
        /* this.bar.on('click', (event) => {
            this.handXPositionByClick(event)
        })   */
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
        this.handler = $("<div class='range__handler'></div>").appendTo(this.bar)
    }
}


$(document).ready(() => {
    let model = new Model(0, 100, 10, 2)
    let view = new View()
    let cont = new Controller(model, view)
    cont.bind()

})