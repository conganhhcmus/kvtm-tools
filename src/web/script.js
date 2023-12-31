let isRunning = false

$('#start').click(StartAuto)

$('#stop').click(StopAuto)

$('#clear').click(ClearLogs)

function ClearLogs() {
    $('#logs').val('')
}

function UpdateButton() {
    $('#start').prop('disabled', isRunning)
    $('#stop').prop('disabled', !isRunning)
}

function StartAuto() {
    let data = {
        listRunningDevice: GetSelectedDevices(),
        gameOptions: GetGameOptions(),
    }

    if (data.listRunningDevice.length <= 0) {
        alert('No devices selected!!!')
        return
    }

    $.ajax({
        type: 'POST',
        url: '/start',
        data: JSON.stringify(data),
        contentType: 'application/json; charset=utf-8',
        datatype: 'json',
        success: function (response) {
            isRunning = true
            UpdateButton()
        },
    })
}

function StopAuto() {
    $.ajax({
        type: 'POST',
        url: '/stop',
        contentType: 'application/json; charset=utf-8',
        datatype: 'json',
        success: function (response) {
            isRunning = false
            UpdateButton()
        },
    })
}

function GetInitData() {
    $.ajax({
        type: 'GET',
        url: '/init',
        contentType: 'application/json; charset=utf-8',
        datatype: 'json',
        success: function (response) {
            let result = JSON.parse(response)
            isRunning = result.isRunning
            InitListDevices(result.listDevices, result.listRunningDevice)
            InitListAutoFuc(result.autoFunc, result.runningAutoFunc)
            SetGameOptions(result.gameOptions)
            UpdateButton()
        },
    })
}

function InitListDevices(listDevices, listRunningDevice) {
    $('.selectpicker').empty()
    $.each(listDevices, function (index, device) {
        $('.selectpicker').append(`<option value="${device}">${device}</option>`)
    })

    $('#listDevices select').val(listRunningDevice)
}

function InitListAutoFuc(autoFunc, runningAutoFunc) {
    $('#runAuto').empty()
    $.each(autoFunc, function (index, func) {
        $('#runAuto').append(`<option value="${func.key}">${func.name}</option>`)
    })

    $('#runAuto').val(runningAutoFunc)
}

function GetSelectedDevices() {
    return $('#listDevices select').val()
}

function GetGameOptions() {
    return {
        runAuto: $('#runAuto').val(),
        frequency: parseInt($('#frequency').val()),
        hasOpenGame: $('#openGame').prop('checked'),
        hasEventTrees: $('#hasEventTree').prop('checked'),
        resetAfterLoops: parseInt($('#resetAfter').val()),
    }
}

function SetGameOptions(gameOptions) {
    $('#frequency').val(gameOptions.frequency)
    $('#openGame').prop('checked', gameOptions.hasOpenGame)
    $('#hasEventTree').prop('checked', gameOptions.hasEventTrees)
    $('#resetAfter').val(gameOptions.resetAfterLoops)
}

function GetLogs() {
    $.ajax({
        type: 'GET',
        url: '/logs',
        datatype: 'json',
        success: function (response) {
            $('#logs').val(response)
        },
    })
}

function Init() {
    GetInitData()
    setInterval(GetLogs, 60 * 1000)
    GetLogs()
}

Init()
