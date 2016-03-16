/**
 * Created by alexfaber on 3/11/16.
 */

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    // we're connected!
});