const express = require("express");
const app = express();
const name = "escala.xlsx";

var xl = require('excel4node');
var fs = require('fs');

const weekDayNames = [
    "domingo",
    "segunda-feira",
    "terça-feira",
    "quarta-feira",
    "quinta-feira",
    "sexta-feira",
    "sábado"
]

app.use(express.static(__dirname + "/dist"));
app.listen(process.env.PORT || 8080);

app.get("/generate", function (req, res) {
    console.log(req.query);

    var designation = req.query.designation;
    var nIndividuals = parseInt(req.query.nIndividuals);
    var year = parseInt(req.query.month.substring(0, 4));
    var month = parseInt(req.query.month.substring(5, 7));
    var nAttendanceDuringWeek = parseInt(req.query.nAttendanceDuringWeek);
    var nAttendanceOnWeekends = parseInt(req.query.nAttendanceOnWeekends);

    console.log(designation);
    console.log(nIndividuals);
    console.log(year);
    console.log(month);
    console.log(nAttendanceDuringWeek);
    console.log(nAttendanceOnWeekends);

    // Create a new instance of a Workbook class
    var wb = new xl.Workbook();

    // Add Worksheets to the workbook
    var ws = wb.addWorksheet('Escala Mensal');

    ws.cell(1, 1).string("Designação do indivíduo");
    ws.cell(1, 2).string("Dias em que foi escalado");
    ws.cell(1, 3).string("Informações adicionais");

    console.log("A");

    for (i = 0; i < nIndividuals; i++) {
        console.log("i = " + i);
        ws.cell(2 + i, 1).string(designation + " " + minDigits(i + 1, 3));
    }

    console.log("B");

    var nDaysInMonth = getDaysInMonth(month, year);

    ws.cell(3 + nIndividuals, 1).string("Dia do mês");
    ws.cell(3 + nIndividuals, 2).string("Quem foi escalado");

    var nNormalDays = 0;
    var nWeekends = 0;

    for (i = 0; i < nDaysInMonth; i++) {
        var date = new Date(year, month - 1, 1 + i);
        console.log("date = " + date);
        if (date.getDay() == 0 || date.getDay() == 6) {
            nWeekends++;
            console.log("weekend");
        }
        else {
            nNormalDays++;
            console.log("normal day");
        }
    }

    console.log("nWeekends = " + nWeekends);
    console.log("nNormalDays = " + nNormalDays);

    duringWeekAttendance = []
    weekendAttendance = []

    for (i = 1; i <= nIndividuals; i++) {
        duringWeekAttendance.push({individual: i, daysRemaining: nAttendanceDuringWeek, days: []});
        weekendAttendance.push({individual: i, daysRemaining: nAttendanceOnWeekends, days: []});
    }

    duringWeekAttendance = shuffle(duringWeekAttendance);
    weekendAttendance = shuffle(weekendAttendance);

    var daysInMonth = [];

    for (i = 0; i < nDaysInMonth; i++) {
        var date = new Date(year, month - 1, 1 + i);
        if (date.getDay() == 0 || date.getDay() == 6) {
            var dayInMonth = {day:(i+1), isWeekend:true, individuals:[]};
            daysInMonth.push(dayInMonth);
        }
        else {
            var dayInMonth = {day:(i+1), isWeekend:false, individuals:[]}
            daysInMonth.push(dayInMonth);
        }
    }

    daysInMonth = shuffle(daysInMonth);

    var nWeekendDaysRemaining = nWeekends;
    var nScalesRemainingWeekendDays = nIndividuals * nAttendanceOnWeekends;

    var nOnWeekDaysRemaining = nNormalDays;
    var nScalesRemainingOnWeekDays = nIndividuals * nAttendanceDuringWeek;

    for (i = 0; i < nDaysInMonth; i++) {
        if (daysInMonth[i].isWeekend) {
            var nIndividualsInDay = Math.ceil(nScalesRemainingWeekendDays / nWeekendDaysRemaining);

            console.log("weekeend!");
            console.log("nScalesRemainingWeekendDays: " + nScalesRemainingWeekendDays);
            console.log("nWeekendDaysRemaining: " + nWeekendDaysRemaining);
            console.log("nIndividualsInDay: " + nIndividualsInDay);

            weekendAttendance.sort(compare);
            console.log(weekendAttendance);

            for(j = 0; j < nIndividualsInDay && j < nIndividuals; j++){
                daysInMonth[i].individuals.push(weekendAttendance[j].individual);
                weekendAttendance[j].daysRemaining--;
                var date = new Date(year, month - 1, daysInMonth[i].day);
                weekendAttendance[j].days.push(minDigits(daysInMonth[i].day, 2) + "/" + minDigits(month, 2) + " (" + getWeekDayName(date) + ")");
            }

            nWeekendDaysRemaining--;
            nScalesRemainingWeekendDays -= nIndividualsInDay;
        }
        else {
            var nIndividualsInDay = Math.ceil(nScalesRemainingOnWeekDays / nOnWeekDaysRemaining);

            console.log("normal day!");
            console.log("nScalesRemainingOnWeekDays: " + nScalesRemainingOnWeekDays);
            console.log("nOnWeekDaysRemaining: " + nOnWeekDaysRemaining);
            console.log("nIndividualsInDay: " + nIndividualsInDay);

            duringWeekAttendance.sort(compare);
            console.log(duringWeekAttendance);

            for(j = 0; j < nIndividualsInDay && j < nIndividuals; j++){
                daysInMonth[i].individuals.push(duringWeekAttendance[j].individual);
                duringWeekAttendance[j].daysRemaining--;
                var date = new Date(year, month - 1, daysInMonth[i].day);
                duringWeekAttendance[j].days.push(minDigits(daysInMonth[i].day, 2) + "/" + minDigits(month, 2) + " (" + getWeekDayName(date) + ")");
            }

            nOnWeekDaysRemaining--;
            nScalesRemainingOnWeekDays -= nIndividualsInDay;
        }
        // console.log(daysInMonth);
    }

    daysInMonth.sort(compareByDayAsc);
    
    for (i = 0; i < nDaysInMonth; i++) {
        var date = new Date(year, month - 1, 1 + i);
        ws.cell(4 + nIndividuals + i, 1).string(minDigits(i+1,2) + "/" + minDigits(month, 2) + " (" + getWeekDayName(date) + ")");
        var scale = "";
        console.log("antes do sort:");
        console.log(daysInMonth[i].individuals);
        daysInMonth[i].individuals.sort(normalNumberCompare);
        console.log("depois do sort:");
        console.log(daysInMonth[i].individuals);
        for(j = 0; j < daysInMonth[i].individuals.length; j++){
            scale += designation + " " + minDigits(daysInMonth[i].individuals[j], 3) + ", ";
        }
        ws.cell(4 + nIndividuals + i, 2).string(scale);
    }

    weekendAttendance.sort(compareByIndividualAsc);
    duringWeekAttendance.sort(compareByIndividualAsc);

    for(i = 0; i < nIndividuals; i++){
        var weekeendDays = "Finais de semana: "
        var inWeekDays = "Dias de semana: "

        weekendAttendance[i].days.sort();
        duringWeekAttendance[i].days.sort();

        for(j = 0; j < weekendAttendance[i].days.length; j++){
            weekeendDays += weekendAttendance[i].days[j] + ", "
        }
        for(j = 0; j < duringWeekAttendance[i].days.length; j++){
            inWeekDays += duringWeekAttendance[i].days[j] + ", "
        }
        ws.cell(2+i, 2).string(inWeekDays + "\n" + weekeendDays);
    }

    ws.column(1).setWidth(30);
    ws.column(2).setWidth(120);
    ws.column(3).setWidth(30);

    for(i = 2; i < 2+nIndividuals; i++){
        ws.row(i).setHeight(32);
    }

    wb.write(name);
    res.redirect("/download");
});

app.get("/download", function (req, res) {
    res.download(name);
});

function minDigits(a, minLength){
    var s = a.toString();
    var zeros = "";
    for(remainingZerosXYZ = 0; remainingZerosXYZ < minLength-s.length; remainingZerosXYZ++){
        zeros += '0';
    }
    return (zeros+s);
}

function normalNumberCompare(a, b){
    if (a < b)
        return -1;
    else if(a > b)
        return 1;
    return 0;
}

function compare(a, b) {
    if (a.daysRemaining < b.daysRemaining)
        return 1;
    else if(a.daysRemaining > b.daysRemaining)
        return -1;
    return 0;
}

function compareByDayAsc(a, b){
    if (a.day > b.day)
        return 1;
    else if(a.day < b.day)
        return -1;
    return 0;
}

function compareByIndividualAsc(a, b){
    if (a.individual > b.individual)
        return 1;
    else if(a.individual < b.individual)
        return -1;
    return 0;
}

function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

function getWeekDayName(date) {
    return weekDayNames[date.getDay()];
}

function getDaysInMonth(month, year) {
    var date = new Date(year, month, 0);
    var nDaysInMonth = date.getDate();
    console.log("daysInMonth call");
    console.log("date = " + date);
    console.log("nDaysInMonth = " + nDaysInMonth);
    return nDaysInMonth;
}
