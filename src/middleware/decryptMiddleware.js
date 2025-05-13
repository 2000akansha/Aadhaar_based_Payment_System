// import crypto from 'crypto';
// import fs from 'fs';
// import dotenv from 'dotenv';

// dotenv.config();

// // Read the private RSA key from the file system
// const privateKeyPem = fs.readFileSync('./keys/private_key.pem', 'utf8');
// const privateKey = crypto.createPrivateKey(privateKeyPem);

// // Middleware to decrypt encrypted data
// export function decryptData(req, res, next) {
//     try {
//         // Loop through all keys in the request body
//         for (const key in req.body) {
//             if (req.body.hasOwnProperty(key)) {
//                 const encryptedValue = req.body[key];
//                 console.log("Encrypted value for key ", key, encryptedValue);

//                 // Check if the value is a base64 encoded string (for RSA)
//                 if (typeof encryptedValue === 'string' && /^[A-Za-z0-9+/=]+$/.test(encryptedValue)) {
//                     try {
//                         // Ensure proper base64 padding
//                         const correctedBase64 = encryptedValue.padEnd(encryptedValue.length + (4 - encryptedValue.length % 4) % 4, '=');

//                         // Step 1: Decrypt using RSA with the private key
//                         const decryptedData = rsaDecrypt(correctedBase64, privateKey);

//                         // console.log(`Decrypted Value for ${key}:`, decryptedData);

//                         // Replace the encrypted field with its decrypted value
//                         req.body[key] = decryptedData;
//                     } catch (decryptionError) {
//                         console.error(`Error decrypting ${key}:`, decryptionError);
//                         return res.status(400).json({ error: `Failed to decrypt ${key}` });
//                     }
//                 }
//             }
//         }

//         // Log the entire request body after decryption for debugging
//         // console.log('Decrypted req.body:', req.body);

//         // Proceed to the next middleware
//         next();
//     } catch (error) {
//         console.error('Error during decryption:', error);
//         res.status(500).json({ error: 'Failed to decrypt data' });
//     }
// }

// // RSA Decryption function using private key (RSA-OAEP)
// function rsaDecrypt(encryptedData, privateKey) {
//     try {
//         // Convert the base64 string into a Buffer
//         const encryptedBuffer = Buffer.from(encryptedData, 'base64');

//         // Decrypt using RSA private key and RSA-OAEP padding
//         const decryptedBuffer = crypto.privateDecrypt(
//             {
//                 key: privateKey,
//                 padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
//                 oaepHash: 'sha256',
//             },
//             encryptedBuffer
//         );

//         // Convert the decrypted buffer to a UTF-8 string
//         return decryptedBuffer.toString('utf8');
//     } catch (error) {
//         console.error('Error during RSA decryption:', error);
//         throw new Error('RSA decryption failed');
//     }
// }
