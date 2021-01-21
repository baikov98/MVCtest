$(document).ready(() => {
    let rangeForm = $("<form class='rangeform'><input class='range_val' type='text'></form>").appendTo('.container')
    let range = rangeForm.siblings('.range')
    let rangeInput = rangeForm.find('.range_val')
    rangeForm.siblings('.range').on('newval', () => {
        let dataval = range.data()
        rangeInput.val(dataval.val)
    })
}) 