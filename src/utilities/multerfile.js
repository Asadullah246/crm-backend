// import multer from "multer" ;

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, 'src/uploads/');
//     },
//     filename: function (req, file, cb) {
//       const originalName = file.originalname;
//       const fileExtension = originalName.split('.').pop(); // Get the file extension
//       const fileName = originalName.split('.').shift(); // Get the file name
//       const randomString = Math.random().toString(36).substring(7); // Generate a random string
//       const currentDate = new Date().toISOString().split('T')[0];

//       // Create a unique filename using the original name, current date, and a random string
//       const uniqueFileName = `${fileName}-${currentDate}-${randomString}.${fileExtension}`;

//       cb(null, uniqueFileName);
//     },
//   });

//   const upload = multer({ storage: storage });

//   export default upload; 
