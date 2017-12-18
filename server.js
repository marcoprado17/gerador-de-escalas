const express = require("express");
const app = express();

var xl = require('excel4node');

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

    // TODO: Implement algorithm

    // Create a new instance of a Workbook class
    var wb = new xl.Workbook();

    // Add Worksheets to the workbook
    var ws = wb.addWorksheet('Sheet 1');
    var ws2 = wb.addWorksheet('Sheet 2');

    // Create a reusable style
    var style = wb.createStyle({
        font: {
            color: '#FF0800',
            size: 12
        },
        numberFormat: '$#,##0.00; ($#,##0.00); -'
    });

    // Set value of cell A1 to 100 as a number type styled with paramaters of style
    ws.cell(1, 1).number(100).style(style);

    // Set value of cell B1 to 300 as a number type styled with paramaters of style
    ws.cell(1, 2).number(200).style(style);

    // Set value of cell C1 to a formula styled with paramaters of style
    ws.cell(1, 3).formula('A1 + B1').style(style);

    // Set value of cell A2 to 'string' styled with paramaters of style
    ws.cell(2, 1).string('string').style(style);

    // Set value of cell A3 to true as a boolean type styled with paramaters of style but with an adjustment to the font size.
    ws.cell(3, 1).bool(true).style(style).style({ font: { size: 14 } });

    wb.write("excel.xlsx");

    res.download("./excel.xlsx");
});
