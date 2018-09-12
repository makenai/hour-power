#!/usr/bin/env node
const config = require('./config.json');
const Toggl = require('toggl-api');
const moment = require('moment');
const utils = require('./lib/utils');
const stringify = require('csv-stringify');

const toggl = new Toggl({
  apiToken: config.toggle_api_key
});

// Take date from commandline parmeter
let startDate = moment().format('YYYY-MM-DD');
process.argv.forEach((value, index) => {
  if (index === 2) {
    const parsedDate = moment(value, 'YYYY-MM-DD', true);
    if (parsedDate.isValid()) {
      startDate = parsedDate.format('YYYY-MM-DD');
    } else {
      console.error('Invalid date! Usage: hour-power YYYY-MM-DD');
      process.exit(1);
    }
  }
});

toggl.weeklyReport({
  workspace_id: config.workspace_id,
  since: startDate
}, async function (err, report) {
  if (err) {
    console.log('Error fetching weekly report!');
    process.exit(1);
  }
  const clientHours = utils.dailyHoursByClient( report, startDate );
  const datesWithHours = utils.getDatesWithHours( clientHours );
  
  const dailyClientSummary = {};
  for(const date of datesWithHours) {
    console.log(`Fetching details for ${date}...`);
    const summary = await delayedDailySummary(date, 1);
    dailyClientSummary[ date ] = summary;
  };
  console.log("");

  const clientNames = Object.keys( clientHours );
  clientNames.sort();

  for (const clientName of clientNames) {
    console.log( clientName );
    console.log( clientName.replace(/./g, '='));

    const reportLines = [];
    datesWithHours.forEach(date => {
      const hours = clientHours[ clientName ][ date ];
      if ( hours && date !== 'total' ) {
        const reportLine = [
          utils.excelDate(date),
          config.name,
          hours,
          '',
          (dailyClientSummary[ date ][ clientName ] || []).join(', ')
        ];
        reportLines.push( reportLine );
      }
    });

    const csvData = await toCSV(reportLines);
    console.log( csvData );
  };
  console.log(`Done! Next report date is ${utils.nextReportDate(startDate)}`);
});

function toCSV(lines) {
  return new Promise((resolve,reject) => {
    stringify(lines, (error, output) => {
      if (error) {
        return reject(error);
      }
      return resolve(output);
    })
  });
}

// Toggl says not to hit their API more than once per second
// https://github.com/toggl/toggl_api_docs
function delayedDailySummary(date, delaySeconds) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      toggl.summaryReport({
        workspace_id: config.workspace_id,
        grouping: 'clients',
        subgrouping: 'time_entries',
        since: date,
        until: date,
      }, (err, report) => {
        if (err) {
          reject(err);
        }
        const projects = utils.projectNamesByClient( report );
        resolve( projects );
      });
    }, delaySeconds * 1000)
  });
}


