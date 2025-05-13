// import fs from 'fs';
// import path from 'path';
// import { publicEncrypt, constants } from 'crypto';

// // Get the current file path for `__dirname` in ES modules
// import { fileURLToPath } from 'url';
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // Load the RSA public key from the filesystem
// const publicKeyPath = path.join(__dirname, '../../keys/public_key.pem');
// let publicKey;

// try {
//     publicKey = fs.readFileSync(publicKeyPath, 'utf8');
// } catch (error) {
//     console.error('Error loading public key:', error);
//     process.exit(1); // Terminate if the key is not available
// }

// // Middleware to encrypt the data before sending it to the client
// export function encryptData(req, res, next) {
//     try {
//         if (req.body.dataToEncrypt) {
//             // Check if the dataToEncrypt exists in the request body
//             const data = req.body.dataToEncrypt;
//             console.log(data);

//             // Ensure that the data is a string (optional based on your needs)
//             if (typeof data !== 'string') {
//                 return res.status(400).json({ error: 'Data to encrypt must be a string' });
//             }

//             // Encrypt the data using the public key
//             const encrypted = publicEncrypt(
//                 {
//                     key: publicKey,
//                     padding: constants.RSA_PKCS1_OAEP_PADDING,
//                 },
//                 Buffer.from(data, 'utf8')  // Encrypt the string data
//             );
//             console.log(encrypted);

//             // Attach the encrypted data to the response object
//             res.encryptedData = encrypted.toString('base64'); // Base64 encode the encrypted data
//         }

//         // Proceed to the next middleware/controller
//         next();
//     } catch (error) {
//         console.error('Error during encryption:', error);
//         res.status(500).json({ error: 'Failed to encrypt data' });
//     }
// }
