# Hour Power Hours Calculation Script

This is a script to run against Toggl and provide report data in a format that works with our Excel spreadsheets.

To use it, you'll need to set up your configuration stuff:

Copy config.json.sample to config.json and configure the things there.

1) You can find your Toggl API key on your profile page: https://toggl.com/app/profile

2) You can find your Workspace ID by clickon on 'Workspaces' on the left column, then clicking on the '...' icon next to your workspace and choosing 'Settings'. It will be in the URL.

3) You can find your own name on your birth certificate or drivers' license.

Don't forget to run 'yarn install'.

## Limitations

This will only do 7 days at a time due to using the Toggl weeklyReport returning 7 days at a time. The script will helpfully spit out a date for the start of the next 7 day period. Maybe someone will make a nice loop in the future.

## Examples

Sample Run:

```
$ node index.js 2018-09-01
Fetching details for 2018-09-01...
Fetching details for 2018-09-02...
Fetching details for 2018-09-03...
Fetching details for 2018-09-04...
Fetching details for 2018-09-05...
Fetching details for 2018-09-06...
Fetching details for 2018-09-07...

PictureThis
===========
09/01/2018,Pawel,0.25,,Bug Fixins
09/02/2018,Pawel,3.5,,Bug Fixins
09/03/2018,Pawel,4.5,,Updating user import script
09/04/2018,Pawel,5,,Updating user import script
09/05/2018,Pawel,2.75,,Updating user import script
09/06/2018,Pawel,3.75,,Updating user import script
09/07/2018,Pawel,0.5,,Updating user import script

Done! Next report date is 2018-09-08
```

If you run without a date, it will use today.

```
$ node index.js
Fetching details for 2018-09-12...

Codingscape
===========
09/12/2018,Pawel,3.25,,Hours reporting script

Done! Next report date is 2018-09-19
```

If you copy these CSV lines and paste them into Google Sheets, you'll see a little clipboard icon. Click on that and select 'Split Text into Columns' to make it all go into the right places.