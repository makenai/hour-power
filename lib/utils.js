const moment = require('moment');
const _ = require('lodash');

function quarterHours(milliseconds) {
  const hoursWorked = milliseconds / 1000 / 60 / 60;
  return Math.round( hoursWorked * 4) / 4;
}
module.exports.quarterHours = quarterHours;

function dateForWeeklyReportIndex(index, startDate) {
  if (index === 7) {
    return 'total';
  }
  return moment(startDate).add( index, 'days').format('YYYY-MM-DD');
}

function nextReportDate(startDate) {
  return moment(startDate).add( 7, 'days').format('YYYY-MM-DD');
}
module.exports.nextReportDate = nextReportDate;

function dailyHoursByClient(weeklyReport, startDate) {
  const clients = {};

  weeklyReport.data.forEach(project => {
    const client = _.get(project, 'title.client');
    clients[ client ] = clients[ client ] || {};
    project.totals.forEach( (time, index) => {
      const dateStr = dateForWeeklyReportIndex( index, startDate );
      clients[ client ][ dateStr ] = (clients[ client ][ dateStr ] || 0) + time;
    });
  });

  // Convert milliseconds to quarterHours for each day
  const clientNames = Object.keys( clients );
  clientNames.forEach(client => {
    const dates = Object.keys( clients[ client ] );
    dates.forEach(date => {
      clients[ client ][ date ] = quarterHours( clients[ client ][ date ] );
    });
  });

  return clients; 
};
module.exports.dailyHoursByClient = dailyHoursByClient;

function projectNamesByClient(summaryReport) {
  const clients = {};
  summaryReport.data.forEach(client => {
    const clientName = _.get(client, 'title.client');
    clients[ clientName ] = client.items.map( item => _.get(item, 'title.time_entry') )
  });
  return clients;
}
module.exports.projectNamesByClient = projectNamesByClient;

function excelDate(date) {
  return moment(date, 'YYYY-MM-DD', true).format('MM/DD/YYYY');
}
module.exports.excelDate = excelDate;

function getDatesWithHours(clientHours) {
  const dateHasHours = {};
  const clientNames = Object.keys( clientHours );
  clientNames.forEach(clientName => {
    const dates = Object.keys( clientHours[ clientName ] );
    dates.forEach(date => {
      if (clientHours[ clientName ][ date ] && date !== 'total') {
        dateHasHours[ date ] = true;
      }
    });
  });
  let dates = Object.keys( dateHasHours );
  dates.sort();
  return dates;
}
module.exports.getDatesWithHours = getDatesWithHours;