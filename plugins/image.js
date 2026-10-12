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
        return await message.send('*Please provide a name or query for the image! Example: .image anime wallpaper*');
    }

    // Inform the user that the image is being searched and downloaded
    await message.send(`*Searching for "${query}"... 🔍*`);

    try {
        // 2. Fetching image from the new Sayan Nexuswork Pinterest API
        const apiUrl = `https://api.sayan-nexuswork.workers.dev/pinterest?q=${encodeURIComponent(query)}&type=image&limit=5`;
        
        const response = await axios.get(apiUrl);

        // Check if the API returned results successfully
        if (response.data && response.data.status && response.data.data && response.data.data.length > 0) {
            // Randomly pick one image from the search results array
            const images = response.data.data;
            const randomImage = images[Math.floor(Math.random() * images.length)];
            
            // Assuming the API returns image links directly inside the array or as objects
            const imageUrl = typeof randomImage === 'string' ? randomImage : (randomImage.image || randomImage.url || randomImage);

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
