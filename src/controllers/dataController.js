const Email = require('../models/emails');
const Contact = require('../models/contacts');
const User = require('../models/Users');

// Controller function to fetch emails and contacts
const fetchEmailsAndContacts = async (req, res) => {
  try {
    console.log("fetch mais and contacts runs on server,hheaders are ",req.headers);
    // Use case-insensitive way to access headers
    const userId = req.headers['user-id'] || req.headers['User-Id']
    console.log(" user id we get in server is ",userId);

    if (!userId) {
      return res.status(400).json({ message: 'User ID is missing' });
    }

    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().slice(0, 10);
    
    // Find the user based on the authenticated user's ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    console.log("1st console user is", user);

    // Check if user has paid money or not , if no return.
    // Placeholder: Add your condition to check if the user has paid.
    // if (!user.hasPaid) {
    //   return res.status(403).json({ message: 'User has not paid' });
    // }

    // Check if user has already fetched data for today
    const existingFetch = await User.findOne({ _id: userId, lastFetchDate: today }); // Updated query to match user

    if (existingFetch) {
      return res.status(429).json({ message: 'Data limit reached for today' }); // Rate limit exceeded
    }

    // Fetch total counts of emails and contacts from the database
    const totalEmails = await Email.countDocuments();
    const totalContacts = await Contact.countDocuments();
    console.log("2nd console total mails ", totalEmails, " and ", totalContacts);

    // Check if the user has reached the limit for emails or contacts
    if (user.emailFetchIndex >= totalEmails || user.contactFetchIndex >= totalContacts) {
      return res.status(429).json({ message: 'No more data available to fetch' });
    }

    // Fetch the next set of emails using the current index
    const emails = await Email.find()
      .skip(user.emailFetchIndex) // Skip the already fetched emails
      .limit(10) // Limit to 10 emails
      .sort({ _id: 1 }); // Sort by ID to maintain order

    // Fetch the next set of contacts using the current index
    const contacts = await Contact.find()
      .skip(user.contactFetchIndex) // Skip the already fetched contacts
      .limit(10) // Limit to 10 contacts
      .sort({ _id: 1 }); // Sort by ID to maintain order

    // Update indices for the next fetch
    user.emailFetchIndex += 10; // Increment the email index by 10
    user.contactFetchIndex += 10; // Increment the contact index by 10
    user.lastFetchDate = today; // Update the last fetch date to today

    // Save the updated user information to the database
    await user.save();

    // Prepare the response data with fetched emails and contacts
    const data = { emails, contacts };

    console.log("3rd console , data sending contacts are ", data);

    // Send the response back to the client
    res.json(data);
  } catch (err) {
    // Log any errors that occur during the fetching process
    console.error('Error fetching data:', err);

    // Respond with a 500 status code and error message
    res.status(500).json({ message: 'Error fetching data' });
  }
};

module.exports = { fetchEmailsAndContacts };
