/**************************************************************************
*   
*   Proyect: NodeJS-Cloudflare-DNS-Update
*   License: See LICENSE in the top level directory
*   Author: iroaK (@bastianmarin)
*   File: index.js
*   
**************************************************************************/

// Librery imports
const axios = require('axios');

// Vars of the script
let currentRegistryIP = '0.0.0.0';

// Get the DNS record
async function getDNSRecord() {
    try {
        const dnsResponse = await axios.get(
            `https://api.cloudflare.com/client/v4/zones/${process.env.ZONE_ID}/dns_records/${process.env.RECORD_ID}`,
            {
                headers: {
                    Authorization: `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,
                    'Content-Type': 'application/json',
                },
            }
        );
        if (dnsResponse.data.success) {
            console.log('Registry DNS:', dnsResponse.data.result.name, '->', dnsResponse.data.result.content);
            currentRegistryIP = dnsResponse.data.result.content;
        } else {
            console.error('Error in DNS check:', dnsResponse.data.errors);
        }
    } catch (error) {
        console.error('Error in DNS check:', error.message);
    }
}

// Update the DNS record
async function updateDNSRecord() {
    try {

        // Check if the IP has changed
        const ipResponse = await axios.get('https://api.ipify.org?format=json');
        const publicIP = ipResponse.data.ip;
        if(currentRegistryIP === publicIP) return;

        // Update the DNS record
        console.log('Updating DNS record...');
        const dnsUpdateResponse = await axios.put(
            `https://api.cloudflare.com/client/v4/zones/${process.env.ZONE_ID}/dns_records/${process.env.RECORD_ID}`,
            {
                type: 'A',
                name: process.env.DNS_NAME,
                content: publicIP,
                ttl: 1,
                proxied: false,
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        // Check the response of the update
        if (dnsUpdateResponse.data.success) {
            currentRegistryIP = publicIP;
            console.log('Registry updated:', dnsUpdateResponse.data.result.name, '->', dnsUpdateResponse.data.result.content);
        } else {
            console.error('Error in DNS update:', dnsUpdateResponse.data.errors);
        }


    } catch (error) {
        console.error('Error in DNS update:', error.message);
    }
}

// Start the script
(async () => {

    // Check the env vars
    console.log('Checking environment variables...');
    if (!process.env.CLOUDFLARE_API_TOKEN || !process.env.ZONE_ID || !process.env.RECORD_ID || !process.env.DNS_NAME) {
        console.error('Error: Missing environment variables');
        return;
    }

    // Get the DNS record
    console.log('Getting DNS record...');
    await getDNSRecord();

    // Update the DNS record
    console.log('Starting DNS update... (Interval:', process.env.UPDATE_INTERVAL, 'ms)');
    setInterval(async () => { await updateDNSRecord(); }, process.env.UPDATE_INTERVAL);

})();