$(document).ready(() => {
    let form = $("<form class='rangeform'></form>").appendTo('.container')
    let rangeFrom = $("<input class='range__valFrom' type='text'>").appendTo(form)
    let rangeTo = $("<input class='range__valTo' type='text'>").appendTo(form)
    let range = form.siblings('.range')
   

    form.siblings('.range').on('newvalfrom', () => {
        let dataval = range.data('valFrom')
        console.log(dataval)
        rangeFrom.val(dataval)
    })
    form.siblings('.range').on('newvalto', () => {
        let dataval = range.data('valTo')
        rangeTo.val(dataval)
    })
}) 