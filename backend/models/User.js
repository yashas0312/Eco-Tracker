const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  name: {
    type: String,
    required: true
  },
  avatarUrl: {
    type: String
  },
  lifetimeStats: {
    totalEmissions: { type: Number, default: 0 },
    totalOffsets: { type: Number, default: 0 },
    ecoPoints: { type: Number, default: 0 },
    treesPlanted: { type: Number, default: 0 },
    entriesLogged: { type: Number, default: 0 }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

UserSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('User', UserSchema);
