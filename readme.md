# NodeJS-Cloudflare-DNS-Update

This project updates the DNS records of a domain using a DNS provider's API. (Cloudflare)

## Installations

1. Clone the repository:
    ```bash
    git clone https://github.com/your-username/NodeJS-Cloudflare-DNS-Update.git
    ```
2. Navigate to the project directory:
    ```bash
    cd NodeJS-Cloudflare-DNS-Update
    ```
3. Install the dependencies:
    ```bash
    npm install
    ```

## Usage

1. Configure your credentials and parameters in a `.env` file:
    ```env
    UPDATE_INTERVAL=60000
    CLOUDFLARE_API_TOKEN=CLOUDFLARE_TOKEN
    ZONE_ID=ZONE_ID
    RECORD_ID=RECORD_ID
    DNS_NAME=mydns.example.com
    ```

2. Run the script:
    ```bash
    npm run start
    ```

## Contributing

1. Fork the project.
2. Create a new branch (`git checkout -b feature/new-feature`).
3. Make your changes and commit them (`git commit -am 'Add new feature'`).
4. Push your changes (`git push origin feature/new-feature`).
5. Open a Pull Request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.