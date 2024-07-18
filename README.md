# News App

## How to use

1. clone this repo.
2. run command `npm install`
3. run command `npm run dev` // for development server

## News App Documentation

### Caching Strategy

I utilized a caching strategy to improve performance and reduce API calls.

- **Local Storage Caching**: 
  - I fetched Articles from the API are stored in the browser's `localStorage` with a timestamp.
  - Cached data is checked against its timestamp to ensure freshness (cached data older than an hour is considered stale).
  - This strategy reduces redundant API calls by fetching articles from localStorage if they exist and are within the valid time frame.

### Optimization Techniques

- **Debouncing Search Input**:
  - I used Debouncing to delay the execution of API calls while the user is typing in the search input.
  - This reduces the number of API requests made during rapid user input, enhancing performance.

- **Memoization of Components**:
  - React’s `useMemo` hook is utilized to memoize the rendering of news articles.
  - This optimization prevents unnecessary re-rendering of unchanged components, improving rendering performance.

- **Context API**:
  - I used NewsContext and NewsProvider to manage global state related to search history (searchHistory and opened articles history) and user queries (query), facilitating data sharing between components without prop drilling.

### Major Design Choices

- **Components-Container-based Architecture**:
  - The application is structured into reusable components (e.g., NewsItem, Preloader) to ensure maintainability and scalability.
  - Each component encapsulates its logic and presentation, adhering to React’s components-container-based architecture principles.

- **Custom Hooks for State Management**:
  - Business logic and state management are encapsulated into custom hooks (`useNews`) to promote reusability and separation of concerns.
  - This approach keeps components focused on rendering and enhances code readability.

- **Dark Mode Support with Tailwind CSS**:
  - The application supports dark mode using Tailwind CSS utility classes.
  - Dark mode enhances user accessibility and provides a personalized browsing experience.
