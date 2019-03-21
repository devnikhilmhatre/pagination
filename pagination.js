
// table id, count, number of rows per table, start index, number of columns, data fetching fuc

function pagination(id, count, query, numberOfColumns, cb) {

    cb(query, function () {

        $('.prev_page').unbind('click')
        $('._page').unbind('click')
        $('.next_page').unbind('click')
        $('#search_page_number_button').unbind('click')

        // getCount(count, function (count) {
        let numberOfButton = Math.ceil(count / query.numberOfRows)

        if (numberOfButton > 1) {
            let styl = 'margin:1px;'
            let btn = `<button class="btn prev_page" style="${styl}">prev</button>`
            if (query.currentIndex == 1) {
                btn = '<button class="btn prev_page" disabled>prev</button>'
            }
            styl += 'display:none;'
            // currentIndex 
            for (let num = 0; num < numberOfButton; num++) {

                let cls = ' '

                if (num == query.currentIndex) {
                    cls = 'btn-primary currentCls'
                }
                btn += `<button class="btn ${cls} _page" data-id="${num}" style="${styl}">${num + 1}</button>`
            }
            styl = 'margin:1px;'

            btn += `<button class="btn next_page" style="${styl}">next</button>`

            let tfoot = ` <tfoot class="tfootCls">
                                <tr>
                                    <td colspan="${numberOfColumns - 5}">
                                        ${btn}
                                    </td>
                                    
                                    <td colspan="2">
                                    
                                        <p style="font-size:15px;">Total pages: ${numberOfButton}</p>
                                    </td>
                                    
                                    <td colspan="2">
                                        <input placeholder="Page Number" class="form-control" type="number" id="search_page_number" />
                                    </td>

                                    <td>
                                        <button class="btn btn-white" id="search_page_number_button">
                                            Go
                                        </button>
                                    </td>
                                    
                                </tr>
                          </tfoot>`

            $('.tfootCls').remove()
            $(`#${id}`).append(tfoot)

            footerButtons(numberOfButton)
            addEvent(id, count, query, numberOfColumns, numberOfButton, cb)
        }


        // })
    })

}

function getCount(url, cb) {

    $.ajax({
        url,
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        success: function (count) {
            cb(count)
        },
        error: function (error) {
            console.log(error)
        }
    })
}

function addEvent(id, count, query, numberOfColumns, numberOfButton, cb) {


    // prev button
    $('.prev_page').click(function () {
        pagination(
            id,
            count,
            { ...query, currentIndex: parseInt($('.currentCls').data('id')) - 1, },
            numberOfColumns,
            cb
        )
    })

    // numbered button
    $('._page').click(function () {

        pagination(
            id,
            count,
            { ...query, currentIndex: parseInt($(this).data('id')) },
            numberOfColumns,
            cb
        )
    })


    // next button
    $('.next_page').click(function () {
        pagination(
            id,
            count,
            { ...query, currentIndex: parseInt($('.currentCls').data('id')) + 1, },
            numberOfColumns,
            cb
        )
    })


    $('#search_page_number_button').click(function () {
        var idx = $('#search_page_number').val()
        if (idx != '') {
            idx = parseInt($('#search_page_number').val())

            if (idx > 0 && idx <= numberOfButton) {
                pagination(
                    id,
                    count,
                    { ...query, currentIndex: idx - 1 },
                    numberOfColumns,
                    cb
                )
            } else {
                alert('Enter correct page number')
            }
        } else {
            alert('Page number is not valid')
        }

    })
}

function footerButtons(numberOfButton) {
    let current = $('.currentCls')
    current.show()
    current.prev().show()
    current.prev().prev().show()
    current.next().show()
    current.next().next().show()


    enableDisblePrevButton(current.text())
    enableDisbleNextButton(numberOfButton, current.text())

}

function enableDisblePrevButton(val) {
    if (parseInt(val) > 1) {
        $('.prev_page').prop('disabled', false)
    } else {
        $('.prev_page').prop('disabled', true)
    }
}

function enableDisbleNextButton(numberOfButton, val) {
    if (parseInt(val) == parseInt(numberOfButton)) {
        $('.next_page').prop('disabled', true)
    } else {
        $('.next_page').prop('disabled', false)
    }
}
