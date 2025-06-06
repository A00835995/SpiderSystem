//función para hashear un texto

const bcrypt = require('bcryptjs');

const aa = 'Santos_2008';

bcrypt.hash(aa, 10, (err, hash) => {
  if (err) {
    console.error("Error generando hash:", err);
  } else {
    console.log("Hash generado:", hash);
  }
});