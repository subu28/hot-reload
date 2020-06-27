const fs = require('fs');

htmlTemplate = `
<html>
  <body style="font-family: monospace;">
  <h1>Contents of {{relPath}}</h1>
  <table>
    <tr><td></td><td style="min-width: 400px; font-weight: bolder;">Name</td><td style="font-weight: bolder;">Size</td></tr>
    {{rows}}
  </table>
  <body>
  <style>
    tr {
      height: 20px;
    }
    tr:hover {
      background: #dddddd;
    }
    table {
      border-collapse: collapse;
      font-size: 17px;
      line-height: 26px;
    }
  </style>
</html>
`
rowTeamplate = `
  <tr>
    <td>{{logo}}</td>
    <td style="padding-right:20px;"><a href="{{name}}">{{name}}</a></td>
    <td>{{size}}</td>
  </tr>
`
folderCode = '&#128193;';
fileCode = '&#128196;';

function getHumanReadable(size) {
  if (size === '') {
    return '';
  }
  if (size < 1024) {
    return `${size}B`;
  } else if (size < 1048576) {
    return `${(size/1024).toFixed(2)}KiB`;
  } else if (size < 1073741824) {
    return `${(size/1048576).toFixed(2)}MiB`
  } else {
    return `${(size/1073741824).toFixed(2)}GiB`
  }
}

function dirView(path, relPath) {
  const list =  fs.readdirSync(path, { encoding: 'utf8' }).map(item => {
    const stat = fs.statSync(path + item)
    return {
      name: item,
      isDir: stat.isDirectory(),
      size: stat.isDirectory() ? '' : stat.size,
    }
  });

  if (relPath !== '/') {
    list.unshift({
      name: '../',
      isDir: true,
      size: ''
    })
  }

  const renderedRows = list.map(file => {
    return rowTeamplate
      .replace('{{logo}}', file.isDir ? folderCode : fileCode)
      .replace('{{name}}', file.name).replace('{{name}}', file.name)
      .replace('{{size}}', getHumanReadable(file.size));
  }).join('');

  return htmlTemplate.replace('{{relPath}}', relPath).replace('{{rows}}', renderedRows);
}
module.exports = dirView;