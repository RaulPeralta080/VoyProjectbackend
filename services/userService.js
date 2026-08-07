const User = require('../models/User');

const POPULATE_FOLLOW_FIELDS = 'nombre username avatar avatarUrl fotoPerfil avatarColor role rol lema bio';

const findUserByIdWithSocial = async (userId) => {
  return await User.findById(userId)
    .populate('seguidores', POPULATE_FOLLOW_FIELDS)
    .populate('siguiendo', POPULATE_FOLLOW_FIELDS);
};

const findRegisteredArtists = async () => {
  return await User.find({
    $or: [
      { rol: 'artista' },
      { role: 'artist' },
      { rol: 'artist' }
    ]
  }).select('nombre username avatar avatarUrl fotoPerfil lema bio _id');
};

const findUserByUsernameOrId = async (identifier) => {
  let user = await User.findOne({ username: identifier.toLowerCase() })
    .populate('seguidores', POPULATE_FOLLOW_FIELDS)
    .populate('siguiendo', POPULATE_FOLLOW_FIELDS);

  if (!user && identifier.match(/^[0-9a-fA-F]{24}$/)) {
    user = await User.findById(identifier)
      .populate('seguidores', POPULATE_FOLLOW_FIELDS)
      .populate('siguiendo', POPULATE_FOLLOW_FIELDS);
  }

  return user;
};

module.exports = {
  findUserByIdWithSocial,
  findRegisteredArtists,
  findUserByUsernameOrId
};
