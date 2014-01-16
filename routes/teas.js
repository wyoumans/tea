var mongo = require('mongodb')
  , Server = mongo.Server
  , Db = mongo.Db
  , BSON = mongo.BSONPure;

var server = new Server('localhost', 27017, {
  auto_reconnect: true
});

db = new Db('teadb', server, {
  safe: true
});

db.open(function(err, db) {
  if (!err) {
    console.log("Connected to 'teadb' database");
    db.collection('teas', {
      safe: true
    }, function(err, collection) {
      if (err) {
        console.log("The 'teas' collection doesn't exist. Creating it with sample data...");
        populateDB();
      }
    });
  }
});

exports.findById = function(req, res) {
  var id = req.params.id;
  console.log('Retrieving tea: ' + id);
  db.collection('teas', function(err, collection) {
    collection.findOne({
      '_id': new BSON.ObjectID(id)
    }, function(err, item) {
      res.send(item);
    });
  });
};

exports.findAll = function(req, res) {
  db.collection('teas', function(err, collection) {
    collection.find().toArray(function(err, items) {
      res.send(items);
    });
  });
};

exports.addTea = function(req, res) {
  var tea = req.body;
  console.log('Adding tea: ' + JSON.stringify(tea));
  db.collection('teas', function(err, collection) {
    collection.insert(tea, {
      safe: true
    }, function(err, result) {
      if (err) {
        res.send({
          'error': 'An error has occurred'
        });
      } else {
        console.log('Success: ' + JSON.stringify(result[0]));
        res.send(result[0]);
      }
    });
  });
}

exports.updateTea = function(req, res) {
  var id = req.params.id;
  var tea = req.body;
  delete tea._id;
  console.log('Updating tea: ' + id);
  console.log(JSON.stringify(tea));
  db.collection('teas', function(err, collection) {
    collection.update({
      '_id': new BSON.ObjectID(id)
    }, tea, {
      safe: true
    }, function(err, result) {
      if (err) {
        console.log('Error updating tea: ' + err);
        res.send({
          'error': 'An error has occurred'
        });
      } else {
        console.log('' + result + ' document(s) updated');
        res.send(tea);
      }
    });
  });
}

exports.deleteTea = function(req, res) {
  var id = req.params.id;
  console.log('Deleting tea: ' + id);
  db.collection('teas', function(err, collection) {
    collection.remove({
      '_id': new BSON.ObjectID(id)
    }, {
      safe: true
    }, function(err, result) {
      if (err) {
        res.send({
          'error': 'An error has occurred - ' + err
        });
      } else {
        console.log('' + result + ' document(s) deleted');
        res.send(req.body);
      }
    });
  });
}

/*--------------------------------------------------------------------------------------------------------------------*/
// Populate database with sample data -- Only used once: the first time the application is started.
// You'd typically not find this code in a real-life app, since the database would already exist.
var populateDB = function() {

  var teas = [{
    name: "CHATEAU DE SAINT COSME",
    year: "2009",
    type: "Black",
    country: "China",
    region: "Yunnan Province",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sagittis lacinia ultrices. Nam tempus enim a nibh iaculis a ultricies dolor pharetra. Duis ultricies auctor justo sit amet dignissim. Aliquam semper lacus in diam pretium id iaculis nisl facilisis. Donec sed mi in risus fringilla pulvinar. Ut adipiscing sagittis est, consectetur imperdiet massa eleifend ut. Praesent ac imperdiet enim. Quisque luctus massa non nibh elementum convallis. Quisque vitae augue nec libero blandit vehicula. Vestibulum luctus ante eu purus scelerisque tempor. Mauris euismod metus eu diam pellentesque molestie. Aliquam erat volutpat. Sed non libero ligula. Sed sapien metus, blandit nec vestibulum at, consectetur et est. Sed lacinia justo nulla. Etiam sem mi, malesuada vitae gravida in, adipiscing at urna. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam sodales, mi a congue convallis, sapien orci feugiat quam, nec rutrum nunc felis sit amet orci. Aenean urna nunc, imperdiet non tincidunt eget, commodo id sem. Mauris tincidunt adipiscing metus, eget euismod neque semper quis. Donec ornare nulla vitae elit mollis a rutrum ipsum elementum. In at rhoncus erat. Sed bibendum aliquet justo quis aliquam. Aliquam vehicula, enim sed suscipit lobortis, est nunc elementum elit, ut cursus risus dolor egestas augue.",
    picture: "generic.jpg"
  }, {
    name: "LAN RIOJA CRIANZA",
    year: "2006",
    type: "Black",
    country: "China",
    region: "Yunnan Province",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sagittis lacinia ultrices. Nam tempus enim a nibh iaculis a ultricies dolor pharetra. Duis ultricies auctor justo sit amet dignissim. Aliquam semper lacus in diam pretium id iaculis nisl facilisis. Donec sed mi in risus fringilla pulvinar. Ut adipiscing sagittis est, consectetur imperdiet massa eleifend ut. Praesent ac imperdiet enim. Quisque luctus massa non nibh elementum convallis. Quisque vitae augue nec libero blandit vehicula. Vestibulum luctus ante eu purus scelerisque tempor. Mauris euismod metus eu diam pellentesque molestie. Aliquam erat volutpat. Sed non libero ligula. Sed sapien metus, blandit nec vestibulum at, consectetur et est. Sed lacinia justo nulla. Etiam sem mi, malesuada vitae gravida in, adipiscing at urna. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam sodales, mi a congue convallis, sapien orci feugiat quam, nec rutrum nunc felis sit amet orci. Aenean urna nunc, imperdiet non tincidunt eget, commodo id sem. Mauris tincidunt adipiscing metus, eget euismod neque semper quis. Donec ornare nulla vitae elit mollis a rutrum ipsum elementum. In at rhoncus erat. Sed bibendum aliquet justo quis aliquam. Aliquam vehicula, enim sed suscipit lobortis, est nunc elementum elit, ut cursus risus dolor egestas augue.",
    picture: "generic.jpg"
  }, {
    name: "MARGERUM SYBARITE",
    year: "2010",
    type: "Black",
    country: "China",
    region: "Yunnan Province",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sagittis lacinia ultrices. Nam tempus enim a nibh iaculis a ultricies dolor pharetra. Duis ultricies auctor justo sit amet dignissim. Aliquam semper lacus in diam pretium id iaculis nisl facilisis. Donec sed mi in risus fringilla pulvinar. Ut adipiscing sagittis est, consectetur imperdiet massa eleifend ut. Praesent ac imperdiet enim. Quisque luctus massa non nibh elementum convallis. Quisque vitae augue nec libero blandit vehicula. Vestibulum luctus ante eu purus scelerisque tempor. Mauris euismod metus eu diam pellentesque molestie. Aliquam erat volutpat. Sed non libero ligula. Sed sapien metus, blandit nec vestibulum at, consectetur et est. Sed lacinia justo nulla. Etiam sem mi, malesuada vitae gravida in, adipiscing at urna. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam sodales, mi a congue convallis, sapien orci feugiat quam, nec rutrum nunc felis sit amet orci. Aenean urna nunc, imperdiet non tincidunt eget, commodo id sem. Mauris tincidunt adipiscing metus, eget euismod neque semper quis. Donec ornare nulla vitae elit mollis a rutrum ipsum elementum. In at rhoncus erat. Sed bibendum aliquet justo quis aliquam. Aliquam vehicula, enim sed suscipit lobortis, est nunc elementum elit, ut cursus risus dolor egestas augue.",
    picture: "generic.jpg"
  }, {
    name: "OWEN ROE \"EX UMBRIS\"",
    year: "2009",
    type: "Black",
    country: "China",
    region: "Yunnan Province",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sagittis lacinia ultrices. Nam tempus enim a nibh iaculis a ultricies dolor pharetra. Duis ultricies auctor justo sit amet dignissim. Aliquam semper lacus in diam pretium id iaculis nisl facilisis. Donec sed mi in risus fringilla pulvinar. Ut adipiscing sagittis est, consectetur imperdiet massa eleifend ut. Praesent ac imperdiet enim. Quisque luctus massa non nibh elementum convallis. Quisque vitae augue nec libero blandit vehicula. Vestibulum luctus ante eu purus scelerisque tempor. Mauris euismod metus eu diam pellentesque molestie. Aliquam erat volutpat. Sed non libero ligula. Sed sapien metus, blandit nec vestibulum at, consectetur et est. Sed lacinia justo nulla. Etiam sem mi, malesuada vitae gravida in, adipiscing at urna. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam sodales, mi a congue convallis, sapien orci feugiat quam, nec rutrum nunc felis sit amet orci. Aenean urna nunc, imperdiet non tincidunt eget, commodo id sem. Mauris tincidunt adipiscing metus, eget euismod neque semper quis. Donec ornare nulla vitae elit mollis a rutrum ipsum elementum. In at rhoncus erat. Sed bibendum aliquet justo quis aliquam. Aliquam vehicula, enim sed suscipit lobortis, est nunc elementum elit, ut cursus risus dolor egestas augue.",
    picture: "generic.jpg"
  }, {
    name: "REX HILL",
    year: "2009",
    type: "Black",
    country: "China",
    region: "Yunnan Province",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sagittis lacinia ultrices. Nam tempus enim a nibh iaculis a ultricies dolor pharetra. Duis ultricies auctor justo sit amet dignissim. Aliquam semper lacus in diam pretium id iaculis nisl facilisis. Donec sed mi in risus fringilla pulvinar. Ut adipiscing sagittis est, consectetur imperdiet massa eleifend ut. Praesent ac imperdiet enim. Quisque luctus massa non nibh elementum convallis. Quisque vitae augue nec libero blandit vehicula. Vestibulum luctus ante eu purus scelerisque tempor. Mauris euismod metus eu diam pellentesque molestie. Aliquam erat volutpat. Sed non libero ligula. Sed sapien metus, blandit nec vestibulum at, consectetur et est. Sed lacinia justo nulla. Etiam sem mi, malesuada vitae gravida in, adipiscing at urna. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam sodales, mi a congue convallis, sapien orci feugiat quam, nec rutrum nunc felis sit amet orci. Aenean urna nunc, imperdiet non tincidunt eget, commodo id sem. Mauris tincidunt adipiscing metus, eget euismod neque semper quis. Donec ornare nulla vitae elit mollis a rutrum ipsum elementum. In at rhoncus erat. Sed bibendum aliquet justo quis aliquam. Aliquam vehicula, enim sed suscipit lobortis, est nunc elementum elit, ut cursus risus dolor egestas augue.",
    picture: "generic.jpg"
  }, {
    name: "VITICCIO CLASSICO RISERVA",
    year: "2007",
    type: "Black",
    country: "China",
    region: "Yunnan Province",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sagittis lacinia ultrices. Nam tempus enim a nibh iaculis a ultricies dolor pharetra. Duis ultricies auctor justo sit amet dignissim. Aliquam semper lacus in diam pretium id iaculis nisl facilisis. Donec sed mi in risus fringilla pulvinar. Ut adipiscing sagittis est, consectetur imperdiet massa eleifend ut. Praesent ac imperdiet enim. Quisque luctus massa non nibh elementum convallis. Quisque vitae augue nec libero blandit vehicula. Vestibulum luctus ante eu purus scelerisque tempor. Mauris euismod metus eu diam pellentesque molestie. Aliquam erat volutpat. Sed non libero ligula. Sed sapien metus, blandit nec vestibulum at, consectetur et est. Sed lacinia justo nulla. Etiam sem mi, malesuada vitae gravida in, adipiscing at urna. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam sodales, mi a congue convallis, sapien orci feugiat quam, nec rutrum nunc felis sit amet orci. Aenean urna nunc, imperdiet non tincidunt eget, commodo id sem. Mauris tincidunt adipiscing metus, eget euismod neque semper quis. Donec ornare nulla vitae elit mollis a rutrum ipsum elementum. In at rhoncus erat. Sed bibendum aliquet justo quis aliquam. Aliquam vehicula, enim sed suscipit lobortis, est nunc elementum elit, ut cursus risus dolor egestas augue.",
    picture: "generic.jpg"
  }, {
    name: "CHATEAU LE DOYENNE",
    year: "2005",
    type: "Black",
    country: "China",
    region: "Yunnan Province",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sagittis lacinia ultrices. Nam tempus enim a nibh iaculis a ultricies dolor pharetra. Duis ultricies auctor justo sit amet dignissim. Aliquam semper lacus in diam pretium id iaculis nisl facilisis. Donec sed mi in risus fringilla pulvinar. Ut adipiscing sagittis est, consectetur imperdiet massa eleifend ut. Praesent ac imperdiet enim. Quisque luctus massa non nibh elementum convallis. Quisque vitae augue nec libero blandit vehicula. Vestibulum luctus ante eu purus scelerisque tempor. Mauris euismod metus eu diam pellentesque molestie. Aliquam erat volutpat. Sed non libero ligula. Sed sapien metus, blandit nec vestibulum at, consectetur et est. Sed lacinia justo nulla. Etiam sem mi, malesuada vitae gravida in, adipiscing at urna. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam sodales, mi a congue convallis, sapien orci feugiat quam, nec rutrum nunc felis sit amet orci. Aenean urna nunc, imperdiet non tincidunt eget, commodo id sem. Mauris tincidunt adipiscing metus, eget euismod neque semper quis. Donec ornare nulla vitae elit mollis a rutrum ipsum elementum. In at rhoncus erat. Sed bibendum aliquet justo quis aliquam. Aliquam vehicula, enim sed suscipit lobortis, est nunc elementum elit, ut cursus risus dolor egestas augue.",
    picture: "generic.jpg"
  }, {
    name: "DOMAINE DU BOUSCAT",
    year: "2009",
    type: "Black",
    country: "China",
    region: "Yunnan Province",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sagittis lacinia ultrices. Nam tempus enim a nibh iaculis a ultricies dolor pharetra. Duis ultricies auctor justo sit amet dignissim. Aliquam semper lacus in diam pretium id iaculis nisl facilisis. Donec sed mi in risus fringilla pulvinar. Ut adipiscing sagittis est, consectetur imperdiet massa eleifend ut. Praesent ac imperdiet enim. Quisque luctus massa non nibh elementum convallis. Quisque vitae augue nec libero blandit vehicula. Vestibulum luctus ante eu purus scelerisque tempor. Mauris euismod metus eu diam pellentesque molestie. Aliquam erat volutpat. Sed non libero ligula. Sed sapien metus, blandit nec vestibulum at, consectetur et est. Sed lacinia justo nulla. Etiam sem mi, malesuada vitae gravida in, adipiscing at urna. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam sodales, mi a congue convallis, sapien orci feugiat quam, nec rutrum nunc felis sit amet orci. Aenean urna nunc, imperdiet non tincidunt eget, commodo id sem. Mauris tincidunt adipiscing metus, eget euismod neque semper quis. Donec ornare nulla vitae elit mollis a rutrum ipsum elementum. In at rhoncus erat. Sed bibendum aliquet justo quis aliquam. Aliquam vehicula, enim sed suscipit lobortis, est nunc elementum elit, ut cursus risus dolor egestas augue.",
    picture: "generic.jpg"
  }, {
    name: "BLOCK NINE",
    year: "2009",
    type: "Black",
    country: "China",
    region: "Yunnan Province",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sagittis lacinia ultrices. Nam tempus enim a nibh iaculis a ultricies dolor pharetra. Duis ultricies auctor justo sit amet dignissim. Aliquam semper lacus in diam pretium id iaculis nisl facilisis. Donec sed mi in risus fringilla pulvinar. Ut adipiscing sagittis est, consectetur imperdiet massa eleifend ut. Praesent ac imperdiet enim. Quisque luctus massa non nibh elementum convallis. Quisque vitae augue nec libero blandit vehicula. Vestibulum luctus ante eu purus scelerisque tempor. Mauris euismod metus eu diam pellentesque molestie. Aliquam erat volutpat. Sed non libero ligula. Sed sapien metus, blandit nec vestibulum at, consectetur et est. Sed lacinia justo nulla. Etiam sem mi, malesuada vitae gravida in, adipiscing at urna. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam sodales, mi a congue convallis, sapien orci feugiat quam, nec rutrum nunc felis sit amet orci. Aenean urna nunc, imperdiet non tincidunt eget, commodo id sem. Mauris tincidunt adipiscing metus, eget euismod neque semper quis. Donec ornare nulla vitae elit mollis a rutrum ipsum elementum. In at rhoncus erat. Sed bibendum aliquet justo quis aliquam. Aliquam vehicula, enim sed suscipit lobortis, est nunc elementum elit, ut cursus risus dolor egestas augue.",
    picture: "generic.jpg"
  }, {
    name: "DOMAINE SERENE",
    year: "2007",
    type: "Black",
    country: "China",
    region: "Yunnan Province",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sagittis lacinia ultrices. Nam tempus enim a nibh iaculis a ultricies dolor pharetra. Duis ultricies auctor justo sit amet dignissim. Aliquam semper lacus in diam pretium id iaculis nisl facilisis. Donec sed mi in risus fringilla pulvinar. Ut adipiscing sagittis est, consectetur imperdiet massa eleifend ut. Praesent ac imperdiet enim. Quisque luctus massa non nibh elementum convallis. Quisque vitae augue nec libero blandit vehicula. Vestibulum luctus ante eu purus scelerisque tempor. Mauris euismod metus eu diam pellentesque molestie. Aliquam erat volutpat. Sed non libero ligula. Sed sapien metus, blandit nec vestibulum at, consectetur et est. Sed lacinia justo nulla. Etiam sem mi, malesuada vitae gravida in, adipiscing at urna. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam sodales, mi a congue convallis, sapien orci feugiat quam, nec rutrum nunc felis sit amet orci. Aenean urna nunc, imperdiet non tincidunt eget, commodo id sem. Mauris tincidunt adipiscing metus, eget euismod neque semper quis. Donec ornare nulla vitae elit mollis a rutrum ipsum elementum. In at rhoncus erat. Sed bibendum aliquet justo quis aliquam. Aliquam vehicula, enim sed suscipit lobortis, est nunc elementum elit, ut cursus risus dolor egestas augue.",
    picture: "generic.jpg"
  }, {
    name: "BODEGA LURTON",
    year: "2011",
    type: "Black",
    country: "China",
    region: "Yunnan Province",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sagittis lacinia ultrices. Nam tempus enim a nibh iaculis a ultricies dolor pharetra. Duis ultricies auctor justo sit amet dignissim. Aliquam semper lacus in diam pretium id iaculis nisl facilisis. Donec sed mi in risus fringilla pulvinar. Ut adipiscing sagittis est, consectetur imperdiet massa eleifend ut. Praesent ac imperdiet enim. Quisque luctus massa non nibh elementum convallis. Quisque vitae augue nec libero blandit vehicula. Vestibulum luctus ante eu purus scelerisque tempor. Mauris euismod metus eu diam pellentesque molestie. Aliquam erat volutpat. Sed non libero ligula. Sed sapien metus, blandit nec vestibulum at, consectetur et est. Sed lacinia justo nulla. Etiam sem mi, malesuada vitae gravida in, adipiscing at urna. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam sodales, mi a congue convallis, sapien orci feugiat quam, nec rutrum nunc felis sit amet orci. Aenean urna nunc, imperdiet non tincidunt eget, commodo id sem. Mauris tincidunt adipiscing metus, eget euismod neque semper quis. Donec ornare nulla vitae elit mollis a rutrum ipsum elementum. In at rhoncus erat. Sed bibendum aliquet justo quis aliquam. Aliquam vehicula, enim sed suscipit lobortis, est nunc elementum elit, ut cursus risus dolor egestas augue.",
    picture: "generic.jpg"
  }, {
    name: "LES MORIZOTTES",
    year: "2009",
    type: "Black",
    country: "China",
    region: "Yunnan Province",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sagittis lacinia ultrices. Nam tempus enim a nibh iaculis a ultricies dolor pharetra. Duis ultricies auctor justo sit amet dignissim. Aliquam semper lacus in diam pretium id iaculis nisl facilisis. Donec sed mi in risus fringilla pulvinar. Ut adipiscing sagittis est, consectetur imperdiet massa eleifend ut. Praesent ac imperdiet enim. Quisque luctus massa non nibh elementum convallis. Quisque vitae augue nec libero blandit vehicula. Vestibulum luctus ante eu purus scelerisque tempor. Mauris euismod metus eu diam pellentesque molestie. Aliquam erat volutpat. Sed non libero ligula. Sed sapien metus, blandit nec vestibulum at, consectetur et est. Sed lacinia justo nulla. Etiam sem mi, malesuada vitae gravida in, adipiscing at urna. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam sodales, mi a congue convallis, sapien orci feugiat quam, nec rutrum nunc felis sit amet orci. Aenean urna nunc, imperdiet non tincidunt eget, commodo id sem. Mauris tincidunt adipiscing metus, eget euismod neque semper quis. Donec ornare nulla vitae elit mollis a rutrum ipsum elementum. In at rhoncus erat. Sed bibendum aliquet justo quis aliquam. Aliquam vehicula, enim sed suscipit lobortis, est nunc elementum elit, ut cursus risus dolor egestas augue.",
    picture: "generic.jpg"
  }, {
    name: "ARGIANO NON CONFUNDITUR",
    year: "2009",
    type: "Black",
    country: "China",
    region: "Yunnan Province",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sagittis lacinia ultrices. Nam tempus enim a nibh iaculis a ultricies dolor pharetra. Duis ultricies auctor justo sit amet dignissim. Aliquam semper lacus in diam pretium id iaculis nisl facilisis. Donec sed mi in risus fringilla pulvinar. Ut adipiscing sagittis est, consectetur imperdiet massa eleifend ut. Praesent ac imperdiet enim. Quisque luctus massa non nibh elementum convallis. Quisque vitae augue nec libero blandit vehicula. Vestibulum luctus ante eu purus scelerisque tempor. Mauris euismod metus eu diam pellentesque molestie. Aliquam erat volutpat. Sed non libero ligula. Sed sapien metus, blandit nec vestibulum at, consectetur et est. Sed lacinia justo nulla. Etiam sem mi, malesuada vitae gravida in, adipiscing at urna. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam sodales, mi a congue convallis, sapien orci feugiat quam, nec rutrum nunc felis sit amet orci. Aenean urna nunc, imperdiet non tincidunt eget, commodo id sem. Mauris tincidunt adipiscing metus, eget euismod neque semper quis. Donec ornare nulla vitae elit mollis a rutrum ipsum elementum. In at rhoncus erat. Sed bibendum aliquet justo quis aliquam. Aliquam vehicula, enim sed suscipit lobortis, est nunc elementum elit, ut cursus risus dolor egestas augue.",
    picture: "generic.jpg"
  }, {
    name: "DINASTIA VIVANCO ",
    year: "2008",
    type: "Black",
    country: "China",
    region: "Yunnan Province",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sagittis lacinia ultrices. Nam tempus enim a nibh iaculis a ultricies dolor pharetra. Duis ultricies auctor justo sit amet dignissim. Aliquam semper lacus in diam pretium id iaculis nisl facilisis. Donec sed mi in risus fringilla pulvinar. Ut adipiscing sagittis est, consectetur imperdiet massa eleifend ut. Praesent ac imperdiet enim. Quisque luctus massa non nibh elementum convallis. Quisque vitae augue nec libero blandit vehicula. Vestibulum luctus ante eu purus scelerisque tempor. Mauris euismod metus eu diam pellentesque molestie. Aliquam erat volutpat. Sed non libero ligula. Sed sapien metus, blandit nec vestibulum at, consectetur et est. Sed lacinia justo nulla. Etiam sem mi, malesuada vitae gravida in, adipiscing at urna. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam sodales, mi a congue convallis, sapien orci feugiat quam, nec rutrum nunc felis sit amet orci. Aenean urna nunc, imperdiet non tincidunt eget, commodo id sem. Mauris tincidunt adipiscing metus, eget euismod neque semper quis. Donec ornare nulla vitae elit mollis a rutrum ipsum elementum. In at rhoncus erat. Sed bibendum aliquet justo quis aliquam. Aliquam vehicula, enim sed suscipit lobortis, est nunc elementum elit, ut cursus risus dolor egestas augue.",
    picture: "generic.jpg"
  }, {
    name: "PETALOS BIERZO",
    year: "2009",
    type: "Black",
    country: "China",
    region: "Yunnan Province",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sagittis lacinia ultrices. Nam tempus enim a nibh iaculis a ultricies dolor pharetra. Duis ultricies auctor justo sit amet dignissim. Aliquam semper lacus in diam pretium id iaculis nisl facilisis. Donec sed mi in risus fringilla pulvinar. Ut adipiscing sagittis est, consectetur imperdiet massa eleifend ut. Praesent ac imperdiet enim. Quisque luctus massa non nibh elementum convallis. Quisque vitae augue nec libero blandit vehicula. Vestibulum luctus ante eu purus scelerisque tempor. Mauris euismod metus eu diam pellentesque molestie. Aliquam erat volutpat. Sed non libero ligula. Sed sapien metus, blandit nec vestibulum at, consectetur et est. Sed lacinia justo nulla. Etiam sem mi, malesuada vitae gravida in, adipiscing at urna. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam sodales, mi a congue convallis, sapien orci feugiat quam, nec rutrum nunc felis sit amet orci. Aenean urna nunc, imperdiet non tincidunt eget, commodo id sem. Mauris tincidunt adipiscing metus, eget euismod neque semper quis. Donec ornare nulla vitae elit mollis a rutrum ipsum elementum. In at rhoncus erat. Sed bibendum aliquet justo quis aliquam. Aliquam vehicula, enim sed suscipit lobortis, est nunc elementum elit, ut cursus risus dolor egestas augue.",
    picture: "generic.jpg"
  }, {
    name: "SHAFER RED SHOULDER RANCH",
    year: "2009",
    type: "Black",
    country: "China",
    region: "Yunnan Province",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sagittis lacinia ultrices. Nam tempus enim a nibh iaculis a ultricies dolor pharetra. Duis ultricies auctor justo sit amet dignissim. Aliquam semper lacus in diam pretium id iaculis nisl facilisis. Donec sed mi in risus fringilla pulvinar. Ut adipiscing sagittis est, consectetur imperdiet massa eleifend ut. Praesent ac imperdiet enim. Quisque luctus massa non nibh elementum convallis. Quisque vitae augue nec libero blandit vehicula. Vestibulum luctus ante eu purus scelerisque tempor. Mauris euismod metus eu diam pellentesque molestie. Aliquam erat volutpat. Sed non libero ligula. Sed sapien metus, blandit nec vestibulum at, consectetur et est. Sed lacinia justo nulla. Etiam sem mi, malesuada vitae gravida in, adipiscing at urna. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam sodales, mi a congue convallis, sapien orci feugiat quam, nec rutrum nunc felis sit amet orci. Aenean urna nunc, imperdiet non tincidunt eget, commodo id sem. Mauris tincidunt adipiscing metus, eget euismod neque semper quis. Donec ornare nulla vitae elit mollis a rutrum ipsum elementum. In at rhoncus erat. Sed bibendum aliquet justo quis aliquam. Aliquam vehicula, enim sed suscipit lobortis, est nunc elementum elit, ut cursus risus dolor egestas augue.",
    picture: "generic.jpg"
  }, {
    name: "PONZI",
    year: "2010",
    type: "Black",
    country: "China",
    region: "Yunnan Province",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sagittis lacinia ultrices. Nam tempus enim a nibh iaculis a ultricies dolor pharetra. Duis ultricies auctor justo sit amet dignissim. Aliquam semper lacus in diam pretium id iaculis nisl facilisis. Donec sed mi in risus fringilla pulvinar. Ut adipiscing sagittis est, consectetur imperdiet massa eleifend ut. Praesent ac imperdiet enim. Quisque luctus massa non nibh elementum convallis. Quisque vitae augue nec libero blandit vehicula. Vestibulum luctus ante eu purus scelerisque tempor. Mauris euismod metus eu diam pellentesque molestie. Aliquam erat volutpat. Sed non libero ligula. Sed sapien metus, blandit nec vestibulum at, consectetur et est. Sed lacinia justo nulla. Etiam sem mi, malesuada vitae gravida in, adipiscing at urna. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam sodales, mi a congue convallis, sapien orci feugiat quam, nec rutrum nunc felis sit amet orci. Aenean urna nunc, imperdiet non tincidunt eget, commodo id sem. Mauris tincidunt adipiscing metus, eget euismod neque semper quis. Donec ornare nulla vitae elit mollis a rutrum ipsum elementum. In at rhoncus erat. Sed bibendum aliquet justo quis aliquam. Aliquam vehicula, enim sed suscipit lobortis, est nunc elementum elit, ut cursus risus dolor egestas augue.",
    picture: "generic.jpg"
  }, {
    name: "HUGEL",
    year: "2010",
    type: "Black",
    country: "China",
    region: "Yunnan Province",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sagittis lacinia ultrices. Nam tempus enim a nibh iaculis a ultricies dolor pharetra. Duis ultricies auctor justo sit amet dignissim. Aliquam semper lacus in diam pretium id iaculis nisl facilisis. Donec sed mi in risus fringilla pulvinar. Ut adipiscing sagittis est, consectetur imperdiet massa eleifend ut. Praesent ac imperdiet enim. Quisque luctus massa non nibh elementum convallis. Quisque vitae augue nec libero blandit vehicula. Vestibulum luctus ante eu purus scelerisque tempor. Mauris euismod metus eu diam pellentesque molestie. Aliquam erat volutpat. Sed non libero ligula. Sed sapien metus, blandit nec vestibulum at, consectetur et est. Sed lacinia justo nulla. Etiam sem mi, malesuada vitae gravida in, adipiscing at urna. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam sodales, mi a congue convallis, sapien orci feugiat quam, nec rutrum nunc felis sit amet orci. Aenean urna nunc, imperdiet non tincidunt eget, commodo id sem. Mauris tincidunt adipiscing metus, eget euismod neque semper quis. Donec ornare nulla vitae elit mollis a rutrum ipsum elementum. In at rhoncus erat. Sed bibendum aliquet justo quis aliquam. Aliquam vehicula, enim sed suscipit lobortis, est nunc elementum elit, ut cursus risus dolor egestas augue.",
    picture: "generic.jpg"
  }, {
    name: "FOUR VINES MAVERICK",
    year: "2011",
    type: "Black",
    country: "China",
    region: "Yunnan Province",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sagittis lacinia ultrices. Nam tempus enim a nibh iaculis a ultricies dolor pharetra. Duis ultricies auctor justo sit amet dignissim. Aliquam semper lacus in diam pretium id iaculis nisl facilisis. Donec sed mi in risus fringilla pulvinar. Ut adipiscing sagittis est, consectetur imperdiet massa eleifend ut. Praesent ac imperdiet enim. Quisque luctus massa non nibh elementum convallis. Quisque vitae augue nec libero blandit vehicula. Vestibulum luctus ante eu purus scelerisque tempor. Mauris euismod metus eu diam pellentesque molestie. Aliquam erat volutpat. Sed non libero ligula. Sed sapien metus, blandit nec vestibulum at, consectetur et est. Sed lacinia justo nulla. Etiam sem mi, malesuada vitae gravida in, adipiscing at urna. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam sodales, mi a congue convallis, sapien orci feugiat quam, nec rutrum nunc felis sit amet orci. Aenean urna nunc, imperdiet non tincidunt eget, commodo id sem. Mauris tincidunt adipiscing metus, eget euismod neque semper quis. Donec ornare nulla vitae elit mollis a rutrum ipsum elementum. In at rhoncus erat. Sed bibendum aliquet justo quis aliquam. Aliquam vehicula, enim sed suscipit lobortis, est nunc elementum elit, ut cursus risus dolor egestas augue.",
    picture: "generic.jpg"
  }, {
    name: "QUIVIRA DRY CREEK VALLEY",
    year: "2009",
    type: "Black",
    country: "China",
    region: "Yunnan Province",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sagittis lacinia ultrices. Nam tempus enim a nibh iaculis a ultricies dolor pharetra. Duis ultricies auctor justo sit amet dignissim. Aliquam semper lacus in diam pretium id iaculis nisl facilisis. Donec sed mi in risus fringilla pulvinar. Ut adipiscing sagittis est, consectetur imperdiet massa eleifend ut. Praesent ac imperdiet enim. Quisque luctus massa non nibh elementum convallis. Quisque vitae augue nec libero blandit vehicula. Vestibulum luctus ante eu purus scelerisque tempor. Mauris euismod metus eu diam pellentesque molestie. Aliquam erat volutpat. Sed non libero ligula. Sed sapien metus, blandit nec vestibulum at, consectetur et est. Sed lacinia justo nulla. Etiam sem mi, malesuada vitae gravida in, adipiscing at urna. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam sodales, mi a congue convallis, sapien orci feugiat quam, nec rutrum nunc felis sit amet orci. Aenean urna nunc, imperdiet non tincidunt eget, commodo id sem. Mauris tincidunt adipiscing metus, eget euismod neque semper quis. Donec ornare nulla vitae elit mollis a rutrum ipsum elementum. In at rhoncus erat. Sed bibendum aliquet justo quis aliquam. Aliquam vehicula, enim sed suscipit lobortis, est nunc elementum elit, ut cursus risus dolor egestas augue.",
    picture: "generic.jpg"
  }, {
    name: "CALERA 35TH ANNIVERSARY",
    year: "2010",
    type: "Black",
    country: "China",
    region: "Yunnan Province",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sagittis lacinia ultrices. Nam tempus enim a nibh iaculis a ultricies dolor pharetra. Duis ultricies auctor justo sit amet dignissim. Aliquam semper lacus in diam pretium id iaculis nisl facilisis. Donec sed mi in risus fringilla pulvinar. Ut adipiscing sagittis est, consectetur imperdiet massa eleifend ut. Praesent ac imperdiet enim. Quisque luctus massa non nibh elementum convallis. Quisque vitae augue nec libero blandit vehicula. Vestibulum luctus ante eu purus scelerisque tempor. Mauris euismod metus eu diam pellentesque molestie. Aliquam erat volutpat. Sed non libero ligula. Sed sapien metus, blandit nec vestibulum at, consectetur et est. Sed lacinia justo nulla. Etiam sem mi, malesuada vitae gravida in, adipiscing at urna. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam sodales, mi a congue convallis, sapien orci feugiat quam, nec rutrum nunc felis sit amet orci. Aenean urna nunc, imperdiet non tincidunt eget, commodo id sem. Mauris tincidunt adipiscing metus, eget euismod neque semper quis. Donec ornare nulla vitae elit mollis a rutrum ipsum elementum. In at rhoncus erat. Sed bibendum aliquet justo quis aliquam. Aliquam vehicula, enim sed suscipit lobortis, est nunc elementum elit, ut cursus risus dolor egestas augue.",
    picture: "generic.jpg"
  }, {
    name: "CHATEAU CARONNE STE GEMME",
    year: "2010",
    type: "Black",
    country: "China",
    region: "Yunnan Province",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sagittis lacinia ultrices. Nam tempus enim a nibh iaculis a ultricies dolor pharetra. Duis ultricies auctor justo sit amet dignissim. Aliquam semper lacus in diam pretium id iaculis nisl facilisis. Donec sed mi in risus fringilla pulvinar. Ut adipiscing sagittis est, consectetur imperdiet massa eleifend ut. Praesent ac imperdiet enim. Quisque luctus massa non nibh elementum convallis. Quisque vitae augue nec libero blandit vehicula. Vestibulum luctus ante eu purus scelerisque tempor. Mauris euismod metus eu diam pellentesque molestie. Aliquam erat volutpat. Sed non libero ligula. Sed sapien metus, blandit nec vestibulum at, consectetur et est. Sed lacinia justo nulla. Etiam sem mi, malesuada vitae gravida in, adipiscing at urna. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam sodales, mi a congue convallis, sapien orci feugiat quam, nec rutrum nunc felis sit amet orci. Aenean urna nunc, imperdiet non tincidunt eget, commodo id sem. Mauris tincidunt adipiscing metus, eget euismod neque semper quis. Donec ornare nulla vitae elit mollis a rutrum ipsum elementum. In at rhoncus erat. Sed bibendum aliquet justo quis aliquam. Aliquam vehicula, enim sed suscipit lobortis, est nunc elementum elit, ut cursus risus dolor egestas augue.",
    picture: "generic.jpg"
  }, {
    name: "MOMO MARLBOROUGH",
    year: "2010",
    type: "Black",
    country: "China",
    region: "Yunnan Province",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sagittis lacinia ultrices. Nam tempus enim a nibh iaculis a ultricies dolor pharetra. Duis ultricies auctor justo sit amet dignissim. Aliquam semper lacus in diam pretium id iaculis nisl facilisis. Donec sed mi in risus fringilla pulvinar. Ut adipiscing sagittis est, consectetur imperdiet massa eleifend ut. Praesent ac imperdiet enim. Quisque luctus massa non nibh elementum convallis. Quisque vitae augue nec libero blandit vehicula. Vestibulum luctus ante eu purus scelerisque tempor. Mauris euismod metus eu diam pellentesque molestie. Aliquam erat volutpat. Sed non libero ligula. Sed sapien metus, blandit nec vestibulum at, consectetur et est. Sed lacinia justo nulla. Etiam sem mi, malesuada vitae gravida in, adipiscing at urna. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam sodales, mi a congue convallis, sapien orci feugiat quam, nec rutrum nunc felis sit amet orci. Aenean urna nunc, imperdiet non tincidunt eget, commodo id sem. Mauris tincidunt adipiscing metus, eget euismod neque semper quis. Donec ornare nulla vitae elit mollis a rutrum ipsum elementum. In at rhoncus erat. Sed bibendum aliquet justo quis aliquam. Aliquam vehicula, enim sed suscipit lobortis, est nunc elementum elit, ut cursus risus dolor egestas augue.",
    picture: "generic.jpg"
  }, {
    name: "SENCHA",
    year: "2009",
    type: "Green",
    country: "Japan",
    region: "Unknown",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sagittis lacinia ultrices. Nam tempus enim a nibh iaculis a ultricies dolor pharetra. Duis ultricies auctor justo sit amet dignissim. Aliquam semper lacus in diam pretium id iaculis nisl facilisis. Donec sed mi in risus fringilla pulvinar. Ut adipiscing sagittis est, consectetur imperdiet massa eleifend ut. Praesent ac imperdiet enim. Quisque luctus massa non nibh elementum convallis. Quisque vitae augue nec libero blandit vehicula. Vestibulum luctus ante eu purus scelerisque tempor. Mauris euismod metus eu diam pellentesque molestie. Aliquam erat volutpat. Sed non libero ligula. Sed sapien metus, blandit nec vestibulum at, consectetur et est. Sed lacinia justo nulla. Etiam sem mi, malesuada vitae gravida in, adipiscing at urna. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam sodales, mi a congue convallis, sapien orci feugiat quam, nec rutrum nunc felis sit amet orci. Aenean urna nunc, imperdiet non tincidunt eget, commodo id sem. Mauris tincidunt adipiscing metus, eget euismod neque semper quis. Donec ornare nulla vitae elit mollis a rutrum ipsum elementum. In at rhoncus erat. Sed bibendum aliquet justo quis aliquam. Aliquam vehicula, enim sed suscipit lobortis, est nunc elementum elit, ut cursus risus dolor egestas augue.",
    picture: "generic.jpg"
  }];

  db.collection('teas', function(err, collection) {
    collection.insert(teas, {
      safe: true
    }, function(err, result) {});
  });
};
