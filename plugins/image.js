// Import required dependencies
const { bot } = require('../lib/');
const axios = require('axios');

// Register the bot command
bot({
    pattern: 'image ?(.*)',
    fromMe: true,
    desc: 'Downloads and sends an image based on your query',
    type: 'search',
}, async (message, match) => {

    // 1. Validation: Check if the user provided a search query/image name
    const query = match[1];
    if (!query) {
        return await message.send('*Please provide a name or query for the image! Example: .image cat*');
    }

    // Inform the user that the image is being searched and downloaded
    await message.send(`*Searching for "${query}"... 🔍*`);

    try {
        // 2. Fetching image from an API (Using a reliable public image/wallpaper source)
        // Yahan hum ek public image search API ka use kar rahe hain jo direct image URL degi
        const apiUrl = `https://api.unsplash.com/photos/random?query=${encodeURIComponent(query)}&client_id=YOUR_UNSPLASH_ACCESS_KEY`; 
        
        // Alternativly, agar aapko bina API Key ke simple web scraping ya koi aur API use karni hai:
        // Jaise koi random image generator ya free meme/image endpoint:
        const searchUrl = `https://nekos.best/api/v2/search?query=${encodeURIComponent(query)}&type=1`;
        
        const response = await axios.get(`https://deliriussapi-oficial.vercel.app/search/pinterest?query=${encodeURIComponent(query)}`);

        // Check if the API returned results (Pinterest scraper example, bohot popular hai WhatsApp bots me)
        if (response.data && response.data.status && response.data.result && response.data.result.length > 0) {
            // Randomly pick one image from the search results
            const images = response.data.result;
            const randomImage = images[Math.floor(Math.random() * images.length)];
            const imageUrl = randomImage; // direct image url

            // 3. Send the image to the chat using message.send with image url or media options
            await message.send(imageUrl, { 
                caption: `*Image found for:* ${query} 🖼️`,
                quoted: message 
            });

        } else {
            await message.send(`*Sorry, no images found for "${query}". Please try another name.*`);
        }

    } catch (error) {
        console.error("Image Download Error:", error);
        await message.send(`*Error occurred while fetching the image:* ${error.message}`);
    }
});
