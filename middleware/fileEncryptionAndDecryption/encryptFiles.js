const fs = require("fs");
const path = require("path");
const zlib = require("zlib");
const crypto = require("crypto");

const getCipherKey = require("./getCipherKey");
const AppendInitVict = require("./appendInitVect");

// encrypt file function 
const encryptFile = ({filePhoto, fileCV, password}, cb) => {
    
    // encrypt photo
    // step 1) : generate a random initialization vector
    const initVictPhoto = crypto.randomBytes(16);

    // step 2) : generate a cipher 
    const cipherKeyPhoto = getCipherKey(password);

    // step 3) : read from the file that wen want to encrypt
    const readStreamPhoto = fs.createReadStream(filePhoto);

    // step 4) : initialize the zlib, the one that compresses the file before encryption
    const gZipPhoto = zlib.createGzip();

    // step 5) : create the cipher for the file
    const cipherPhoto = crypto.createCipheriv("aes256", cipherKeyPhoto, initVictPhoto);

    // step 6) : append the initialzation vector
    const appendInitVectPhoto = new AppendInitVict(initVictPhoto);

    // step 7) : create a write stream
    const writeStreamPhoto = fs.createWriteStream(path.join(filePhoto + ".enc"))

    // last step put all these methods together to the encrypted file
    readStreamPhoto
        .pipe(gZipPhoto)
        .pipe(cipherPhoto)
        .pipe(appendInitVectPhoto)
        .pipe(writeStreamPhoto);
    
    
    // encrypt cv
    // step 1) : generate a random initialization vector
    const initVictCV = crypto.randomBytes(16);

    // step 2) : generate a cipher 
    const cipherKeyCV = getCipherKey(password);

    // step 3) : read from the file that wen want to encrypt
    const readStreamCV = fs.createReadStream(fileCV);

    // step 4) : initialize the zlib, the one that compresses the file before encryption
    const gZipCV = zlib.createGzip();

    // step 5) : create the cipher for the file
    const cipherCV = crypto.createCipheriv("aes256", cipherKeyCV, initVictCV);

    // step 6) : append the initialzation vector
    const appendInitVectCV = new AppendInitVict(initVictCV);

    // step 7) : create a write stream
    const writeStreamCV = fs.createWriteStream(path.join(fileCV + ".enc"))

    // last step put all these methods together to the encrypted file
    readStreamCV
        .pipe(gZipCV)
        .pipe(cipherCV)
        .pipe(appendInitVectCV)
        .pipe(writeStreamCV);
    
    fs.unlink(filePhoto, (err) => {
        if (err) throw err;
    });
    
    fs.unlink(fileCV, (err) => {
        if (err) throw err;
    });
}

module.exports = encryptFile;