const { composePlugins, withNx } = require('@nx/webpack');

module.exports = composePlugins(withNx(), (config) => {
  // Configuración personalizada aquí si es necesaria
  return config;
});
