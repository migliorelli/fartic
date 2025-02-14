# Fartic

Fartic is a drawing game, just like Gartic.

## Access

> Working on it

## Features

### Backend

- MongoDB
- SocketIO
- Express
- MVCS design pattern

### Frontend

- Vue
- Vue Router
- Pinia
- SocketIO
- Lucide Icons
- Axios

## Installation

1. Clone this repository:

   ```bash
   git clone https://github.com/migliorelli/fartic
   cd fartic
   ```

2. Install dependencies on both directories:

   ```bash
   cd ./frontend yarn install
   cd ./backend yarn install
   ```

3. Run the development server on both directories:

   ```bash
   yarn dev:frontend
   yarn dev:backend
   ```

   or with

   ```bash
   yarn dev
   ```

4. Open your browser at [http://localhost:5173](http://localhost:5173) to view the app.

## Building for Production

>TBH I don't know how I'll do it.

## Contributing

1. Fork the project.
2. Create a new branch:

   ```bash
   git checkout -b feature/new-feature
   ```

3. Make your changes and commit them:

   ```bash
   git commit -m "Add new feature"
   ```

4. Push your changes:

   ```bash
   git push origin feature/new-feature
   ```

5. Open a Pull Request.

## Dependencies

This project uses the following dependencies:

- **Vue 3**: A progressive JavaScript framework.
- **TypeScript**: For type-safe development.
- **Vite**: A next-generation frontend tooling.
- **Lucide**: Icon library.
- **Axios**: For API requests.
- **Express**: For the backend.
- **SocketIO**: For realtime features.
- **MongoDB**: As database.

For a complete list of dependencies, see the `package.json` file of each directory.

## Icon

The project uses Lucide icons. Check out the library at [Lucide Vue Next](https://github.com/lucide-icons/lucide).

## License

This project is licensed under the [MIT License](LICENSE).

## Contact

- Author: **Migliorelli**
- Email: [miglenten@gmail.com](mailto:miglenten@gmail.com)
