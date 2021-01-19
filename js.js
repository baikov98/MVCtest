class Observer {
    constructor() {
        this.observers = this.observers
    }
}
class Model {
    constructor(min, max, val) {
        this.min = min
        this.max = max
        this.val = val
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
        this.val = val
    }
}

class Controller {
    constructor (model, view) {
        this.model = model
        this.view = view
        this.hand = this.view.handler
        this.mainAbsX = this.view.main[0].offsetLeft
        this.handWidth = this.hand[0].offsetWidth
        this.handX = this.model.val
    }
    /* valToPx(val) {
        return 
    } */
    bind() {
        this.hand.css({'left' : `${this.handX}px`})
        this.hand.on('mousedown', (e) => {
            let start = e.pageX
            $('html').on('mousemove', (event) => {
                this.handX = event.pageX - this.mainAbsX - (this.handWidth/2)
                this.hand.css({'left' : `${this.handX}px`})
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
    let model = new Model(0, 200, 123)
    let view = new View()
    let cont = new Controller(model, view)
    cont.bind()
    /* let mainAbsX = view.main[0].offsetLeft
    let hand = view.handler

    let handWidth = hand[0].offsetWidth
    let handX = 100
    hand.css({'left' : `${handX}px`})
    
    hand.on('mousedown', (e) => {
        let start = e.pageX
        $('html').on('mousemove', (event) => {
            handX = event.pageX - mainAbsX - (handWidth/2)
            hand.css({'left' : `${handX}px`})
        })
    })
    $('html').on('mouseup', () => {
        $('html').off('mousemove')
    }) */

})