# Vocabulary and Language Study Application

This application is based on the [Mantis Free React Material UI Dashboard Template](https://github.com/codedthemes/mantis-free-react-admin-template) for theme and design considerations. The backend is entirely custom-built to support vocabulary and language study functionalities.

## Features

- **Word Management**: Add, edit, and delete words and their translations.
- **Sentence Practice**: Write sentences using your words for practice.
- **Responsive Design**: Fully responsive layout using Material UI.
- **User Authentication**: Secure login and registration system.
- **Pagination**: Efficiently handle large lists of words and sentences.

## To-Do & Roadmap
- [x] Store the user's mother tongue and target language for better practice.
- [x] Create a user-owned page that allows the user to modify their own information.
- [x] Categorize words by languages and filter them.
- [x] Export and import word lists.
- [ ] Improve sentence practice system.
- [x] Reorganization of the pages.
- [ ] Better feedback and error handling.
- [ ] Better UI/UX design and animations.
- [ ] Word practice page.
- [x] Add user profile settings.
- [x] Sentence check and advice system with AI.
- [ ] User progress tracking and analytics.
- [ ] Dark mode and theme customization.

## Technology Stack

- **Frontend**: React, Material UI
- **Backend**: Laravel, MySQL ([You can find the backend code here](https://github.com/kkrgzz/vocabx-api))
- **State Management**: React Context API
- **Routing**: React Router
- **HTTP Client**: SWR

## Getting Started

### Prerequisites

- Node.js
- Yarn or npm

### Installation

I suggest you to use Yarn instead of npn package manager.

1. Clone the repository:
    
   ```bash
   git clone https://github.com/your-username/your-repo-name.git
   ```

2. Navigate to the project directory:

   ```bash
   cd your-repo-name
   ```

3. Install the dependencies:

   ```bash
   yarn
   ```

   or

   ```bash
   npm install
   ```

### Generate Application Secret
You should generate application secret to encrypt and decrypt the user secrets. The application include a default secret but it is not safe to use. You can generate a new application secret using OpenSSL:
```bash
openssl rand -base64 24
```
Or you can generate the key wherever you want.
Change the `.env` file as follows:
```.env
VITE_ENCRYPTION_SECRET = Macha3GOyQvkj4IXZVUDxt/xGMlAodfc
...
```
Change the given secret with yours.

### Running the Application

1. Start the development server:

   ```bash
   yarn start
   ```

   or

   ```bash
   npm start
   ```

2. Open your browser and navigate to `http://localhost:3000`.

## Usage

- **Add Words**: Use the form to add new words and their translations.
- **Practice Sentences**: Write sentences using the words you have added.
- **Manage Words and Sentences**: Edit or delete words and sentences as needed.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.

## Acknowledgements

- [Mantis Free React Material UI Dashboard Template](https://github.com/codedthemes/mantis-free-react-admin-template) for the design and theme.
