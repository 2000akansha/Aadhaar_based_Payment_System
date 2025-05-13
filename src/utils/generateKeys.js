// import forge from 'node-forge';
// import fs from 'fs';
// // import  pki from 'node-forge';

// function generateRSAKeyPair() {
//     // Generate RSA key pair (private + public)
//     const { publicKey, privateKey } = forge.pki.rsa.generateKeyPair(2048); /**generate keys with 2048 bit size  */

//     // Convert to PEM format (for storage and transmission)
//     const publicKeyPem = forge.pki.publicKeyToPem(publicKey);
//     const privateKeyPem = forge.pki.privateKeyToPem(privateKey);

//     // Save the private key and public key to files (e.g., in a 'keys' folder)
//     const keysFolder = './keys';
//     if (!fs.existsSync(keysFolder)) {
//       fs.mkdirSync(keysFolder, { recursive: true });
//     }

//     fs.writeFileSync(`${keysFolder}/private_key.pem`, privateKeyPem);
//     fs.writeFileSync(`${keysFolder}/public_key.pem`, publicKeyPem);

//     console.log('RSA Key Pair Generated!');
//     console.log('Public Key:', publicKeyPem);
//     console.log('Private Key:', privateKeyPem);
//   }

//   export  default generateRSAKeyPair;
