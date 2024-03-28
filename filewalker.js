const path = require("path");
const fs = require("fs");

/**
 * Explores recursively a directory and returns all the filepaths and folderpaths in the callback.
 *
 * @param {String} dir
 * @param {Function} done
 */
function filewalker(dir, parentDir, done) {
        if(parentDir == null){
                parentDir = dir;
        }
        parentDir = path.resolve(parentDir);
        let results = {
                AllFiles: [],
                layouts: [],
                partials: [],
                pages: []
         };
     
         fs.readdir(dir, function(err, list) {
             if (err) return done(err);
     
             let pending = list.length;
             if (!pending) return done(null, results);
     
             list.forEach(function(file) {
                 file = path.resolve(dir, file);
     
                 fs.stat(file, function(err, stat) {
                     if (stat && stat.isDirectory()) {
                         // Add directory to array (comment if you need to remove directories from the array)
                         //results.push(file);
     
                         filewalker(file, parentDir, function(err, res) {
                             results.AllFiles = results.AllFiles.concat(res.AllFiles);
                             results.layouts = results.layouts.concat(res.layouts);
                             results.partials = results.partials.concat(res.partials);
                             results.pages = results.pages.concat(res.pages);
                             if (!--pending) done(null, results);
                         });
                     } else {
                         let { name, base, ext, dir, root } = path.parse(file);
                         console.log(name, base, ext, dir, root)
                         switch(ext){
                                 case ".hbs": {
                                         if(name.endsWith(".layout")){
                                                 // layout file
                                                 results.layouts.push({file: file, fileRelativeToReadDir: removeParentDir(file, parentDir), layoutName: name.replace(".layout",""), layoutNameRelative: removeParentDir(file, parentDir).replace(/[\\]|[\/]/g,"_").replace(".layout.hbs","")})
                                         }
                                         else if(name.endsWith(".partial")){
                                                 // partial file
                                                 results.partials.push({file: file, fileRelativeToReadDir: removeParentDir(file, parentDir), paritalName: name.replace(".partial",""), partialNameRelative: removeParentDir(file, parentDir).replace(/[\\]|[\/]/g,"_").replace(".partial.hbs","")})
                                         }
                                 }
                                 break;
                                 case ".html":{
                                        console.log(name);
                                        if(name.endsWith(".view")){
                                                // partial file
                                                let pageAccessUrls = []
                                                let access = removeParentDir(file, parentDir, false).replace(/[\\]|[\/]/g,"/")
                                                pageAccessUrls.push(access.replace(".view.html",".html"));
                                                pageAccessUrls.push(access.replace(".view.html",""));
                                                if(name.replace(".view","").trim() == "index"){
                                                        pageAccessUrls.push(access.replace("index.view.html",""));
                                                }
                                                results.pages.push({file: file, fileRelativeToReadDir: removeParentDir(file, parentDir), pageAccessUrls: pageAccessUrls,  viewName: name.replace(".view","")})
                                        }
                                 }
                                 break;
                         }
                         results.AllFiles.push(file);
                         if (!--pending) done(null, results);
                     }
                 });
             });
         });
    }
    function removeParentDir(file, parentDir, trim = true){
        file = file.replace(parentDir, "");
        if(trim){
                if(file.startsWith("\\")){
                file = file.substring(1,file.length);
        }
        if(file.startsWith("/")){
                file = file.substring(1,file.length);
        }
        }
        
        return file;
    }
    /*// Usage example:
    filewalker("./handlebars", null,function(err, data) {
        if (err) {
            throw err;
        }
        console.log(JSON.stringify(data, null, "\t")); // Example output: ["c://some-existent-path/file.txt", "c:/some-existent-path/subfolder"]
    });*/
    module.exports = {
        filewalker,
        removeParentDir
    }