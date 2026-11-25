import * as React from 'react';

const Home = () => {
    return (
        <>
            <div className="home-content">
                <h1>Authors Example</h1>
                <p>Welcome to the home page of our React frontend application.</p>
                <hr />
                <p><strong>Project Overview:</strong></p>
                <p>This is a React.js single-page application designed for seamless user experiences.</p>
                <p>The backend is powered by Laravel Lumen, a lightweight PHP micro-framework ideal for API development.</p>
                <p>Data persistence and business logic are managed through a robust MySQL database.</p>
                <p><strong>Key Features:</strong></p>
                <p>Secure authentication via JWT tokens stored in local storage.</p>
                <p>Dynamic routing to manage different views (Home, Authors, Login).</p>
                <p>Real-time data fetching from the Laravel API.</p>
            </div>
        </>
    );
};

export default Home;
