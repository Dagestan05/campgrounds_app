var mongoose = require('mongoose');
var Campground = require("./models/campground");
var Comment = require("./models/comment");


var data = [
  {
    name: "Atlan",
    image: "https://images.pexels.com/photos/730426/pexels-photo-730426.jpeg?auto=compress&cs=tinysrgb&h=350",
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce rhoncus, urna sed blandit ornare, dolor libero tincidunt risus, id maximus leo metus sit amet massa. Proin viverra efficitur risus at congue. Aliquam rutrum pretium malesuada. Cras laoreet ultrices nulla, ut commodo massa venenatis mollis. Cras vitae risus efficitur, fringilla enim ac, volutpat turpis. Suspendisse eget rhoncus lacus. Aenean porta porttitor turpis, viverra auctor ipsum elementum ut. Nulla at arcu ut ipsum accumsan pharetra a id risus. Maecenas a luctus quam. Nam eu volutpat ipsum. Suspendisse eget viverra elit, ac ornare neque. Donec sollicitudin pretium urna, nec gravida velit maximus quis. Interdum et malesuada fames ac ante ipsum primis in faucibus. Aliquam efficitur leo enim.'
  },
  {
    name: "Goryanka",
    image: "https://images.pexels.com/photos/45241/tent-camp-night-star-45241.jpeg?auto=compress&cs=tinysrgb&h=350",
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce rhoncus, urna sed blandit ornare, dolor libero tincidunt risus, id maximus leo metus sit amet massa. Proin viverra efficitur risus at congue. Aliquam rutrum pretium malesuada. Cras laoreet ultrices nulla, ut commodo massa venenatis mollis. Cras vitae risus efficitur, fringilla enim ac, volutpat turpis. Suspendisse eget rhoncus lacus. Aenean porta porttitor turpis, viverra auctor ipsum elementum ut. Nulla at arcu ut ipsum accumsan pharetra a id risus. Maecenas a luctus quam. Nam eu volutpat ipsum. Suspendisse eget viverra elit, ac ornare neque. Donec sollicitudin pretium urna, nec gravida velit maximus quis. Interdum et malesuada fames ac ante ipsum primis in faucibus. Aliquam efficitur leo enim. '
  },
  {
    name: " Tamparana",
    image: "https://images.pexels.com/photos/699558/pexels-photo-699558.jpeg?auto=compress&cs=tinysrgb&h=350",
    description: 'Not a very crowded place to start wwith kaslsjflkahfkjh asfhlkahflj afhkahfkajhf asjfhlkajhflashf. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce rhoncus, urna sed blandit ornare, dolor libero tincidunt risus, id maximus leo metus sit amet massa. Proin viverra efficitur risus at congue. Aliquam rutrum pretium malesuada. Cras laoreet ultrices nulla, ut commodo massa venenatis mollis. Cras vitae risus efficitur, fringilla enim ac, volutpat turpis. Suspendisse eget rhoncus lacus. Aenean porta porttitor turpis, viverra auctor ipsum elementum ut. Nulla at arcu ut ipsum accumsan pharetra a id risus. Maecenas a luctus quam. Nam eu volutpat ipsum. Suspendisse eget viverra elit, ac ornare neque. Donec sollicitudin pretium urna, nec gravida velit maximus quis. Interdum et malesuada fames ac ante ipsum primis in faucibus. Aliquam efficitur leo enim.'
  },
]

function seedDB() {
  // Remove all campgrounds
  Campground.remove({}, function(err) {
    if (err) {
      console.log(err)
    } else {
      console.log("Removed all campgrounds");
      // add a few campgrounds
      data.forEach(function(seed){
      Campground.create(seed, function(err, campground) {
        if (err) {
          console.log(err)
        } else {
          console.log('Added a campground');
          // create a comment
          Comment.create({
            text: "A greta place, but no toilet or shower",
            author: "Arlovski"
          }, function(err, comment) {
            if (err) {
              console.log(err);
            } else {
              campground.comments.push(comment);
              campground.save();
              console.log("created new comment");
            }
          })
      }
    })
  })
    }
  });
  
  // add a few comments
};

module.exports = seedDB;
