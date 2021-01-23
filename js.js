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
    constructor(min, max, valFrom, valTo, step, isDouble) {
        this.min = min
        this.max = max
        this.valFrom = valFrom
        this.valTo = valTo
        this.step = step
        this.isDouble = isDouble
        this.isRodFrom = true
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
    getValFrom = () => {
        return this.valFrom
    }
    getValTo = () => {
        return this.valTo
    }
    modelChangedValFrom = new Observer()
    modelChangedValTo = new Observer()
    setVal = (val, rod=true) => {
        if (val > this.getValTo() && rod) this.isRodFrom = false
        if (val < this.getValFrom() && !rod) this.isRodFrom = true

        if (val >= this.max) {
            rod ? this.valFrom = this.max : this.valTo = this.max
            rod ? this.modelChangedValFrom.notifyObservers(this.val) : this.modelChangedValTo.notifyObservers(this.val)
            return
        }
        if (val <= this.min) {
            rod ? this.valFrom = this.min : this.valTo = this.min
            rod ? this.modelChangedValFrom.notifyObservers(this.val) : this.modelChangedValTo.notifyObservers(this.val)
            return
        }
        val = this.getStepNum(val, this.getStep(), this.getMax())
        rod ? this.valFrom = val : this.valTo = val
        rod ? this.modelChangedValFrom.notifyObservers(this.val) : this.modelChangedValTo.notifyObservers(this.val)
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
    rodXPositionByClick(event, rod) {
        let px = this.view.getClickBarX(event.pageX)
        let modelVal = this.currentPxToVal(px)
        this.model.setVal(modelVal, rod)
    }
    
    bind() {
        this.model.modelChangedValFrom.addObserver(() => {
            let pxForRange = this.currentValToPx(this.model.getValFrom())
            this.view.draw(pxForRange, this.model.getValFrom())
        })

        this.model.modelChangedValTo.addObserver(() => {
            let pxForRange = this.currentValToPx(this.model.getValTo())
            this.view.draw(pxForRange, this.model.getValTo(), false)
        })

        this.model.setVal(this.model.getValFrom())
        this.model.setVal(this.model.getValTo(), false)

        this.bar.on('mousedown', (event) => {
            this.model.isRodFrom = this.view.checkPxRange(this.view.getClickBarX(event.pageX))

            this.rodXPositionByClick(event, this.model.isRodFrom)
            $('html').on('mousemove', (e) => {
                this.rodXPositionByClick(e, this.model.isRodFrom)
            })
        })

        $('html').on('mouseup', () => {
            $('html').off('mousemove')
        })
    }
}

class View {
    constructor(rootEl) {
        this.rootEl = rootEl
        this.html = $('html')
        this.container = $("<div class='container'></div>").appendTo(rootEl)
        this.bar = $("<div class='range'></div>").appendTo(this.container)
        this.rod = $("<div class='range__rodfrom'></div>").appendTo(this.bar)
        this.rod2 = $("<div class='range__rodto'></div>").appendTo(this.bar)
        this.interval = $("<div class='range__interval'></div>").appendTo(this.bar)
    }
    draw(px, data, rod=true) {
        if (rod) {
            this.rod.css({'left' : `${px}px`})
            this.rod.parents('.range').data({'valFrom' : data})
            this.rod.parents('.range').trigger('newvalfrom')
        } else {
            this.rod2.css({'left' : `${px}px`})
            this.rod2.parents('.range').data({'valTo' : data})
            this.rod2.parents('.range').trigger('newvalto')
        }
        this.drawInterval()
    }
    drawInterval() {
        this.interval.css({'left' : `${this.rod[0].offsetLeft}px`,
                           'width' : `${Math.abs(this.rod[0].offsetLeft-this.rod2[0].offsetLeft)}px`})
    }

    checkPxRange(px) {
        if (Math.abs(px-this.rod[0].offsetLeft) < Math.abs(px-this.rod2[0].offsetLeft)) {
            return true
        } else return false
    }
    getClickBarX(px) {
        return px - this.bar[0].offsetLeft
    }
}

$(document).ready(() => {
    let model = new Model(200, 1000, 80, 500, 20, true)
    let view = new View($('<div class="RangeMetaLamp"></div>').appendTo('body'))
    let cont = new Controller(model, view)
    cont.bind()
    
})