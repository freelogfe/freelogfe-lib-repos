import * as  Metalsmith from 'metalsmith';
// import {handlebars} from 'consolidate';
import * as Mustache from 'mustache';

export default function (source: string, destination: string, metadata: any) {
  return new Promise((resolve, reject) => {
    Metalsmith(__dirname)
      .source(source)
      .destination(destination)
      .metadata(metadata)
      .use(template)
      .build(function (err: any) {
        if (err) {
          reject(err);
          throw err;
        }
        resolve();
      });
  })
};

function template(files: any, metalsmith: any, done: any) {
  var keys = Object.keys(files);
  var metadata = metalsmith.metadata();

  for (const file of keys) {
    var str = files[file].contents.toString();
    // handlebars.render(str, metadata, function (err: any, res: any) {
    //   if (err) {
    //     return done(err);
    //   }
    //   files[file].contents = new Buffer(res);
    // });
    const output = Mustache.render(str, metadata);
    files[file].contents = Buffer.from(output);
  }
  done();
}
