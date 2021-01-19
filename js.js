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
}

class Controller {
    constructor (model, view) {
        this.model = model
        this.view = view
        this.hand = this.view.handler
        this.mainAbsX = this.view.main[0].offsetLeft
        this.handWidth = this.hand[0].offsetWidth
        this.rangeWidth = this.view.main[0].offsetWidth
        //this.currentVal = this.model.getVal()
        //this.max = this.model.getMax()
        //this.min = this.model.getMin()
    }

    currentValToPx(px) {
        return (px/this.model.getMax())*this.rangeWidth
    }
    currentPxToVal(px) {
        return (px/this.rangeWidth)*this.model.getMax()
    }
    getNumForStep(num, step, max) {
        let res = Math.floor(num/step)*step
        if (res >= max) res = max
        return res
    }
    bind() {
        this.hand.css({'left' : `${10}px`})
        let handDiff = Math.floor(this.handWidth/2)
        this.hand.on('mousedown', (e) => {
            $('html').on('mousemove', (event) => {
                let px = event.pageX - this.mainAbsX - handDiff
                let modelVal = this.currentPxToVal(px)
                this.model.setVal(modelVal)

                let pxForRange = this.currentValToPx(this.model.getVal())

                /* if (pxForRange > (this.rangeWidth - this.handWidth)) {
                    pxForRange = this.rangeWidth - this.handWidth
                } */
                //let currentVal = event.pageX - this.mainAbsX - handDiff
                console.log(this.model.getVal())
                this.hand.css({'left' : `${pxForRange}px`})
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
        this.main = $("<div class='range'></div>").appendTo(this.container)
        this.handler = $("<div class='range__handler'></div>").appendTo(this.main)
    }
}




$(document).ready(() => {
    let model = new Model(0, 100, 10, 10)
    let view = new View()
    let cont = new Controller(model, view)
    cont.bind()

})