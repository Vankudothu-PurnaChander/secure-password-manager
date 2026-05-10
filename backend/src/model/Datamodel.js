const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
  userId:{
    type:String,
    required:true
  },
  masterHash: {
    type: String
  },
  accountemail: {
    type: String,
    required: false,sparse:true
  },
  website: {
    type: String,
    required: false,sparse:true
  },
  username: {
    type: String,
    required: false,sparse:true
  },
  password: {
    type: String,
    required: false,sparse:true
  },
  iv: {
    type: String
  },
  salt: {
    type: String
  }
}, { timestamps: true });

// Unique constraint should apply only to real password entries (not masterHash-only docs)
// Require both accountemail and website to exist.
dataSchema.index(
  { userId: 1, accountemail: 1, website: 1 },
  {
    unique: true,
    partialFilterExpression: {
      accountemail: { $exists: true, $ne: null },
      website: { $exists: true, $ne: null }
    }
  }
);
const Datamodel = mongoose.model('Datamodel', dataSchema);

module.exports = Datamodel;
