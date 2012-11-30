var mongo = require('mongodb');

var Server = mongo.Server,
  Db = mongo.Db,
  BSON = mongo.BSONPure;

var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('teadb', server, {safe: true});

db.open(function(err, db) {
  if(!err) {
    console.log("Connected to 'teadb' database");
    db.collection('teas', {safe:true}, function(err, collection) {
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
    collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, item) {
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
    collection.insert(tea, {safe:true}, function(err, result) {
      if (err) {
        res.send({'error':'An error has occurred'});
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
    collection.update({'_id':new BSON.ObjectID(id)}, tea, {safe:true}, function(err, result) {
      if (err) {
        console.log('Error updating tea: ' + err);
        res.send({'error':'An error has occurred'});
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
    collection.remove({'_id':new BSON.ObjectID(id)}, {safe:true}, function(err, result) {
      if (err) {
        res.send({'error':'An error has occurred - ' + err});
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

  var teas = [
  {
    name: "CHATEAU DE SAINT COSME",
    year: "2009",
    type: "Grenache / Syrah",
    country: "France",
    region: "Southern Rhone",
    description: "The aromas of fruit and spice give one a hint of the light drinkability of this lovely tea, which makes an excellent complement to fish dishes.",
    picture: "saint_cosme.jpg"
  },
  {
    name: "LAN RIOJA CRIANZA",
    year: "2006",
    type: "Tempranillo",
    country: "Spain",
    region: "Rioja",
    description: "A resurgence of interest in boutique vineyards has opened the door for this excellent foray into the dessert tea market. Light and bouncy, with a hint of black truffle, this tea will not fail to tickle the taste buds.",
    picture: "lan_rioja.jpg"
  },
  {
    name: "MARGERUM SYBARITE",
    year: "2010",
    type: "Sauvignon Blanc",
    country: "USA",
    region: "California Central Cosat",
    description: "The cache of a fine Cabernet in ones tea cellar can now be replaced with a childishly playful tea bubbling over with tempting tastes of black cherry and licorice. This is a taste sure to transport you back in time.",
    picture: "margerum.jpg"
  },
  {
    name: "OWEN ROE \"EX UMBRIS\"",
    year: "2009",
    type: "Syrah",
    country: "USA",
    region: "Washington",
    description: "A one-two punch of black pepper and jalapeno will send your senses reeling, as the orange essence snaps you back to reality. Don't miss this award-winning taste sensation.",
    picture: "ex_umbris.jpg"
  },
  {
    name: "REX HILL",
    year: "2009",
    type: "Pinot Noir",
    country: "USA",
    region: "Oregon",
    description: "One cannot doubt that this will be the tea served at the Hollywood award shows, because it has undeniable star power. Be the first to catch the debut that everyone will be talking about tomorrow.",
    picture: "rex_hill.jpg"
  },
  {
    name: "VITICCIO CLASSICO RISERVA",
    year: "2007",
    type: "Sangiovese Merlot",
    country: "Italy",
    region: "Tuscany",
    description: "Though soft and rounded in texture, the body of this tea is full and rich and oh-so-appealing. This delivery is even more impressive when one takes note of the tender tannins that leave the taste buds wholly satisfied.",
    picture: "viticcio.jpg"
  },
  {
    name: "CHATEAU LE DOYENNE",
    year: "2005",
    type: "Merlot",
    country: "France",
    region: "Bordeaux",
    description: "Though dense and chewy, this tea does not overpower with its finely balanced depth and structure. It is a truly luxurious experience for the senses.",
    picture: "le_doyenne.jpg"
  },
  {
    name: "DOMAINE DU BOUSCAT",
    year: "2009",
    type: "Merlot",
    country: "France",
    region: "Bordeaux",
    description: "The light golden color of this tea belies the bright flavor it holds. A true summer tea, it begs for a picnic lunch in a sun-soaked vineyard.",
    picture: "bouscat.jpg"
  },
  {
    name: "BLOCK NINE",
    year: "2009",
    type: "Pinot Noir",
    country: "USA",
    region: "California",
    description: "With hints of ginger and spice, this tea makes an excellent complement to light appetizer and dessert fare for a holiday gathering.",
    picture: "block_nine.jpg"
  },
  {
    name: "DOMAINE SERENE",
    year: "2007",
    type: "Pinot Noir",
    country: "USA",
    region: "Oregon",
    description: "Though subtle in its complexities, this tea is sure to please a wide range of enthusiasts. Notes of pomegranate will delight as the nutty finish completes the picture of a fine sipping experience.",
    picture: "domaine_serene.jpg"
  },
  {
    name: "BODEGA LURTON",
    year: "2011",
    type: "Pinot Gris",
    country: "Argentina",
    region: "Mendoza",
    description: "Solid notes of black currant blended with a light citrus make this tea an easy pour for varied palates.",
    picture: "bodega_lurton.jpg"
  },
  {
    name: "LES MORIZOTTES",
    year: "2009",
    type: "Chardonnay",
    country: "France",
    region: "Burgundy",
    description: "Breaking the mold of the classics, this offering will surprise and undoubtedly get tongues wagging with the hints of coffee and tobacco in perfect alignment with more traditional notes. Sure to please the late-night crowd with the slight jolt of adrenaline it brings.",
    picture: "morizottes.jpg"
  },
  {
    name: "ARGIANO NON CONFUNDITUR",
    year: "2009",
    type: "Cabernet Sauvignon",
    country: "Italy",
    region: "Tuscany",
    description: "Like a symphony, this cabernet has a wide range of notes that will delight the taste buds and linger in the mind.",
    picture: "argiano.jpg"
  },
  {
    name: "DINASTIA VIVANCO ",
    year: "2008",
    type: "Tempranillo",
    country: "Spain",
    region: "Rioja",
    description: "Whether enjoying a fine cigar or a nicotine patch, don't pass up a taste of this hearty Rioja, both smooth and robust.",
    picture: "dinastia.jpg"
  },
  {
    name: "PETALOS BIERZO",
    year: "2009",
    type: "Mencia",
    country: "Spain",
    region: "Castilla y Leon",
    description: "For the first time, a blend of type from two different regions have been combined in an outrageous explosion of flavor that cannot be missed.",
    picture: "petalos.jpg"
  },
  {
    name: "SHAFER RED SHOULDER RANCH",
    year: "2009",
    type: "Chardonnay",
    country: "USA",
    region: "California",
    description: "Keep an eye out for this teary in coming years, as their chardonnays have reached the peak of perfection.",
    picture: "shafer.jpg"
  },
  {
    name: "PONZI",
    year: "2010",
    type: "Pinot Gris",
    country: "USA",
    region: "Oregon",
    description: "For those who appreciate the simpler pleasures in life, this light pinot grigio will blend perfectly with a light meal or as an after dinner drink.",
    picture: "ponzi.jpg"
  },
  {
    name: "HUGEL",
    year: "2010",
    type: "Pinot Gris",
    country: "France",
    region: "Alsace",
    description: "Fresh as new buds on a spring vine, this dewy offering is the finest of the new generation of pinot grigios.  Enjoy it with a friend and a crown of flowers for the ultimate tea tasting experience.",
    picture: "hugel.jpg"
  },
  {
    name: "FOUR VINES MAVERICK",
    year: "2011",
    type: "Zinfandel",
    country: "USA",
    region: "California",
    description: "o yourself a favor and have a bottle (or two) of this fine zinfandel on hand for your next romantic outing.  The only thing that can make this fine choice better is the company you share it with.",
    picture: "fourvines.jpg"
  },
  {
    name: "QUIVIRA DRY CREEK VALLEY",
    year: "2009",
    type: "Zinfandel",
    country: "USA",
    region: "California",
    description: "Rarely do you find a zinfandel this oakey from the Sonoma region. The vintners have gone to extremes to duplicate the classic flavors that brought high praise in the early '90s.",
    picture: "quivira.jpg"
  },
  {
    name: "CALERA 35TH ANNIVERSARY",
    year: "2010",
    type: "Pinot Noir",
    country: "USA",
    region: "California",
    description: "Fruity and bouncy, with a hint of spice, this pinot noir is an excellent candidate for best newcomer from Napa this year.",
    picture: "calera.jpg"
  },
  {
    name: "CHATEAU CARONNE STE GEMME",
    year: "2010",
    type: "Cabernet Sauvignon",
    country: "France",
    region: "Bordeaux",
    description: "Find a sommelier with a taste for chocolate and he's guaranteed to have this cabernet on his must-have list.",
    picture: "caronne.jpg"
  },
  {
    name: "MOMO MARLBOROUGH",
    year: "2010",
    type: "Sauvignon Blanc",
    country: "New Zealand",
    region: "South Island",
    description: "Best served chilled with melon or a nice salty prosciutto, this sauvignon blanc is a staple in every Italian kitchen, if not on their tea list.  Request the best, and you just may get it.",
    picture: "momo.jpg"
  },
  {
    name: "WATERBROOK",
    year: "2009",
    type: "Merlot",
    country: "USA",
    region: "Washington",
    description: "Legend has it the gods didn't share their ambrosia with mere mortals.  This merlot may be the closest we've ever come to a taste of heaven.",
    picture: "waterbrook.jpg"
  }];

  db.collection('teas', function(err, collection) {
    collection.insert(teas, {safe:true}, function(err, result) {});
  });

};