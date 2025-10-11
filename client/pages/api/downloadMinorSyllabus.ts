import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';

// Download the minor syllabus PDF
const downloadMinorSyllabus = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    // Fetch the file from the external endpoint
    console.log(req.query.id);
    const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/minors/minor/${req.query.id}/download`, {
      responseType: 'arraybuffer', // Ensures we receive the file as binary data
    });

    const contentDisposition = response.headers['content-disposition'];
    let filename = 'downloaded_file.pdf'; // Default filename

    // Extract filename from Content-Disposition header if available
    if (contentDisposition && contentDisposition.includes('filename=')) {
      const match = contentDisposition.match(/filename="?(.+)"?/);
      if (match && match[1]) {
        filename = match[1];
      }
    }

    // Set headers for file download
    res.setHeader('Content-Type', 'application/pdf'); // PDF MIME type
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`); // Filename for download

    // Send the binary data directly in the response
    res.status(200).send(Buffer.from(response.data, 'binary')); // Ensure it's sent as binary data

  } catch (error) {
    console.error('Error downloading PDF:', error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default downloadMinorSyllabus;
