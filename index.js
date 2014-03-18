var fs = require('fs');
var path = require('path');
var spawn = require('child_process').spawn;

var sourcePath = __dirname + '/source/';
var targetPath = __dirname + '/target/';
var templatePath = __dirname + '/template/';

var fileName = 'index';
var mdFile = path.join(sourcePath + fileName + '.md');
var htmlFile = path.join(targetPath + fileName + '.html');
var latexFile = path.join(targetPath + fileName + '.latex');
var pdfFile = path.join(targetPath + fileName + '.pdf');
var template = path.join(templatePath + 'default.tex');

/**
 * [readSourceFile description]
 * @param  {[type]} sourcePath [description]
 * @param  {[type]} fileName   [description]
 * @return {[type]}            [description]
 */
var readSourceFile = function (sourcePath, fileName) {
    console.log('readSourceFile');

    var filePath = path.join(sourcePath + fileName);
    var fileData = '';

    fs.readFile(filePath, {encoding: 'utf-8'}, function(err,data){

        if (!err){
            parseSourceFile(data);
        } else {
            console.log(err);
        }

    });
};

/**
 * [convertHTML2Markdown description]
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
var convertHTML2Markdown = function (data) {

};

/**
 * [convertMarkdown2HTML description]
 * @param  {[type]}   inputFile  [description]
 * @param  {[type]}   outputFile [description]
 * @param  {Function} cb         [description]
 * @return {[type]}              [description]
 */
var convertMarkdown2HTML = function (inputFile, outputFile, cb) {
    console.log('markdown -> html');

    var args = [
        inputFile, // input file
        '-o', outputFile // output file
    ];

    runPandoc(args, cb);
};

/**
 * [convertMarkdown2Latex description]
 * @param  {[type]}   inputFile  [description]
 * @param  {[type]}   outputFile [description]
 * @param  {Function} cb         [description]
 * @return {[type]}              [description]
 */
var convertMarkdown2Latex = function (inputFile, outputFile, cb) {

    console.log('markdown -> latex');

    var args = [
        inputFile, // input file
        '-o', outputFile // output file
        //'--listings'
        //'-t', 'markdown-fenced_code_blocks'
    ];

    runPandoc(args, cb);
};

/**
 * [convertLatex2PDF description]
 * @param  {[type]}   inputFile  [description]
 * @param  {[type]}   outputFile [description]
 * @param  {[type]}   template   [description]
 * @param  {Function} cb         [description]
 * @return {[type]}              [description]
 */
var convertLatex2PDF = function (inputFile, outputFile, template, cb) {

    console.log('latex -> pdf');

    var args = [
        inputFile, // input file
        '-o', outputFile, // output file
        '--toc', // table of content
        '--variable', 'toc-depth=3',
        '--template', template
        //'--highlight-style', 'pygments'
    ];

    runPandoc(args, cb);
};

/**
 * [runPandoc description]
 * @param  {[type]}   args [description]
 * @param  {Function} cb   [description]
 * @return {[type]}        [description]
 */
var runPandoc = function (args, cb) {

    var pandoc = spawn('pandoc', args);

    pandoc.on('exit', function(exitCode) {
        if (127 === exitCode) {
            console.log('Pandoc not found in your path. Please install.');
            process.exit(1);
        }
    });

    pandoc.on('error', function (err) {
        console.log('child process error ');
        console.log(err);
        process.exit(1);
    });

    pandoc.on('close', function (code, signal) {
        if(0 === code) {
            cb();
        }
        console.log('child process terminated ' + code);
        process.exit(1);
    });

    pandoc.stdout.on('data', function (data) {
        console.log('' + data);
        process.exit(1);
    });

    pandoc.stderr.on('data', function (data) {
        console.log('' + data);
        process.exit(1);
    });
};

/**
 * [init description]
 * @return {[type]} [description]
 */
var init = function () {
    convertMarkdown2Latex(mdFile, latexFile, function() {
        convertLatex2PDF(latexFile, pdfFile, template, function() {
            console.log('pdf ready');
        });
    });
    convertMarkdown2HTML(mdFile, htmlFile, function() {
        console.log('html ready');
    });
};

init();

//readSourceFile(sourcePath, 'index.html');